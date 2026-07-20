"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const COMMON = ["password", "123456", "qwerty", "admin", "letmein", "welcome", "monkey", "dragon", "master", "abc123", "passwrd", "iloveyou", "trustno1", "sunshine", "princess"];

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const analyze = () => {
    const result: { score: number; label: string; color: string; tips: string[] } = { score: 0, label: "", color: "bg-gray-300", tips: [] };
    const tips: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 20; else tips.push("Use at least 8 characters");
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) { score += 15; } else tips.push("Add uppercase letters");
    if (/\d/.test(password)) { score += 15; } else tips.push("Add numbers");
    if (/[^a-zA-Z0-9]/.test(password)) { score += 20; } else tips.push("Add special characters");
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 10;

    const lower = password.toLowerCase();
    const common = COMMON.find(c => lower.includes(c));
    if (common) { score -= 30; tips.push(`Avoid common patterns like "${common}"`); }
    if (/(.)\1{2,}/.test(password)) { score -= 10; tips.push("Avoid repeated characters"); }
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password) && password.length >= 8) tips.push("Good variety of character types");

    if (score >= 80) { result.label = "Very Strong"; result.color = "bg-green-500"; }
    else if (score >= 60) { result.label = "Strong"; result.color = "bg-green-400"; }
    else if (score >= 40) { result.label = "Moderate"; result.color = "bg-yellow-500"; }
    else if (score >= 20) { result.label = "Weak"; result.color = "bg-orange-500"; }
    else { result.label = "Very Weak"; result.color = "bg-red-500"; }

    result.score = Math.max(0, Math.min(100, score));
    result.tips = tips;
    return result;
  };

  const result = password ? analyze() : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Password Strength Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="password" placeholder="Enter a password..." value={password} onChange={e => setPassword(e.target.value)} />
        {result && (
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${result.color}`} style={{ width: `${result.score}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.label}</span>
              <span className="text-xs text-muted-foreground">{result.score}/100</span>
            </div>
            {result.tips.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5">
                {result.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
