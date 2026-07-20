"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DataAnonymizationReportGenerator() {
  const [company, setCompany] = useState("Your Company");
  const [industry, setIndustry] = useState("Technology");
  const [techniques, setTechniques] = useState<string[]>(["pseudonymization", "aggregation"]);
  const [code, setCode] = useState("");

  const toggleTechnique = (t: string) => {
    setTechniques(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const generate = () => {
    setCode(`# Data Anonymization Report
## ${company}
**Industry:** ${industry}
**Date:** ${new Date().toISOString().split("T")[0]}
**GDPR Article 25 Compliance — Data Protection by Design**

---

### 1. Scope
This report documents the anonymization techniques applied to personal data processed by ${company}, demonstrating compliance with GDPR Article 25 (Data Protection by Design and Default).

### 2. Data Inventory
| Data Category | Personal Identifiers | Anonymization Applied |
|---------------|-------------------|---------------------|
| Customer Records | Name, Email, Phone | ${techniques.includes("pseudonymization") ? "Pseudonymized ✓" : "Under review"} |
| Usage Analytics | IP, User Agent | ${techniques.includes("aggregation") ? "Aggregated ✓" : "Under review"} |
| Transaction Data | Payment Info, Address | ${techniques.includes("encryption") ? "Encrypted ✓" : "Under review"} |

### 3. Anonymization Techniques Applied
${techniques.map(t => `- **${t.charAt(0).toUpperCase() + t.slice(1)}**: Applied to relevant datasets`).join("\n")}

### 4. Re-identification Risk Assessment
**Overall Risk Level:** Low
- Data is sufficiently anonymized for the intended processing purposes
- No reasonable means of re-identification present
- Technical and organizational measures in place

### 5. Compliance Checklist
- [x] Data minimization principles applied
- [x] Purpose limitation documented
- [x] Storage limitation enforced
- [x] Integrity and confidentiality ensured
- [x] Anonymization methodology reviewed

### 6. Review Schedule
This report will be reviewed and updated: Annually or upon significant processing changes.

---

*This report was generated using SopKit's Data Anonymization Report Generator. It is a template and should be reviewed by legal counsel.*`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Anonymization Report Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Company</label>
            <input className="w-full border rounded px-2 py-1 text-sm" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Industry</label>
            <input className="w-full border rounded px-2 py-1 text-sm" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Anonymization Techniques</label>
          <div className="flex gap-2 flex-wrap">
            {["pseudonymization", "aggregation", "encryption", "generalization", "masking", "noise-addition"].map(t => (
              <button key={t} onClick={() => toggleTechnique(t)} className={`px-3 py-1 text-xs rounded-full border ${techniques.includes(t) ? "bg-primary text-primary-foreground" : ""}`}>{t.replace(/-/g, " ")}</button>
            ))}
          </div>
        </div>
        <Button onClick={generate}>Generate Report</Button>
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
