"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export type FaqItem = { q: string; a: string };

export function LandingFaq({ items }: { items: FaqItem[] }) {
  return (
    <Card className="border-border/80 bg-card/80 p-2 shadow-sm backdrop-blur-sm sm:p-3">
      <Accordion type="single" collapsible className="w-full px-2">
        {items.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
