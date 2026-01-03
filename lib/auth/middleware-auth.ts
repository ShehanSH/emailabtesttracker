// Lightweight auth function for middleware (Edge runtime compatible)
// This doesn't import firebase-admin, only uses NextAuth session
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getMiddlewareSession(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return null;
    }

    return {
      user: {
        id: token.sub as string,
        email: token.email as string,
        name: token.name as string,
        plan: (token.plan as string) || "free",
      },
    };
  } catch (error) {
    console.error("[MIDDLEWARE_AUTH_ERROR]", error);
    return null;
  }
}

