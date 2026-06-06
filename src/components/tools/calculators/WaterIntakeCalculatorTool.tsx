"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface WaterIntakeResult {
  liters: string;
  oz: string;
}

export default function WaterIntakeCalculatorTool() {
  const [weight, setWeight] = useState("70");
  const [exercise, setExercise] = useState("45");

  const results = useMemo<WaterIntakeResult>(() => {
    try {
      
      const w = Number(weight);
      const ex = Number(exercise);
      if (!w) return { liters: "0.00 L", oz: "0 fl oz" };
      const baseline = w * 35; // 35 ml/kg
      const extra = (ex / 30) * 350; // 350 ml per 30 mins
      const totalMl = baseline + extra;
      return {
        liters: (totalMl / 1000).toFixed(2) + " Liters / day",
        oz: Math.round(totalMl * 0.033814) + " fl oz"
      };
    
    } catch {
      return { liters: "", oz: "" };
    }
  }, [weight, exercise]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Daily Water Intake Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="exercise">Daily Exercise (Minutes)</Label>
          <Input id="exercise" type="number" value={exercise} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExercise(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Daily Target Volume (Liters)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.liters} />
        </div>
        <div className="space-y-1">
          <Label>Daily Target Volume (Ounces)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.oz} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
