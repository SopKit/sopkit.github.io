"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface CalorieDeficitResult {
  bmr: string;
  tdee: string;
  deficit: string;
}

export default function CalorieDeficitCalculatorTool() {
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("178");
  const [age, setAge] = useState("28");

  const results = useMemo<CalorieDeficitResult>(() => {
    try {
      
      const w = Number(weight);
      const h = Number(height);
      const a = Number(age);
      if (!w || !h || !a) return { bmr: "0 kcal", tdee: "0 kcal", deficit: "0 kcal" };
      // BMR using Mifflin-St Jeor (Male default)
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      const tdee = Math.round(bmr * 1.375); // Light active multiplier
      return {
        bmr: bmr.toFixed(0) + " kcal",
        tdee: tdee + " kcal",
        deficit: Math.max(1200, tdee - 500) + " kcal / day (Safe deficit)"
      };
    
    } catch {
      return { bmr: "", tdee: "", deficit: "" };
    }
  }, [weight, height, age]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Calorie Deficit Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="weight">Current Weight (kg)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" value={height} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="age">Age (years)</Label>
          <Input id="age" type="number" value={age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Basal Metabolic Rate (BMR)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.bmr} />
        </div>
        <div className="space-y-1">
          <Label>Total Daily Energy Expenditure (TDEE)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.tdee} />
        </div>
        <div className="space-y-1">
          <Label>Target Calories for Safe Weight Loss</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.deficit} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
