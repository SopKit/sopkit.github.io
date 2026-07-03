"use client";

import { useState, useEffect } from "react";
import AdSlot from "./AdSlot";
import { getMonetizationDecision } from "@/data/monetization";
import { ArrowRight, Sparkles } from "lucide-react";

interface AdPlacementProps {
  placement: "after-hero" | "before-tool" | "after-tool" | "in-content" | "sidebar" | "footer";
  pageType?: "tool" | "blog" | "category" | "home";
  slug?: string;
  category?: string;
}

const SCRIPTLY_PRODUCTS = [
  {
    title: "AURA | Premium Editorial Portfolio Theme",
    tagline: "Close $10k+ client contracts with a cinematic portfolio.",
    copy: "Ditch the rigid, boring template. Aura features hypnotic GSAP infinite scrolling, buttery parallax depth, and ultra-sleek dark mode. Built for elite creative photographers and designers who want to command premium rates.",
    imageUrl: "https://github.com/30tools/scriptly-assets/releases/download/dwq/Screen.Recording.2026-06-22.at.11.26.34.AM.gif",
    link: "https://scriptly.store/products/aura-premium-editorial-fashion-portfolio-html-theme",
    cta: "Download Aura & Launch in 5 Mins",
    badge: "Cinema GSAP",
    price: "$26.10"
  },
  {
    title: "LUMIÈRE | Elite Digital Agency HTML Theme",
    tagline: "Get the visual prestige of a world-class digital agency.",
    copy: "Perception is everything. If your site looks cheap, you get paid cheap. Lumière delivers Awwwards-winning text reveals, immersive GSAP animations, and zero-bloat code. Start closing high-ticket agency contracts today.",
    imageUrl: "https://github.com/30tools/scriptly-assets/releases/download/dwq/lumiere-theme-scriptly.surge.sh.gif",
    link: "https://scriptly.store/products/lumiere-elite-digital-agency-html-theme",
    cta: "Elevate Your Agency Website Now",
    badge: "Awwwards Style",
    price: "$39.00"
  },
  {
    title: "KRAFT | Immersive 3D Paper Portfolio Theme",
    tagline: "Interactive 3D sketch paper corridor portfolio.",
    copy: "Stop sending flat PDFs. Kraft is a premium, game-like 3D portfolio corridor built with React Three Fiber. Users walk through paper sketch rooms showcasing your projects, CRT monitor displays, and message-in-a-bottle contact form.",
    imageUrl: "https://github.com/30tools/scriptly-assets/releases/download/dwq/portfolio.gif",
    link: "https://scriptly.store/products/kraft-premium-3d-hand-drawn-portfolio-theme",
    cta: "Get the 3D Sketch Portfolio Template",
    badge: "R3F + WebGL",
    price: "$29.00"
  },
  {
    title: "SmileFlow | Premium Next.js 16 Dental Practice Theme",
    tagline: "The ultimate dental clinic growth template.",
    copy: "Fully custom built for high-end clinics. Includes an interactive smile cost calculator, before-after slider comparisons, beautiful clinical bento service grid, and automated Dentist schema markup for Local SEO.",
    imageUrl: "https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/mg9cudxnyl4k7b67o5a3.gif",
    link: "https://scriptly.store/products/smileflow-premium-next-js-16-dental-practice-template",
    cta: "Launch SmileFlow Practice Site",
    badge: "Next.js 16 + Tailwind v4",
    price: "$50.40"
  },
  {
    title: "Aero UI | Next.js 15 & Tailwind v4 Boilerplate",
    tagline: "Stunning modern glassmorphism UI template.",
    copy: "A state-of-the-art landing page utilizing Tailwind CSS v4's lightning-fast native compilation. Loaded with premium typography, pre-built pricing tiers, user-proof widgets, and dark mode compatibility.",
    imageUrl: "https://cdn.jsdelivr.net/gh/30tools/scriptly-assets@main/ezgif-8ffc075a5e9e8ef3.gif",
    link: "https://scriptly.store/products/aero-ui-premium-next-js-15-tailwind-v4-landing-page-template",
    cta: "Boost Your SaaS Landing Page",
    badge: "Tailwind v4 Boiler",
    price: "$23.75"
  },
  {
    title: "Panda Scroll Travel Animation Portfolio",
    tagline: "Turn portfolio scrolling into a cinematic journey.",
    copy: "Storytelling travel portfolio template that pulls visitors into your work. Custom scroll-driven layout, micro-interactions, and fully responsive screen handling that makes recruiters hire you instantly.",
    imageUrl: "https://github.com/30tools/coders/releases/download/few/ezgif-2ee9d1440f71911b.gif",
    link: "https://scriptly.store/products/panda-scroll-travel-animation-portfolio",
    cta: "Get the Travel Portfolio Now",
    badge: "Animation Heavy",
    price: "$40.00"
  }
];

export default function AdPlacement({
  placement,
  pageType = "tool",
  slug = "",
  category = "",
}: AdPlacementProps) {
  const monetization = getMonetizationDecision({ slug, category });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adDecision, setAdDecision] = useState<"ad" | "empty" | "adsense">("ad");

  useEffect(() => {
    // 70% chance to show a high-converting Scriptly Store ad
    // 15% chance to hide the ad slot completely (remove slot)
    // 15% chance to show standard Google Adsense
    const rand = Math.random();
    if (rand < 0.70) {
      setAdDecision("ad");
      const productIndex = Math.floor(Math.random() * SCRIPTLY_PRODUCTS.length);
      setSelectedProduct(SCRIPTLY_PRODUCTS[productIndex]);
    } else if (rand < 0.85) {
      setAdDecision("empty");
    } else {
      setAdDecision("adsense");
    }
  }, []);

  if (!monetization.adsAllowed || adDecision === "empty") {
    return null;
  }

  if (adDecision === "adsense") {
    const DISPLAY = { slot: "6845038159", format: "auto" as const };
    const MULTIPLEX = {
      home: { slot: "4669751596", format: "autorelaxed" as const },
      blog: { slot: "9420953810", format: "autorelaxed" as const },
      tool: { slot: "8187863815", format: "autorelaxed" as const },
    };

    if (placement === "sidebar" || placement === "footer") {
      const unit =
        pageType === "home" ? MULTIPLEX.home :
        pageType === "blog" ? MULTIPLEX.blog :
        MULTIPLEX.tool;
      return <AdSlot slot={unit.slot} format={unit.format} label={true} />;
    }

    return <AdSlot slot={DISPLAY.slot} format={DISPLAY.format} label={true} />;
  }

  // Render a gorgeous high-converting Scriptly Store ad
  if (!selectedProduct) return null;

  return (
    <div className="relative w-full my-8 p-5 sm:p-6 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col md:flex-row gap-6 items-center">
      <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-primary/20 flex items-center gap-1">
        <Sparkles className="h-3 w-3" /> Sponsor
      </div>

      {/* Asset Preview */}
      <div className="w-full md:w-2/5 aspect-[16/10] rounded-xl overflow-hidden border border-border/40 relative shadow-sm bg-muted/20">
        <img
          src={selectedProduct.imageUrl}
          alt={selectedProduct.title}
          className="object-cover w-full h-full hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Details & Copy */}
      <div className="flex-1 space-y-3 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
            {selectedProduct.badge}
          </span>
          <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
            {selectedProduct.price}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-snug">
          {selectedProduct.title}
        </h4>
        
        <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
          {selectedProduct.tagline}
        </p>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {selectedProduct.copy}
        </p>

        <div className="pt-2">
          <a
            href={selectedProduct.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold hover:opacity-90 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.1)] group"
          >
            <span>{selectedProduct.cta}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
