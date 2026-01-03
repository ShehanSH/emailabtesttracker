import Link from "next/link";
import { ArrowRight, BarChart3, FolderGit2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const featureCards = [
  {
    title: "Git-like template versioning",
    description:
      "Track every change (v1.0 → v1.1 → v2.0) so teams never lose the winning email.",
    icon: <FolderGit2 className="h-5 w-5 text-foreground" />,
  },
  {
    title: "One-click A/B tests",
    description:
      "Generate tracking URLs, ship to your ESP, and watch results stream in real time.",
    icon: <BarChart3 className="h-5 w-5 text-foreground" />,
  },
  {
    title: "Secure by default",
    description:
      "Firebase Auth + Firestore security rules keep client data isolated and safe.",
    icon: <ShieldCheck className="h-5 w-5 text-foreground" />,
  },
];

const pricing = [
  {
    title: "Free",
    price: "$0",
    desc: "5 templates, basic tracking — perfect validation tier.",
    cta: "Start free",
  },
  {
    title: "Solo",
    price: "$19/mo",
    desc: "Unlimited templates + A/B runner for freelancers.",
    cta: "Choose Solo",
  },
  {
    title: "Agency",
    price: "$49/mo",
    desc: "Team workspaces, insights library, and advanced analytics.",
    cta: "Scale clients",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-14 md:py-16">
      <section className="grid items-center gap-10 rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-white/40 backdrop-blur md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Badge className="bg-muted text-foreground">
            Email Template Versioning & A/B Tracker
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Ship winning email templates without spreadsheets.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Store every template version, run one-click A/B tests, and watch
              real-time performance dashboards. Built for freelance email
              marketers and lean agencies that need fast answers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start free workspace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                View live dashboard
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>• Firebase Auth + Firestore</span>
            <span>• Next.js 15 / React 19</span>
            <span>• Stripe billing ready</span>
            <span>• GrapesJS editor slot</span>
          </div>
        </div>
        <Card className="h-full w-full space-y-4">
          <p className="text-sm font-medium text-foreground">
            MVP milestones (Weeks 1-4)
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>✅ Firebase Auth + NextAuth session bridge</li>
            <li>✅ Firestore collections: users, templates, versions, tests</li>
            <li>✅ API routes for template CRUD + versioning</li>
            <li>🚧 Dashboard + tracking endpoints</li>
          </ul>
          <div className="rounded-lg bg-muted p-4 text-sm text-foreground">
            Shipping for solo builders: deploy to Vercel, plug in Firebase
            credentials, and start onboarding clients.
          </div>
        </Card>
      </section>

      <section id="features" className="space-y-8">
        <div className="space-y-3">
          <Badge>Product pillars</Badge>
          <h2 className="text-2xl font-semibold text-foreground">
            Everything you need to test emails like a product team.
          </h2>
          <p className="text-muted-foreground">
            Version templates like code, generate tracking links, and surface
            the winners with clear analytics.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-white/40"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3">Pricing</Badge>
            <h2 className="text-2xl font-semibold text-foreground">
              Clear plans for freelancers and agencies.
            </h2>
            <p className="text-muted-foreground">
              Free tier for validation, paid tiers for collaboration and API
              access.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Stripe checkout + webhooks wired into Firestore subscription status.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <Card key={tier.title} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.title}
                </h3>
                {tier.title === "Free" && (
                  <Badge variant="success">Best to start</Badge>
                )}
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {tier.price}
              </p>
              <p className="text-sm text-muted-foreground">{tier.desc}</p>
              <Button variant={tier.title === "Free" ? "secondary" : "primary"}>
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <Card className="flex flex-col items-start gap-4 bg-foreground text-background md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-background/70">
            Ready to ship
          </p>
          <h3 className="text-xl font-semibold">
            Deploy on Vercel + Firebase in under 10 minutes.
          </h3>
          <p className="text-sm text-background/80">
            Add your Firebase + Stripe keys, invite a teammate, and start
            tracking template wins.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/signup">
            <Button variant="secondary" className="bg-background text-foreground">
              Create account
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-background">
              View dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
