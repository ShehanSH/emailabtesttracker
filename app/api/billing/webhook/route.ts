import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import type { Plan } from "@/types/firestore";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover",
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 500 }
    );
  }
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_ERROR]", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as Plan;

        if (userId && plan) {
          await adminDb().collection("users").doc(userId).update({
            plan: plan,
            subscription: {
              stripeId: session.customer as string,
              status: "active",
              renewsAt: null, // Will be set by subscription.updated
            },
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const usersSnapshot = await adminDb()
          .collection("users")
          .where("subscription.stripeId", "==", customerId)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          const plan = subscription.metadata?.plan as Plan;
          const renewsAtUnix = (subscription as Stripe.Subscription & { current_period_end?: number })
            .current_period_end;

          await userDoc.ref.update({
            plan: plan || "free",
            subscription: {
              stripeId: customerId,
              status: subscription.status,
              renewsAt: typeof renewsAtUnix === "number"
                ? new Date(renewsAtUnix * 1000)
                : null,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersSnapshot = await adminDb()
          .collection("users")
          .where("subscription.stripeId", "==", customerId)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            plan: "free",
            subscription: {
              stripeId: customerId,
              status: "canceled",
              renewsAt: null,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_HANDLER_ERROR]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

