import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { PLAN_PRICING, type Plan } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const plan = searchParams.get("plan") as Plan;

  if (!plan || !["solo", "agency", "pro"].includes(plan)) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  try {
    const pricing = PLAN_PRICING[plan];
    const priceId = process.env[`STRIPE_PRICE_ID_${plan.toUpperCase()}`];

    if (!priceId || !process.env.STRIPE_SECRET_KEY) {
      console.error(`Missing STRIPE_PRICE_ID_${plan.toUpperCase()} or STRIPE_SECRET_KEY in environment`);
      // Redirect back to pricing with error message instead of showing JSON error
      const url = new URL("/pricing", req.url);
      url.searchParams.set("error", "stripe_not_configured");
      return NextResponse.redirect(url);
    }

    // Create or retrieve Stripe customer
    const userDoc = await adminDb().collection("users").doc(session.user.id).get();
    const userData = userDoc.data();
    let customerId = userData?.subscription?.stripeId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await adminDb().collection("users").doc(session.user.id).update({
        "subscription.stripeId": customerId,
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    });

    return NextResponse.redirect(checkoutSession.url || "/pricing");
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

