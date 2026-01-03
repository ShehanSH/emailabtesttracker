import { authConfig } from "@/lib/auth/config";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

// Export auth function using getServerSession (NextAuth v4 pattern)
export async function auth(): Promise<Session | null> {
  try {
    const session = (await getServerSession(authConfig as any)) as Session | null;
    return session;
  } catch (error) {
    console.error("[AUTH_ERROR]", error);
    return null;
  }
}

