"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface HomeLoanResults {
  loan: string;
  emi: string;
}

export default function HomeLoanEligibilityCalculatorTool() {
  const [salary, setSalary] = useState("6000");
  const [rate, setRate] = useState("7.5");
  const [tenure, setTenure] = useState("20");
  const [debts, setDebts] = useState("500");

  const results = useMemo<HomeLoanResults>(() => {
    try {
      
      const s = Number(salary);
      const r = Number(rate) / 100 / 12;
      const n = Number(tenure) * 12;
      const d = Number(debts);
      if (!s || !r || !n) return { loan: "$0.00", emi: "$0.00" };
      const maxEmi = Math.max(0, s * 0.5 - d);
      const power = Math.pow(1 + r, n);
      const loan = (maxEmi * (power - 1)) / (r * power);
      return {
        loan: "$" + Math.round(loan).toLocaleString(),
        emi: "$" + maxEmi.toFixed(2) + " / mo"
      };
    
    } catch {
      return { loan: "", emi: "" };
    }
  }, [salary, rate, tenure, debts]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Home Loan Eligibility Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="salary">Net Monthly Salary ($)</Label>
          <Input id="salary" type="number" value={salary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalary(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate">Interest Rate (% Per Annum)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tenure">Tenure (Years)</Label>
          <Input id="tenure" type="number" value={tenure} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenure(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="debts">Existing Monthly EMIs ($)</Label>
          <Input id="debts" type="number" value={debts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDebts(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Estimated Eligible Loan Amount</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.loan} />
        </div>
        <div className="space-y-1">
          <Label>Maximum Monthly EMI Allowed</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.emi} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
