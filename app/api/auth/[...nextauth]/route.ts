import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import type { NextRequest } from "next/server";

const handler = NextAuth(authConfig);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  return handler(req, { params });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  return handler(req, { params });
}

