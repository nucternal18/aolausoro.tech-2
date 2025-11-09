import Link from "next/link"; 
import { links, social } from "../data";

export function Footer() {
  return (
    <footer className="z-50 py-12 border-t border-border bg-card/60 min-w-screen">
      <div className="px-6 mx-auto max-w-6xl">
        <div className="grid gap-8 mb-8 md:grid-cols-3">
          <div>
            <div className="flex gap-2 items-center mb-4 rounded-md">
              <img
                src={"/android-chrome-512x512.png"}
                alt="logo"
                className="w-8 h-8"
              />
            <h3 className="font-bold text-foreground">
              John A. Oladipupo-Usoro
            </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Full-Stack Developer crafting digital experiences
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="#projects"
                className="block transition-colors text-muted-foreground hover:text-primary"
              >
                Projects
              </Link>
              <Link
                href="#skills"
                className="block transition-colors text-muted-foreground hover:text-primary"
              >
                Skills
              </Link>
              <a
                href="mailto:hello@example.com"
                className="block transition-colors text-muted-foreground hover:text-primary"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              {social.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  className="transition-colors text-muted-foreground hover:text-primary"
                  rel="noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 mb-0 w-full text-current dark:text-yellow-500">
          <div className="container z-50 mx-auto my-4 text-center">
            <p className="z-50">
              © {new Date().getFullYear()} Portfolio. aolausoro.tech
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
