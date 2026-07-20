"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const checkItems = [
  { id: "privacy-policy", label: "Privacy Policy present and accessible", category: "Legal" },
  { id: "cookie-consent", label: "Cookie consent banner implemented", category: "Cookies" },
  { id: "data-collection", label: "Data collection purposes disclosed", category: "Transparency" },
  { id: "third-party", label: "Third-party data sharing disclosed", category: "Transparency" },
  { id: "data-retention", label: "Data retention policy stated", category: "Rights" },
  { id: "access-right", label: "User data access mechanism available", category: "Rights" },
  { id: "erasure-right", label: "Right to erasure (deletion) mechanism", category: "Rights" },
  { id: "data-portability", label: "Data portability option provided", category: "Rights" },
  { id: "dpa", label: "Data Processing Agreement in place", category: "Legal" },
  { id: "breach-notification", label: "Breach notification procedure documented", category: "Legal" },
  { id: "contact-dpo", label: "DPO contact information published", category: "Transparency" },
  { id: "lawful-basis", label: "Lawful basis for processing documented", category: "Legal" },
];

export default function GdprComplianceChecker() {
  const [url, setUrl] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number | null>(null);

  const toggle = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculate = () => {
    const completed = Object.values(checks).filter(Boolean).length;
    setScore(Math.round((completed / checkItems.length) * 100));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">GDPR Compliance Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Your website URL (optional)" value={url} onChange={e => setUrl(e.target.value)} />
        <div className="space-y-1.5">
          {checkItems.map(item => (
            <label key={item.id} className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!checks[item.id]} onChange={() => toggle(item.id)} className="mt-0.5" />
              <div>
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground ml-2">({item.category})</span>
              </div>
            </label>
          ))}
        </div>
        <Button onClick={calculate}>Calculate Score</Button>
        {score !== null && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className={`text-xl font-bold ${score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                {score}%
              </span>
              <span className="text-sm">{score >= 80 ? "Good compliance" : score >= 50 ? "Needs improvement" : "Non-compliant"}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{checkItems.length - Object.values(checks).filter(Boolean).length} items remaining</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
