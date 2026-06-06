"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface ProfitMarginResults {
  profit: string;
  margin: string;
  markup: string;
}

export default function ProfitMarginCalculatorTool() {
  const [cost, setCost] = useState("40");
  const [sell, setSell] = useState("100");

  const results = useMemo<ProfitMarginResults>(() => {
    try {
      
      const c = Number(cost);
      const s = Number(sell);
      if (!c || !s) return { profit: "$0.00", margin: "0.00%", markup: "0.00%" };
      const profit = s - c;
      return {
        profit: "$" + profit.toFixed(2),
        margin: ((profit / s) * 100).toFixed(2) + "%",
        markup: ((profit / c) * 100).toFixed(2) + "%"
      };
    
    } catch {
      return { profit: "", margin: "", markup: "" };
    }
  }, [cost, sell]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Profit Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cost">Cost Price ($)</Label>
          <Input id="cost" type="number" value={cost} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCost(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sell">Selling Price ($)</Label>
          <Input id="sell" type="number" value={sell} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSell(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Gross Profit</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.profit} />
        </div>
        <div className="space-y-1">
          <Label>Gross Profit Margin %</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.margin} />
        </div>
        <div className="space-y-1">
          <Label>Markup %</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.markup} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
