import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Ajouter des en-têtes de sécurité
    const headers = new Headers(req.headers);
    headers.set("x-url", req.url);

    return NextResponse.next({
      request: {
        headers,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Routes qui nécessitent une authentification (on retire la route racine)
    "/api/todos/:path*",
  ],
};
