"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function FoodCostCalculatorTool() {
  const [cost, setCost] = useState("1.50");
  const [price, setPrice] = useState("5.00");

  const results = useMemo(() => {
    try {
      
      const c = Number(cost);
      const p = Number(price);
      if (!c || !p) return { pct: "0.00%", profit: "$0.00", margin: "0.00%" };
      return {
        pct: ((c / p) * 100).toFixed(2) + "%",
        profit: "$" + (p - c).toFixed(2),
        margin: (((p - c) / p) * 100).toFixed(2) + "%"
      };
    
    } catch {
      return { pct: "", profit: "", margin: "" };
    }
  }, [cost, price]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Food Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cost">Raw Ingredient Cost ($)</Label>
          <Input id="cost" type="number" value={cost} onChange={e => setCost(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Menu Selling Price ($)</Label>
          <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Food Cost Percentage</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.pct} />
        </div>
        <div className="space-y-1">
          <Label>Gross Profit per Portion</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.profit} />
        </div>
        <div className="space-y-1">
          <Label>Gross Profit Margin</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.margin} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
