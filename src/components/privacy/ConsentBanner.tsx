"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateConsentPreferences } from "@/features/analytics/consent";

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const configured = localStorage.getItem("sopkit_consent") === "configured";
        setOpen(!configured);
        setAnalytics(localStorage.getItem("sopkit_consent_analytics") === "granted");
        setAds(localStorage.getItem("sopkit_consent_ads") === "granted");
      } catch {
        setOpen(true);
      }
    };

    const reopen = () => {
      read();
      setSettings(true);
      setOpen(true);
    };

    read();
    window.addEventListener("sopkit-open-consent", reopen);
    return () => window.removeEventListener("sopkit-open-consent", reopen);
  }, []);

  const save = (nextAnalytics: boolean, nextAds: boolean) => {
    updateConsentPreferences({ analytics: nextAnalytics, ads: nextAds });
    setAnalytics(nextAnalytics);
    setAds(nextAds);
    setSettings(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Privacy choices</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close privacy choices"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              SopKit keeps optional analytics and advertising disabled until you choose. Core tools remain available.
              See the <a href="/privacy" className="font-medium text-primary underline underline-offset-2">Privacy Policy</a> for details.
            </p>

            {settings && (
              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                <label className="flex items-center justify-between gap-3 text-xs">
                  <span>
                    <span className="block font-semibold text-foreground">Analytics</span>
                    <span className="block text-muted-foreground">Helps us understand usage and improve the site.</span>
                  </span>
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between gap-3 text-xs">
                  <span>
                    <span className="block font-semibold text-foreground">Advertising</span>
                    <span className="block text-muted-foreground">Allows advertising services to load when enabled.</span>
                  </span>
                  <input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {settings ? (
                <>
                  <Button size="sm" onClick={() => save(analytics, ads)}>Save choices</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSettings(false)}>Back</Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => save(true, true)}>Accept all</Button>
                  <Button size="sm" variant="outline" onClick={() => save(false, false)}>Reject optional</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSettings(true)} className="gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Customize
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
