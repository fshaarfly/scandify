import { cn } from "@/lib/utils";

export const authInputClass = cn(
  "h-12 w-full rounded-xl border border-border/80 bg-background/80 px-4 text-base shadow-sm outline-none",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
  "disabled:opacity-60",
);
