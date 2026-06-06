"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface RentAffordabilityResult {
  conservative: string;
  moderate: string;
  aggressive: string;
}

export default function RentAffordabilityCalculatorTool() {
  const [income, setIncome] = useState("5000");
  const [debts, setDebts] = useState("500");

  const results = useMemo<RentAffordabilityResult>(() => {
    try {
      
      const inc = Number(income);
      const d = Number(debts);
      if (!inc) return { conservative: "$0.00", moderate: "$0.00", aggressive: "$0.00" };
      return {
        conservative: "$" + (inc * 0.25).toFixed(2) + " / mo (25% rule)",
        moderate: "$" + Math.max(0, inc * 0.30 - d).toFixed(2) + " / mo (30% rule - debts)",
        aggressive: "$" + (inc * 0.40).toFixed(2) + " / mo (40% rule)"
      };
    
    } catch {
      return { conservative: "", moderate: "", aggressive: "" };
    }
  }, [income, debts]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Rent Affordability Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="income">Monthly Gross Income ($)</Label>
          <Input id="income" type="number" value={income} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncome(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="debts">Monthly Debt Payments (Loans, Cards) ($)</Label>
          <Input id="debts" type="number" value={debts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDebts(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Conservative Budget</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.conservative} />
        </div>
        <div className="space-y-1">
          <Label>Recommended Moderate Budget</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.moderate} />
        </div>
        <div className="space-y-1">
          <Label>Aggressive Maximum Budget</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.aggressive} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
