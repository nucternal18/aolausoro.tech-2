import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin/:path*") {
        if (token) return !!token.user.isAdmin;
      }
      // `/me` only requires the user to be logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/admin",
    "/admin/projects",
    "/admin/projects/:path*",
    "/admin/jobs",
    "/admin/jobs/:path*",
    "/admin/jobs/add-job",
    "/admin/messages",
    "/admin/messages/:path*",
    "/auth/user-profile",
  ],
};
