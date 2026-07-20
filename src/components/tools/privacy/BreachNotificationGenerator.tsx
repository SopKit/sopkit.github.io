"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BreachNotificationGenerator() {
  const [company, setCompany] = useState("Your Company");
  const [breachType, setBreachType] = useState("Data Breach");
  const [people, setPeople] = useState("affected individuals");
  const [dataTypes, setDataTypes] = useState("email addresses, passwords, and personal information");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [audience, setAudience] = useState("customers");
  const [code, setCode] = useState("");

  const generate = () => {
    setCode(audience === "regulators"
      ? `# Data Breach Notification — Regulatory Authority
**Date:** ${date}
**Organization:** ${company}

## Summary
${company} experienced a ${breachType} incident on ${date}. This notification is submitted in accordance with applicable data protection regulations.

## Incident Details
- **Type of Incident:** ${breachType}
- **Date of Discovery:** ${date}
- **Data Types Involved:** ${dataTypes}
- **Number of Affected Individuals:** ${people}
- **Nature of Breach:** Unauthorized access to ${company}'s systems resulting in exposure of ${dataTypes}.

## Action Taken
1. Immediate containment and securing of systems
2. Engagement of external cybersecurity experts
3. Notification of affected individuals
4. Implementation of enhanced security measures
5. Cooperation with relevant authorities

## Contact
For further information, please contact the Data Protection Officer at ${company}.

---

*This notification was generated using SopKit's Breach Notification Generator. Please review with legal counsel before submission.*`
      : `# Data Breach Notification — ${audience === "customers" ? "For Customers" : "Internal Staff"}
**Date:** ${date}
**From:** ${company}

## Important Notice Regarding Your Data

Dear ${audience === "customers" ? "Valued Customer" : "Team Member"},

We are writing to inform you of a security incident that may involve your personal information.

## What Happened
${company} recently discovered a ${breachType} that may have resulted in unauthorized access to ${dataTypes}.

## What We Are Doing
- We have secured our systems and launched a full investigation
- We have engaged leading cybersecurity experts
- We are implementing enhanced security protocols
- We are cooperating with law enforcement and regulatory authorities

## What You Should Do
1. Change your password immediately
2. Enable two-factor authentication
3. Monitor your accounts for suspicious activity
4. Be alert for phishing attempts

## Need Help?
Contact our support team for assistance.

---

*This notification was generated using SopKit's Breach Notification Generator. Please review with legal counsel before sending.*`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Breach Notification Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Company</label>
            <input className="w-full border rounded px-2 py-1 text-sm" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Breach Type</label>
            <input className="w-full border rounded px-2 py-1 text-sm" value={breachType} onChange={e => setBreachType(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Data Types</label>
            <input className="w-full border rounded px-2 py-1 text-sm" value={dataTypes} onChange={e => setDataTypes(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Date</label>
            <input className="w-full border rounded px-2 py-1 text-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Audience</label>
          <div className="flex gap-2">
            {["customers", "regulators", "internal"].map(a => <button key={a} onClick={() => setAudience(a)} className={`px-3 py-1 text-xs rounded-full border ${audience === a ? "bg-primary text-primary-foreground" : ""}`}>{a}</button>)}
          </div>
        </div>
        <Button onClick={generate}>Generate Notification</Button>
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
