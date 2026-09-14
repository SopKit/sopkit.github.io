import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ShieldCheck, Zap, UserX, Code2 } from "lucide-react";

interface TrustPillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side Privacy",
    tagline: "Your data stays on your machine",
    description:
      "Files, images, PDF documents, and text never leave your browser sandbox. Computations run locally via WebAssembly and Canvas APIs.",
  },
  {
    icon: Zap,
    title: "Sub-Second Execution",
    tagline: "Zero queue, zero latency",
    description:
      "Without round-trips to remote cloud queues, processing is bound only by your device's hardware. Instant conversions and edits.",
  },
  {
    icon: UserX,
    title: "Zero Account Friction",
    tagline: "No sign-up, no email capture",
    description:
      "Every single utility is available immediately. No paywalls, no credit cards, no subscriptions, and no quota countdowns.",
  },
  {
    icon: Code2,
    title: "Embed Anywhere",
    tagline: "Clean, responsive iframe widgets",
    description:
      "Integrate any SopKit tool into your blog, documentation, or internal intranet using our ad-free lightweight embed endpoint.",
  },
];

export function TrustSection() {
  return (
    <Section padding="loose" className="relative bg-stone-100/50 dark:bg-stone-900/30">
      <Container size="xl">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
            Why SopKit
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]">
            Engineered for speed, privacy, and absolute focus.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
            Most online utilities upload your private files to remote servers, force account creation,
            or impose hidden fees. SopKit takes the opposite path: running entirely inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-stone-400 dark:hover:border-stone-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:bg-stone-900 group-hover:text-white dark:group-hover:bg-stone-100 dark:group-hover:text-stone-900 transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-stone-400 dark:text-stone-600">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mb-3">
                    {pillar.tagline}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
