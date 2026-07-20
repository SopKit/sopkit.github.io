"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CHECKS = [
  { id: "clear-language", label: "Uses clear, plain language", category: "Readability" },
  { id: "data-collection", label: "Explains what data is collected", category: "Data" },
  { id: "purpose", label: "States purpose of data collection", category: "Data" },
  { id: "legal-basis", label: "Identifies legal basis (GDPR Art. 6)", category: "Legal" },
  { id: "retention", label: "Specifies data retention periods", category: "Data" },
  { id: "sharing", label: "Discloses third-party sharing", category: "Data" },
  { id: "cookies", label: "Explains cookie usage", category: "Cookies" },
  { id: "rights", label: "Lists user rights (access, erasure, portability)", category: "Rights" },
  { id: "contact", label: "Provides contact information", category: "Transparency" },
  { id: "updates", label: "Mentions policy update process", category: "Transparency" },
  { id: "children", label: "Addresses children's data (if applicable)", category: "Legal" },
  { id: "security", label: "Describes security measures", category: "Security" },
];

export default function PrivacyPolicyAuditor() {
  const [policy, setPolicy] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number | null>(null);

  const autoDetect = () => {
    const lower = policy.toLowerCase();
    const auto: Record<string, boolean> = {};
    if (lower.includes("collect") || lower.includes("gather") || lower.includes("process")) auto["data-collection"] = true;
    if (lower.includes("purpose") || lower.includes("why we") || lower.includes("use your data")) auto["purpose"] = true;
    if (lower.includes("retention") || lower.includes("keep your") || lower.includes("store")) auto["retention"] = true;
    if (lower.includes("share") || lower.includes("third party") || lower.includes("disclose")) auto["sharing"] = true;
    if (lower.includes("cookie") || lower.includes("tracking")) auto["cookies"] = true;
    if (lower.includes("right") || lower.includes("access") || lower.includes("delete")) auto["rights"] = true;
    if (lower.includes("contact") || lower.includes("email us") || lower.includes("reach us")) auto["contact"] = true;
    if (lower.includes("update") || lower.includes("change") || lower.includes("revise")) auto["updates"] = true;
    if (lower.includes("children") || lower.includes("minor") || lower.includes("under 13")) auto["children"] = true;
    if (lower.includes("security") || lower.includes("encrypt") || lower.includes("protect")) auto["security"] = true;
    if (lower.includes("legal basis") || lower.includes("legitimate interest") || lower.includes("consent")) auto["legal-basis"] = true;
    if (lower.match(/^[\s\S]*?(?=We|This|Our)/m)) auto["clear-language"] = true;
    setChecks(auto);
  };

  const calculate = () => {
    const completed = Object.values(checks).filter(Boolean).length;
    setScore(Math.round((completed / CHECKS.length) * 100));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Privacy Policy Auditor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste your privacy policy text to auto-detect compliance items..." value={policy} onChange={e => setPolicy(e.target.value)} rows={5} />
        {policy && <Button variant="outline" size="sm" onClick={autoDetect}>Auto-Detect from Text</Button>}
        <div className="space-y-1.5">
          {CHECKS.map(item => (
            <label key={item.id} className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!checks[item.id]} onChange={() => setChecks(prev => ({ ...prev, [item.id]: !prev[item.id] }))} className="mt-0.5" />
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
              <span className={`text-xl font-bold ${score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{score}%</span>
              <span className="text-sm">{score >= 80 ? "Comprehensive" : score >= 50 ? "Needs improvement" : "Incomplete"}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
