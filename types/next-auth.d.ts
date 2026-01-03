import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      plan?: string | null;
    };
  }

  interface User {
    plan?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    plan?: string | null;
  }
}

