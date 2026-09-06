#!/bin/bash

SCRIPT_VERSION="v1.1"
# ==============================================================================
# aolausoro.tech droplet setup script (production)
# ==============================================================================
# Adapted from Tony Teaches Tech's VPS setup script
# (https://github.com/nucternal18/ttt-vps-scripts/blob/main/setup-docker.sh),
# extended for this project's stack: Nginx as the host-level reverse proxy
# (fronted by Cloudflare in Full-strict mode with an Origin CA cert), and a
# GitHub Actions self-hosted runner so deploy-production.yml can deploy without
# SSH keys, matching the businesschamp reference workflows this was modeled from.
#
# Run this once against a freshly provisioned Ubuntu/Debian droplet.
#
# EXACTLY WHAT THIS SCRIPT DOES:
# 1. User Setup: creates a non-root deploy user, adds them to sudo.
# 2. SSH Hardening: installs a public key for the deploy user, then disables
#    password authentication entirely (key-only, per this org's baseline).
# 3. System Updates: updates and upgrades all packages.
# 4. Core Utilities & Security: ufw, curl, wget, git, gnupg, htop, fail2ban.
# 5. Auto-Patching: unattended-upgrades for security updates.
# 6. Firewall Lockdown: UFW denies all incoming except SSH/HTTP/HTTPS.
# 7. Docker Engine: installs Docker, adds the deploy user to the docker group.
# 8. Nginx: installs host-level Nginx (reverse proxy in front of the app
#    container; TLS cert is a Cloudflare Origin CA cert installed by hand,
#    not by this script).
# 9. GitHub Actions runner: registers this droplet as a self-hosted runner
#    (label 'production') so the deploy job in deploy-production.yml can run
#    directly on the droplet, and creates /opt/aolausoro owned by the deploy
#    user for the workflow to write into.
#
# SAFETY & LOGGING:
# Idempotent where practical (safe to re-run). Backs up SSH config before
# modifying it. Verbose output goes to /var/log/aolausoro-droplet-setup.log.
# ==============================================================================

set -uo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

LOG_FILE="/var/log/aolausoro-droplet-setup.log"
echo "Starting aolausoro.tech droplet setup ($SCRIPT_VERSION)..." > "$LOG_FILE"

die() {
    echo -e "\n${RED}❌ ERROR: $1${NC}"
    echo -e "${RED}Script aborted. Check log for details: cat $LOG_FILE${NC}"
    exit 1
}

step() {
    echo -e "\n${BLUE}====================================================${NC}"
    echo -e "${BLUE}[$1] $2${NC}"
    echo -e "${BLUE}====================================================${NC}"
}

ok() {
    echo -e "   ${GREEN}✔ Done${NC}"
}

info() {
    echo -e "   ${YELLOW}$1${NC}"
}

wait_for_apt() {
    if command -v fuser >/dev/null 2>&1; then
        while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || fuser /var/lib/dpkg/lock >/dev/null 2>&1; do
            info "Waiting for background apt processes to finish..."
            sleep 5
        done
    fi
}

# ============================================================
# 0. INITIAL CHECKS
# ============================================================

[ "$EUID" -ne 0 ] && die "Run with: sudo bash setup-droplet.sh"

command -v apt-get >/dev/null 2>&1 || die "Unsupported OS (Debian/Ubuntu required)"
command -v systemctl >/dev/null 2>&1 || die "Systemd required"

echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}   aolausoro.tech droplet setup ${SCRIPT_VERSION}${NC}"
echo -e "${BLUE}====================================================${NC}"

# ============================================================
# 0. ENVIRONMENT
# ============================================================

ENVIRONMENT="production"
DOMAIN="portfolio.aolausoro.tech"
NGINX_CONF="production.conf"

info "Configuring this droplet for: $ENVIRONMENT ($DOMAIN)"

# ============================================================
# 1. USER SETUP
# ============================================================

step "1/9" "Create the deploy user"

while true; do
    read -r -p "Enter deploy username (default: aolausoro): " NEW_USER </dev/tty

    if [ -z "${NEW_USER:-}" ]; then
        NEW_USER="aolausoro"
        info "Using default user: aolausoro"
    fi

    NEW_USER=$(echo "$NEW_USER" | tr '[:upper:]' '[:lower:]')

    if [[ "$NEW_USER" =~ ^(root|admin|ubuntu|daemon)$ ]]; then
        info "Error: '$NEW_USER' is a reserved name. Try again."
        continue
    fi

    if [[ ! "$NEW_USER" =~ ^[a-z][a-z0-9_-]{0,31}$ ]]; then
        info "Error: Invalid format. Must start with a letter and contain no spaces."
        continue
    fi

    break
done

if id "$NEW_USER" &>/dev/null; then
    info "User '$NEW_USER' already exists"
else
    adduser "$NEW_USER" </dev/tty || die "Failed to create user '$NEW_USER'"
    info "Created user '$NEW_USER'"
fi

usermod -aG sudo "$NEW_USER" || die "Failed to add '$NEW_USER' to sudo group"
info "Added user '$NEW_USER' to sudo group"

ok

# ============================================================
# 2. SSH SAFETY
# ============================================================

step "2/9" "Secure SSH"

# Key-only SSH is a non-negotiable per this org's baseline hardening (see
# CLAUDE.md). Password auth is disabled below, so we install at least one
# public key for $NEW_USER first — otherwise this step would lock everyone
# out of a fresh droplet with no working access method.

USER_SSH_DIR="/home/$NEW_USER/.ssh"
AUTHORIZED_KEYS="$USER_SSH_DIR/authorized_keys"

mkdir -p "$USER_SSH_DIR"
touch "$AUTHORIZED_KEYS"

if [ -s "$AUTHORIZED_KEYS" ]; then
    info "authorized_keys already has $(wc -l < "$AUTHORIZED_KEYS") key(s) for '$NEW_USER'"
else
    echo "No SSH public key on file for '$NEW_USER' yet."
    echo "Paste one or more public keys (e.g. the contents of ~/.ssh/id_ed25519.pub), one per line."
    echo "Leave a line blank to finish."
    while true; do
        read -r -p "Public key: " PUB_KEY </dev/tty
        [ -z "$PUB_KEY" ] && break
        if [[ ! "$PUB_KEY" =~ ^(ssh-ed25519|ssh-rsa|ecdsa-sha2-) ]]; then
            info "Doesn't look like a valid public key (expected ssh-ed25519/ssh-rsa/ecdsa-sha2-...). Skipped."
            continue
        fi
        echo "$PUB_KEY" >> "$AUTHORIZED_KEYS"
        info "Added key."
    done
fi

[ ! -s "$AUTHORIZED_KEYS" ] && die "No SSH public key was provided for '$NEW_USER' — refusing to disable password authentication with no working access method. Re-run this step once you have a key ready."

chmod 700 "$USER_SSH_DIR"
chmod 600 "$AUTHORIZED_KEYS"
chown -R "$NEW_USER":"$NEW_USER" "$USER_SSH_DIR"
info "Installed $(wc -l < "$AUTHORIZED_KEYS") public key(s) for '$NEW_USER'"

SSH_CONFIG="/etc/ssh/sshd_config"
SSH_BACKUP="/etc/ssh/sshd_config.bak"
SSH_DROP_IN="/etc/ssh/sshd_config.d/10-aolausoro.conf"

if [ ! -f "$SSH_BACKUP" ]; then
    cp "$SSH_CONFIG" "$SSH_BACKUP" || die "Failed to back up SSH config"
    info "Backed up SSH config"
fi

cat > "$SSH_DROP_IN" <<EOF || die "Failed to write SSH configuration"
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
EOF

if ! sshd -t; then
    rm -f "$SSH_DROP_IN"
    die "Invalid SSH configuration"
fi

if [ "$(sshd -T | awk '$1 == "passwordauthentication" {print $2}')" != "no" ]; then
    rm -f "$SSH_DROP_IN"
    die "Password authentication is being overridden by another SSH configuration and could not be disabled"
fi

systemctl restart ssh 2>/dev/null || systemctl restart sshd || die "Failed to restart SSH"
info "Secured and restarted SSH — key-only auth for '$NEW_USER', password auth disabled"

ok

# ============================================================
# 3. SYSTEM UPDATE
# ============================================================

step "3/9" "Updating system"

wait_for_apt
apt-get update -qq >> "$LOG_FILE" 2>&1 || die "apt update failed"
info "Updated package lists"

wait_for_apt
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq >> "$LOG_FILE" 2>&1 || die "upgrade failed"
info "Upgraded system packages"

ok

# ============================================================
# 4. RECOMMENDED PACKAGES
# ============================================================

step "4/9" "Installing recommended packages"

PACKAGES="ufw curl wget git ca-certificates gnupg fail2ban htop jq"

wait_for_apt
DEBIAN_FRONTEND=noninteractive apt-get install -y $PACKAGES >> "$LOG_FILE" 2>&1 \
    || die "package install failed"

systemctl enable --now fail2ban >> "$LOG_FILE" 2>&1 || die "Failed to enable or start Fail2Ban"

info "Installed the following packages:"
for pkg in $PACKAGES; do
    echo -e "   ${YELLOW}- $pkg${NC}"
done

ok

# ============================================================
# 5. SECURITY UPDATES
# ============================================================

step "5/9" "Enabling automatic security updates"

wait_for_apt
DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades >> "$LOG_FILE" 2>&1 \
    || die "failed to install unattended-upgrades"

echo unattended-upgrades unattended-upgrades/enable_auto_updates boolean true \
    | debconf-set-selections >> "$LOG_FILE" 2>&1 || die "failed to configure unattended-upgrades"

DEBIAN_FRONTEND=noninteractive dpkg-reconfigure -f noninteractive unattended-upgrades \
    >> "$LOG_FILE" 2>&1 || die "failed to enable unattended-upgrades"

info "Enabled automatic security updates"

ok

# ============================================================
# 6. FIREWALL
# ============================================================

step "6/9" "Configuring ufw firewall"
# Mirrors the DO Cloud Firewall documented in docs/production-deployment-plan.md
# (22/80/443 only) — UFW is a second layer on the droplet itself.

ufw default deny incoming >> "$LOG_FILE" 2>&1 || die "ufw deny incoming failed"
info "Set default policy: Deny incoming"

ufw default allow outgoing >> "$LOG_FILE" 2>&1 || die "ufw allow outgoing failed"
info "Set default policy: Allow outgoing"

ufw allow OpenSSH >> "$LOG_FILE" 2>&1 || die "ufw ssh rule failed"
ufw allow 80/tcp >> "$LOG_FILE" 2>&1 || die "ufw http rule failed"
ufw allow 443/tcp >> "$LOG_FILE" 2>&1 || die "ufw https rule failed"
info "Allowed SSH, HTTP (80), and HTTPS (443)"

ufw --force enable >> "$LOG_FILE" 2>&1 || die "ufw enable failed"
info "Enabled UFW firewall"

ok

# ============================================================
# 7. DOCKER
# ============================================================

step "7/9" "Installing Docker"

if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com -o /tmp/docker.sh >> "$LOG_FILE" 2>&1 \
        || die "docker download failed"
    info "Downloaded Docker install script"

    wait_for_apt
    sh /tmp/docker.sh >> "$LOG_FILE" 2>&1 || die "docker install failed"
    info "Installed Docker Engine"
else
    info "Docker already installed"
fi

systemctl enable --now docker >> "$LOG_FILE" 2>&1 || die "Docker service start failed"
info "Started Docker daemon"

usermod -aG docker "$NEW_USER" >> "$LOG_FILE" 2>&1 || die "docker group add failed"
info "Added user '$NEW_USER' to docker group"

ok

# ============================================================
# 8. NGINX (host-level reverse proxy)
# ============================================================

step "8/9" "Installing Nginx"

if ! command -v nginx >/dev/null 2>&1; then
    wait_for_apt
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx >> "$LOG_FILE" 2>&1 \
        || die "nginx install failed"
    info "Installed Nginx"
else
    info "Nginx already installed"
fi

systemctl enable --now nginx >> "$LOG_FILE" 2>&1 || die "Nginx service start failed"
mkdir -p /etc/ssl/cloudflare
info "Started Nginx. Copy deploy/nginx/$NGINX_CONF to /etc/nginx/sites-available/,"
info "symlink it into sites-enabled/, and install the Cloudflare Origin CA cert at"
info "/etc/ssl/cloudflare/$DOMAIN.{pem,key} — this script does not do that for you"
info "(the cert has to be issued by hand from the Cloudflare dashboard)."

ok

# ============================================================
# 9. GITHUB ACTIONS SELF-HOSTED RUNNER
# ============================================================

step "9/9" "Registering GitHub Actions self-hosted runner"

mkdir -p /opt/aolausoro
chown "$NEW_USER":"$NEW_USER" /opt/aolausoro
info "Created /opt/aolausoro (owned by $NEW_USER) for the deploy workflow to write into"

read -r -p "Register a GitHub Actions runner now? [y/N]: " DO_RUNNER </dev/tty
if [[ "$DO_RUNNER" =~ ^[Yy]$ ]]; then
    read -r -p "Repo URL (default: https://github.com/nucternal18/aolausoro.tech-2): " REPO_URL </dev/tty
    REPO_URL="${REPO_URL:-https://github.com/nucternal18/aolausoro.tech-2}"

    echo "A runner registration token is short-lived (~1 hour). Get one from:"
    echo "  $REPO_URL/settings/actions/runners/new"
    echo "or: gh api -X POST repos/nucternal18/aolausoro.tech-2/actions/runners/registration-token --jq .token"
    read -r -s -p "Registration token: " RUNNER_TOKEN </dev/tty
    echo

    [ -z "$RUNNER_TOKEN" ] && die "No registration token provided"

    RUNNER_VERSION=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest \
        | grep -oP '"tag_name": "v\K[^"]+') \
        || die "Failed to look up latest runner version"
    [ -z "$RUNNER_VERSION" ] && die "Could not determine latest runner version"
    info "Latest runner version: v$RUNNER_VERSION"

    RUNNER_DIR="/home/$NEW_USER/actions-runner"
    mkdir -p "$RUNNER_DIR"

    ARCH=$(uname -m)
    case "$ARCH" in
        x86_64) RUNNER_ARCH="x64" ;;
        aarch64) RUNNER_ARCH="arm64" ;;
        *) die "Unsupported architecture: $ARCH" ;;
    esac

    curl -fsSL -o "$RUNNER_DIR/runner.tar.gz" \
        "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz" \
        >> "$LOG_FILE" 2>&1 || die "Failed to download runner package"

    tar xzf "$RUNNER_DIR/runner.tar.gz" -C "$RUNNER_DIR" || die "Failed to extract runner package"
    rm -f "$RUNNER_DIR/runner.tar.gz"
    chown -R "$NEW_USER":"$NEW_USER" "$RUNNER_DIR"
    info "Downloaded and extracted the runner"

    RUNNER_NAME="$(hostname)-$ENVIRONMENT"
    sudo -u "$NEW_USER" "$RUNNER_DIR/config.sh" --url "$REPO_URL" --token "$RUNNER_TOKEN" \
        --labels "production" --name "$RUNNER_NAME" --work "_work" --unattended \
        >> "$LOG_FILE" 2>&1 || die "Runner configuration failed"
    info "Configured runner '$RUNNER_NAME' with label 'production'"

    ("$RUNNER_DIR/svc.sh" install "$NEW_USER" && "$RUNNER_DIR/svc.sh" start) \
        >> "$LOG_FILE" 2>&1 || die "Failed to install/start the runner service"
    info "Installed and started the runner as a systemd service"
else
    info "Skipped. Re-run this section manually later, or follow:"
    info "  https://github.com/nucternal18/aolausoro.tech-2/settings/actions/runners/new"
    info "  and register with --labels production so deploy-production.yml can find it."
fi

ok

# ============================================================
# FINAL OUTPUT
# ============================================================

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}            🎉 SETUP COMPLETE                       ${NC}"
echo -e "${BLUE}====================================================${NC}\n"

IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
[ -z "$IP" ] && IP=$(hostname -I | awk '{print $1}')
[ -z "$IP" ] && IP="YOUR_SERVER_IP"

DOC="docs/production-deployment-plan.md"

echo "Remaining manual steps (see $DOC):"
echo "  1. Point DNS for $DOMAIN at this droplet via Cloudflare (proxied)."
echo "  2. Issue a Cloudflare Origin CA cert and install it at"
echo "     /etc/ssl/cloudflare/$DOMAIN.{pem,key}."
echo "  3. Install deploy/nginx/$NGINX_CONF and reload nginx."
echo "  4. Set Cloudflare SSL/TLS mode to Full (strict)."
echo "  5. Configure the 'production' GitHub Environment secrets (see the deploy workflow)."
echo
echo "1. Type 'exit' to log out of this root session."
echo -e "2. Reconnect using: ${GREEN}ssh $NEW_USER@$IP${NC}\n"

if [ -f /var/run/reboot-required ]; then
    echo -e "${YELLOW}A reboot is recommended before the runner picks up its first job.${NC}"
fi
