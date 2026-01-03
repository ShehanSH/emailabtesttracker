import { cert } from "firebase-admin/app";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { adminDb } from "@/lib/firebase/admin";
import { signInSchema } from "@/lib/validators/auth";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasAdminCredentials =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(privateKey);

const credential = hasAdminCredentials
  ? cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    })
  : undefined;

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!hasAdminCredentials) {
        throw new Error(
          "Firebase admin credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
        );
      }

      const parsed = signInSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const userSnapshot = await adminDb()
        .collection("users")
        .where("email", "==", parsed.data.email.toLowerCase())
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        return null;
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      if (!userData.password) {
        return null;
      }

      const isValid = await compare(parsed.data.password, userData.password);
      if (!isValid) {
        return null;
      }

      return {
        id: userDoc.id,
        email: userData.email,
        name: userData.name ?? userData.email,
        plan: userData.plan ?? "free",
      };
    },
  }),
] as NonNullable<NextAuthConfig["providers"]>;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authConfig: NextAuthConfig = {
  // Don't use adapter for Google OAuth - we'll handle it manually
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in - create user in Firestore if doesn't exist
      if (account?.provider === "google" && hasAdminCredentials && user.email) {
        try {
          const email = user.email.toLowerCase();
          const userSnapshot = await adminDb()
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

          if (userSnapshot.empty) {
            // Create new user in Firestore with our structure
            const newUserRef = adminDb().collection("users").doc();
            const userData = {
              email: email,
              name: user.name ?? user.email ?? email,
              plan: "free",
              createdAt: new Date(),
              subscription: null,
              emailVerified: new Date(), // Google emails are verified
              image: user.image ?? null,
            };
            await newUserRef.set(userData);
            // Set user id to match Firestore document id - this is critical!
            user.id = newUserRef.id;
            console.log("[GOOGLE_SIGNUP] Created new user:", newUserRef.id);
          } else {
            // User exists, use existing id and update name/image if needed
            const existingUser = userSnapshot.docs[0];
            user.id = existingUser.id;
            const existingData = existingUser.data();
            console.log("[GOOGLE_SIGNIN] Existing user found:", existingUser.id);
            
            // Update user data if name or image changed
            if (user.name && existingData.name !== user.name) {
              await existingUser.ref.update({
                name: user.name,
                image: user.image ?? existingData.image,
              });
            }
          }
        } catch (error) {
          console.error("[GOOGLE_SIGNIN_ERROR]", error);
          return false; // Prevent sign in if there's an error
        }
      }
      // For credentials provider, always allow
      if (account?.provider === "credentials") {
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = (user as any).id ?? token.sub;
        token.plan = (user as any).plan ?? "free";
        token.email = user.email ?? token.email;
      }

      // For Google OAuth, fetch user plan from Firestore
      if (token.sub && hasAdminCredentials) {
        try {
          const userRef = await adminDb().collection("users").doc(token.sub).get();
          if (userRef.exists) {
            const data = userRef.data();
            token.plan = data?.plan ?? token.plan ?? "free";
            token.email = data?.email ?? token.email;
          }
        } catch (error) {
          console.error("[JWT_CALLBACK_ERROR]", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.plan = (token as any).plan ?? "free";
        if (token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If callbackUrl is provided and it's a relative path, use it
      if (url.startsWith("/")) {
        // If it's the login page, redirect to dashboard instead
        if (url === "/login" || url === "/signup") {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      // If it's an absolute URL from our domain, use it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default: always redirect to dashboard after successful auth
      return `${baseUrl}/dashboard`;
    },
  },
};

