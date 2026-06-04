"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function PropertyRoiCalculatorTool() {
  const [price, setPrice] = useState("250000");
  const [rent, setRent] = useState("1800");
  const [expenses, setExpenses] = useState("3600");

  const results = useMemo(() => {
    try {
      
      const p = Number(price);
      const r = Number(rent) * 12;
      const e = Number(expenses);
      if (!p) return { yield: "0.00%", netRoi: "0.00%" };
      return {
        yield: ((r / p) * 100).toFixed(2) + "%",
        netRoi: (((r - e) / p) * 100).toFixed(2) + "%"
      };
    
    } catch {
      return { yield: "", netRoi: "" };
    }
  }, [price, rent, expenses]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Property ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="price">Property Purchase Price ($)</Label>
          <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rent">Monthly Rental Income ($)</Label>
          <Input id="rent" type="number" value={rent} onChange={e => setRent(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expenses">Annual Expenses (Taxes, HOA, Ins.) ($)</Label>
          <Input id="expenses" type="number" value={expenses} onChange={e => setExpenses(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Gross Rental Yield</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.yield} />
        </div>
        <div className="space-y-1">
          <Label>Net Annual ROI (excluding appreciation)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.netRoi} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
