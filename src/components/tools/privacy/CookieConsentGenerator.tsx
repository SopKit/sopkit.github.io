"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STYLES = ["dark", "light", "colorful"];
const POSITIONS = ["bottom", "top", "bottom-left", "bottom-right", "top-left", "top-right"];

export default function CookieConsentGenerator() {
  const [style, setStyle] = useState("dark");
  const [position, setPosition] = useState("bottom");
  const [code, setCode] = useState("");

  const generate = () => {
    setCode(`<!-- Cookie Consent Banner by SopKit -->
<style>
  .sopkit-cookie-banner {
    position: fixed;
    ${position.includes("top") ? "top: 0;" : "bottom: 0;"}
    ${position.includes("left") ? "left: 0;" : position.includes("right") ? "right: 0;" : "left: 0; right: 0;"}
    ${position === "bottom" || position === "top" ? "left: 0; right: 0;" : ""}
    ${style === "dark" ? "background: #1a1a2e; color: #fff;" : style === "light" ? "background: #fff; color: #333; border-top: 1px solid #ddd;" : "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;"}
    padding: 16px 24px;
    z-index: 9999;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  }
  .sopkit-cookie-banner p { margin: 0; flex: 1; min-width: 200px; }
  .sopkit-cookie-banner a { color: ${style === "dark" ? "#90caf9" : "#667eea"}; }
  .sopkit-cookie-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    ${style === "dark" ? "background: #0f3460; color: #fff;" : style === "light" ? "background: #1a1a2e; color: #fff;" : "background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4);"}
  }
  .sopkit-cookie-btn:hover { opacity: 0.9; }
  .sopkit-cookie-btn-accept { ${style === "colorful" ? "background: #fff; color: #667eea;" : "background: #4caf50; color: #fff;"} }
</style>
<div class="sopkit-cookie-banner" id="sopkit-cookie-banner">
  <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/privacy-policy">Learn more</a></p>
  <div style="display: flex; gap: 8px;">
    <button class="sopkit-cookie-btn sopkit-cookie-btn-accept" onclick="document.getElementById('sopkit-cookie-banner').style.display='none'; localStorage.setItem('cookies-accepted','true');">Accept</button>
    <button class="sopkit-cookie-btn" onclick="document.getElementById('sopkit-cookie-banner').style.display='none';">Decline</button>
  </div>
</div>
<script>
  if (localStorage.getItem('cookies-accepted') !== 'true') {
    document.getElementById('sopkit-cookie-banner').style.display = 'flex';
  }
</script>`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cookie Consent Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Style</label>
            <div className="flex gap-2">
              {STYLES.map(s => <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1 text-xs rounded-full border ${style === s ? "bg-primary text-primary-foreground" : ""}`}>{s}</button>)}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Position</label>
            <div className="flex gap-2 flex-wrap">
              {POSITIONS.map(p => <button key={p} onClick={() => setPosition(p)} className={`px-3 py-1 text-xs rounded-full border ${position === p ? "bg-primary text-primary-foreground" : ""}`}>{p}</button>)}
            </div>
          </div>
        </div>
        <Button onClick={generate}>Generate Code</Button>
        {code && (
          <div className="space-y-2">
            <div className="p-3 border rounded bg-muted/50 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-auto">{code}</div>
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(code)}>Copy Code</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
