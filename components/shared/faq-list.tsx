"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * FAQ accordion.
 *
 * `type="single" collapsible` — one answer at a time, and it can be closed
 * again. The matching FAQPage structured data is emitted separately by the
 * page from the same array, so the visible content and the markup can never
 * disagree.
 */
export function FaqList({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (faqs.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
