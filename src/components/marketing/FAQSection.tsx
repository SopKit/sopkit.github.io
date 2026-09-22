"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SITE_CONFIG } from "@/constants/config";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Are SopKit tools really free?",
    answer:
      "Yes. SopKit's tools are available to use for free without requiring an account or subscription. Individual tools may have practical browser or device limits depending on the task and file size.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can open a tool, process your files, and download the result without signing up or providing an email address.",
  },
  {
    question: "Are my files uploaded to SopKit?",
    answer:
      "SopKit is designed around browser-first processing. Tools that support local processing keep the selected files in your browser rather than uploading them to SopKit's servers. Check the processing information shown on an individual tool for its specific execution model.",
  },
  {
    question: "What kinds of tools are available?",
    answer:
      "SopKit includes utilities for images, PDFs, video, audio, developer workflows, SEO, text, data, and other everyday web tasks. The tool directory lets you search and filter the available utilities.",
  },
  {
    question: "Can I use SopKit on my phone?",
    answer:
      "Yes. SopKit is responsive and designed for touch devices as well as desktop browsers. For large files or compute-heavy operations, performance can still depend on your device and browser.",
  },
  {
    question: "Can I embed a SopKit tool on my website?",
    answer: (
      <>
        Yes. Supported tools can be embedded using their dedicated embed route. Use{" "}
        <code className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[0.9em] text-stone-800 dark:bg-stone-800 dark:text-stone-200">
          {SITE_CONFIG.siteUrl}/embed-tool/?id=&lt;tool-id&gt;
        </code>{" "}
        to create a focused tool experience for your site or documentation.
      </>
    ),
  },
  {
    question: "How do I suggest a tool or report a bug?",
    answer: (
      <>
        SopKit is open source. You can suggest an improvement, report a problem, or contribute code through the{" "}
        <a
          href={SITE_CONFIG.githubRepoUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4 hover:no-underline"
        >
          SopKit GitHub repository
        </a>
        .
      </>
    ),
  },
];

function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          typeof item.answer === "string"
            ? item.answer
            : item.question === "Can I embed a SopKit tool on my website?"
              ? `Yes. Supported tools can be embedded using their dedicated embed route: ${SITE_CONFIG.siteUrl}/embed-tool/?id=<tool-id>.`
              : "SopKit is open source. You can suggest an improvement, report a problem, or contribute code through the SopKit GitHub repository.",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingId = useId();

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <FAQSchema />

      <Section padding="loose" className="relative overflow-hidden">
        <Container size="lg">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              Help & answers
            </p>
            <h2
              id={headingId}
              className="font-serif text-3xl font-normal leading-[1.12] tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-5xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base">
              Straightforward answers about privacy, usage, devices, embedding, and contributing to SopKit.
            </p>
          </div>

          <div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white/70 shadow-sm dark:border-stone-800 dark:bg-stone-950/40"
            role="region"
            aria-labelledby={headingId}
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={item.question}
                  className="border-b border-stone-200 last:border-b-0 dark:border-stone-800"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    aria-expanded={isOpen}
                    className="group flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-400 dark:hover:bg-stone-900/60 sm:px-6"
                  >
                    <span className="text-sm font-medium leading-6 text-stone-900 dark:text-stone-100 sm:text-base">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                        isOpen
                          ? "rotate-180 border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                          : "border-stone-200 bg-stone-50 text-stone-600 group-hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300",
                      ].join(" ")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <div
                    className={[
                      "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pr-16 text-sm leading-6 text-stone-600 dark:text-stone-300 sm:px-6 sm:pb-6 sm:pr-20 sm:text-[15px]">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-stone-500 dark:text-stone-400">
            Need something else? Search the tool directory or open the relevant tool page for its processing details and supported formats.
          </p>
        </Container>
      </Section>
    </>
  );
}
