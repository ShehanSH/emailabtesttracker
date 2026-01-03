import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning";
}) {
  const styles: Record<typeof variant, string> = {
    default: "bg-muted text-foreground",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-border",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

