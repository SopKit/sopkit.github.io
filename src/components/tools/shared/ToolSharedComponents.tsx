/**
 * @file src/components/tools/shared/ToolSharedComponents.tsx
 * @description Editorial documentation-style presentation components for SopKit tool pages.
 * Designed with restraint, strong typography, high information density, and zero card bloat.
 */

import { Check, HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Deprecated generic trust banner: returns null to eliminate repeated boilerplate cards.
 */
export const ToolTrust = () => null;

export interface ToolFeaturesProps {
  features?: string[];
  toolName?: string;
}

export const ToolFeatures = ({ features, toolName }: ToolFeaturesProps) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="scroll-mt-16 space-y-4 pt-6 border-t border-border/60" aria-label="Key features">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Key Capabilities & Highlights
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Task-oriented features built directly into this {toolName || "tool"} workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-xs sm:text-sm text-foreground/90 leading-snug font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export interface ToolStep {
  name: string;
  text: string;
}

export interface ToolStepsProps {
  steps?: ToolStep[];
  toolName: string;
}

export const ToolSteps = ({ steps, toolName }: ToolStepsProps) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="scroll-mt-16 space-y-4 pt-6 border-t border-border/60" aria-label={`How to use ${toolName}`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          How to Use {toolName}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Follow these sequential steps to complete your task with zero friction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-muted/15"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {step.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolFAQProps {
  faqs?: FAQ[];
  toolName: string;
}

export const ToolFAQ = ({ faqs, toolName }: ToolFAQProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="scroll-mt-16 space-y-4 pt-6 border-t border-border/60" aria-label="Frequently Asked Questions">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Direct, honest answers about privacy, limitations, and usage.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full divide-y divide-border/60 pt-1">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border/60">
            <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline hover:text-primary py-3.5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
