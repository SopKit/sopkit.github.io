"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "E-commerce", "Education", "Real Estate", "SaaS", "Legal"];

export default function DataRetentionPolicyGenerator() {
  const [industry, setIndustry] = useState("Technology");
  const [company, setCompany] = useState("Your Company");
  const [code, setCode] = useState("");

  const generate = () => {
    setCode(`# Data Retention Policy
## ${company}

**Effective Date:** ${new Date().toISOString().split("T")[0]}
**Industry:** ${industry}

### 1. Purpose
This Data Retention Policy outlines the procedures and schedules for retaining and disposing of data collected, processed, and stored by ${company} in accordance with applicable laws and regulations (GDPR, CCPA, etc.).

### 2. Scope
This policy applies to all data, records, and information created, received, or maintained by ${company} in the course of business operations.

### 3. Retention Schedule

| Data Category | Retention Period | Rationale |
|---------------|-----------------|-----------|
| Customer Account Data | Duration of account + 2 years | Legal obligation & service continuity |
| Transaction Records | 7 years | Tax and audit requirements |
| Communications (Email/Support) | 3 years | Service improvement & dispute resolution |
| ${industry === "Healthcare" ? "Health Records" : "Marketing Data"} | ${industry === "Healthcare" ? "10 years" : "2 years"} | ${industry === "Healthcare" ? "Regulatory compliance (HIPAA)" : "Business purposes"} |
| Website Analytics | 26 months | Industry standard (GDPR guidance) |
| Employee Records | 6 years post-employment | Legal requirements |
| Financial Records | 7 years | Tax and audit obligations |
| Security Logs | 1 year | Security monitoring purposes |

### 4. Data Disposal Methods
- **Digital data:** Secure deletion using approved file-shredding software
- **Paper records:** Cross-cut shredding and confidential waste disposal
- **Backup data:** Secure overwrite and destruction of backup media

### 5. Review Cycle
This policy will be reviewed annually by the Data Protection Officer.

### 6. Compliance
Records of data disposal will be maintained for a minimum of 3 years.

---

*This policy was generated using SopKit's Data Retention Policy Generator. It is a template and should be reviewed by legal counsel before implementation.*`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Retention Policy Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Company Name</label>
          <input className="w-full border rounded px-2 py-1 text-sm" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your Company" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Industry</label>
          <div className="flex gap-2 flex-wrap">
            {INDUSTRIES.map(ind => <button key={ind} onClick={() => setIndustry(ind)} className={`px-3 py-1 text-xs rounded-full border ${industry === ind ? "bg-primary text-primary-foreground" : ""}`}>{ind}</button>)}
          </div>
        </div>
        <Button onClick={generate}>Generate Policy</Button>
        {code && (
          <div className="space-y-2">
            <div className="p-3 border rounded bg-muted/50 text-xs font-mono whitespace-pre-wrap max-h-80 overflow-auto">{code}</div>
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(code)}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
