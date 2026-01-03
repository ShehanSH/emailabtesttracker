import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { UserMenu } from "./user-menu";
import type { Session } from "next-auth";

export async function MainNav() {
  const session = (await auth()) as Session | null;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              ET
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                Email Template Tracker
              </div>
              <p className="text-sm text-muted-foreground">
                Versioning + A/B test performance
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {session?.user && (
            <Link
              href="/templates"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Templates
            </Link>
          )}
          {session?.user && (
            <Link
              href="/ab-tests"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              A/B Tests
            </Link>
          )}
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          {session?.user ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link href="/signup">
                <Button size="sm">Start free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

