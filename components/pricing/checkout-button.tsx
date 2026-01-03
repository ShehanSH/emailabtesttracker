"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Plan } from "@/lib/plans";

interface CheckoutButtonProps {
  plan: Plan;
  currentPlan: Plan;
  disabled?: boolean;
}

export function CheckoutButton({ plan, currentPlan, disabled }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || plan === "free" || plan === currentPlan) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/billing/checkout?plan=${plan}`, {
        method: "GET",
        redirect: "follow",
      });
      
      // If redirect failed, show message
      if (!response.ok) {
        alert("Stripe is not configured. Please contact support or configure Stripe keys.");
        setLoading(false);
        return;
      }
      
      // Follow redirect if successful
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to process checkout. Stripe may not be configured.");
      setLoading(false);
    }
  };

  if (plan === currentPlan) {
    return (
      <Button disabled className="w-full" variant="secondary">
        Current Plan
      </Button>
    );
  }

  if (plan === "free") {
    return null;
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className="w-full"
    >
      {loading ? "Loading..." : currentPlan === "free" ? "Upgrade" : "Switch Plan"}
    </Button>
  );
}

