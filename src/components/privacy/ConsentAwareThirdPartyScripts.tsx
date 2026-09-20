"use client";

import { useEffect } from "react";

export default function ConsentAwareThirdPartyScripts({ enableAds = false }: { enableAds?: boolean }) {
  useEffect(() => {
    const loadScript = (id: string, src: string, attrs: Record<string, string> = {}) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
      document.head.appendChild(script);
    };

    const load = () => {
      const analytics = localStorage.getItem("sopkit_consent_analytics") === "granted";
      const ads = localStorage.getItem("sopkit_consent_ads") === "granted";

      if (analytics) {
        loadScript("sopkit-clarity", "https://www.clarity.ms/tag/uh6y61lx9p?ref=bwt");
        loadScript("sopkit-onedollarstats", "https://assets.onedollarstats.com/stonks.js");
      }

      if (enableAds && ads) {
        loadScript("sopkit-adsense", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549", {
          crossorigin: "anonymous",
        });
      }
    };

    load();
    window.addEventListener("sopkit-consent-updated", load);
    return () => window.removeEventListener("sopkit-consent-updated", load);
  }, [enableAds]);

  return null;
}
