"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailValidator() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ valid: boolean; details: string[] } | null>(null);

  const validate = async () => {
    const details: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setResult({ valid: false, details: ["Invalid email format"] });
      return;
    }
    details.push("Format: Valid");

    const disposableDomains = ["mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email", "10minutemail.com", "trashmail.com"];
    const domain = email.split("@")[1];
    if (disposableDomains.includes(domain)) details.push("Warning: Disposable email domain detected");
    else details.push("Domain: Not identified as disposable");

    const domainParts = domain.split(".");
    if (domainParts.length >= 2) details.push(`TLD: .${domainParts[domainParts.length - 1]}`);

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
      const data = await resp.json();
      const hasMx = data.Answer && data.Answer.length > 0;
      details.push(hasMx ? "MX records: Found (domain accepts email)" : "MX records: Not found");
    } catch {
      details.push("MX check: Could not verify");
    }

    setResult({ valid: true, details });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Validator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={validate} disabled={!email}>Validate</Button>
        {result && (
          <div className="space-y-2">
            <p className={result.valid ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {result.valid ? "Valid email" : "Invalid email"}
            </p>
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
              {result.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
