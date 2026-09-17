"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/constants/config";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do SopKit tools process files without uploading to a server?",
    answer:
      "All processing happens locally inside your browser's execution sandbox using client-side JavaScript, WebAssembly (Wasm), and HTML5 Canvas / Web Worker APIs. When you select or drop a file, it is read into your device's memory directly. Your sensitive data is never sent across the internet to our or any third-party servers.",
  },
  {
    question: "Is SopKit completely free with no usage limits?",
    answer:
      "Yes. Every utility on SopKit is 100% free with no trial periods, daily limits, or hidden paywalls. Because computations run on your machine rather than incurring expensive server hosting compute, we can keep the platform open for everyone indefinitely.",
  },
  {
    question: "Do I need to sign up or create an account?",
    answer:
      "Never. We do not require registration, sign-in, or email addresses. You can immediately access any tool, perform your task, and download the results with zero friction.",
  },
  {
    question: "Can I embed SopKit tools into my own website or documentation?",
    answer:
      `Yes! Every interactive tool supports our dedicated embed route. You can add an iframe pointing to ${SITE_CONFIG.siteUrl}/embed-tool/?id=<tool-id> for a clean, distraction-free widget that fits seamlessly into your site.`,
  },
  {
    question: "Does SopKit work on smartphones and tablets?",
    answer:
      "Yes. All interfaces are responsive and touch-optimized, adapting cleanly to mobile screens, tablets, laptops, and ultra-wide desktop monitors.",
  },
  {
    question: "How do I request a new tool or report an issue?",
    answer:
      `SopKit is open on GitHub. You can file an issue, suggest a utility, or contribute code directly on our GitHub repository at ${SITE_CONFIG.githubRepoUrl.replace(/^https?:\/\//, "")}.`,
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section padding="loose" className="relative">
      <Container size="lg">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
            Questions & Answers
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300">
            Clear, honest answers about our client-side architecture, privacy, and licensing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-200 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-5 sm:py-6">
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-lg p-1 -m-1"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-3 pr-8 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed animate-in fade-in-50 duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
