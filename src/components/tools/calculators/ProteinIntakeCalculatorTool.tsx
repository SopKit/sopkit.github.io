"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface ProteinResults {
  active: string;
  athlete: string;
}

export default function ProteinIntakeCalculatorTool() {
  const [weight, setWeight] = useState("70");

  const results = useMemo<ProteinResults>(() => {
    try {
      
      const w = Number(weight);
      if (!w) return { active: "0g", athlete: "0g" };
      return {
        active: Math.round(w * 1.2) + "g - " + Math.round(w * 1.6) + "g / day (Active lifestyle)",
        athlete: Math.round(w * 1.8) + "g - " + Math.round(w * 2.2) + "g / day (Muscle building)"
      };
    
    } catch {
      return { active: "", athlete: "" };
    }
  }, [weight]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Protein Intake Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="weight">Current Weight (kg)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} />
        </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
        <div className="space-y-1">
          <Label>Target Protein (General Fitness)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.active} />
        </div>
        <div className="space-y-1">
          <Label>Target Protein (Athletes/Hypertrophy)</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.athlete} />
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
