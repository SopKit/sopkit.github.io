"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function FreelanceRateCalculatorTool() {
  const [goal, setGoal] = useState("60000");
  const [expenses, setExpenses] = useState("15000");
  const [vacation, setVacation] = useState("4");
  const [billable, setBillable] = useState("25");

  const results = useMemo(() => {
    try {
      
      const g = Number(goal);
      const e = Number(expenses);
      const v = Number(vacation);
      const b = Number(billable);
      if (!g || !b || v >= 52) return { hourly: "$0.00", daily: "$0.00" };
      const weeks = 52 - v;
      const target = g + e;
      const hours = weeks * b;
      const hourly = target / hours;
      return {
        hourly: "$" + hourly.toFixed(2) + " / hr",
        daily: "$" + (hourly * 8).toFixed(2) + " / day (8h)"
      };
    
    } catch {
      return { hourly: "", daily: "" };
    }
  }, [goal, expenses, vacation, billable]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Freelance Rate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="goal">Desired Annual Net Income ($)</Label>
          <Input id="goal" type="number" value={goal} onChange={e => setGoal(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expenses">Annual Business Expenses & Taxes ($)</Label>
          <Input id="expenses" type="number" value={expenses} onChange={e => setExpenses(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vacation">Vacation Weeks Per Year</Label>
          <Input id="vacation" type="number" value={vacation} onChange={e => setVacation(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="billable">Billable Hours Per Week</Label>
          <Input id="billable" type="number" value={billable} onChange={e => setBillable(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Required Hourly Rate</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.hourly} />
        </div>
        <div className="space-y-1">
          <Label>Equivalent Daily Rate</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.daily} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
