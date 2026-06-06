"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function BmiIdealWeightCalculatorTool() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");

  interface BmiResult {
    bmi: string;
    cat: string;
    ideal: string;
  }

  const results = useMemo<BmiResult>(() => {
    try {
      
      const w = Number(weight);
      const h = Number(height);
      if (!w || !h) return { bmi: "0.0", cat: "N/A", ideal: "0.0 kg" };
      const bmiVal = w / Math.pow(h / 100, 2);
      let cat = "Normal";
      if (bmiVal < 18.5) cat = "Underweight";
      else if (bmiVal >= 25 && bmiVal < 30) cat = "Overweight";
      else if (bmiVal >= 30) cat = "Obese";

      // Devine ideal weight formula
      const htIn = h / 2.54;
      const over5Ft = Math.max(0, htIn - 60);
      const ideal = 50 + over5Ft * 2.3;
      return {
        bmi: bmiVal.toFixed(1),
        cat,
        ideal: ideal.toFixed(1) + " kg"
      };
    
    } catch {
      return { bmi: "", cat: "", ideal: "" };
    }
  }, [weight, height]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          BMI + Ideal Weight Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" value={height} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Body Mass Index (BMI)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.bmi} />
        </div>
        <div className="space-y-1">
          <Label>Weight Category</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.cat} />
        </div>
        <div className="space-y-1">
          <Label>Estimated Ideal Body Weight</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.ideal} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
