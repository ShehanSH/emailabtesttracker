import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { adminDb } from "@/lib/firebase/admin";
import { signUpSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signup payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const existing = await adminDb()
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "An account already exists for this email." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(parsed.data.password, 10);
    const userDoc = adminDb().collection("users").doc();

    await userDoc.set({
      email,
      name: parsed.data.name,
      password: passwordHash,
      plan: "free",
      createdAt: new Date(),
      subscription: null,
      emailVerified: null,
      image: null,
    });

    return NextResponse.json({ id: userDoc.id, email }, { status: 201 });
  } catch (error) {
    console.error("[SIGNUP_POST]", error);
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}

