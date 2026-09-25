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
    title: "Local-First Sandbox",
    tagline: "Files stay on your machine",
    description:
      "Image, PDF, code, and text utilities run directly in your browser with WebAssembly and Canvas APIs. Your files never touch our servers.",
  },
  {
    icon: Zap,
    title: "Hardware-Speed Processing",
    tagline: "No upload queues or delays",
    description:
      "Conversions run on your CPU and GPU instead of a shared server queue. Edits and downloads happen as fast as your device can compute.",
  },
  {
    icon: UserX,
    title: "No Mandatory Accounts",
    tagline: "Start working immediately",
    description:
      "Open any utility and start working. We never require email registration, phone verification, or credit cards for core tools.",
  },
  {
    icon: Code2,
    title: "Embeddable Sandboxes",
    tagline: "Clean iframe widgets",
    description:
      "Drop any SopKit utility into your blog, documentation, or portal using our dedicated embed endpoint with zero server overhead.",
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
