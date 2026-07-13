"use client";

import React, { useState, useMemo } from "react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function MathDateCalculators({ defaultTab = "date-diff" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // --- Date Difference States ---
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Roman Numerals ---
  const [romanInput, setRomanInput] = useState("");
  const [romanOutput, setRomanOutput] = useState("");

  // --- GPA to 4.0 ---
  const [gpaInput, setGpaInput] = useState("8.5");
  const [gpaType, setGpaType] = useState("10-point"); // or "percentage"

  // --- RD Calculator ---
  const [rdMonthly, setRdMonthly] = useState("5000");
  const [rdRate, setRdRate] = useState("7");
  const [rdMonths, setRdMonths] = useState("12");

  // --- Date Difference Calculation ---
  const dateDiff = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.abs(e - s);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const remDays = days % 365;
    const months = Math.floor(remDays / 30.44);
    const finalDays = Math.floor(remDays % 30.44);
    
    return { years, months, days: finalDays, totalDays: days };
  }, [startDate, endDate]);

  // --- Roman Numerals Conversion ---
  const toRoman = (num) => {
    const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const handleRoman = () => {
    const num = parseInt(romanInput);
    if (!isNaN(num)) {
       setRomanOutput(toRoman(num));
    } else {
       toast.error("Enter a valid number");
    }
  };

  // --- RD Calculation ---
  const rdResult = useMemo(() => {
    const P = parseFloat(rdMonthly) || 0;
    const r = (parseFloat(rdRate) || 0) / 100;
    const n = 4; // Compound quarterly
    const t = (parseFloat(rdMonths) || 0) / 12;
    
    // Formula for RD: M = P * ((1+i)^n - 1) / (1 - (1+i)^(-1/3))
    // Simpler approx: Sum of P * (1 + r/4)^(4 * months_remaining/12)
    let total = 0;
    const mCount = parseInt(rdMonths) || 0;
    for (let i = 1; i <= mCount; i++) {
       total += P * Math.pow(1 + r/n, n * (i/12));
    }
    const invested = P * mCount;
    return { invested: Math.round(invested), maturity: Math.round(total), interest: Math.round(total - invested) };
  }, [rdMonthly, rdRate, rdMonths]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="date-diff" className="rounded-xl py-2">Date Diff</TabsTrigger>
          <TabsTrigger value="roman" className="rounded-xl py-2">Roman</TabsTrigger>
          <TabsTrigger value="gpa" className="rounded-xl py-2">GPA 4.0</TabsTrigger>
          <TabsTrigger value="rd" className="rounded-xl py-2">RD Calc</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {activeTab === "date-diff" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-lg">Select Dates</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 flex flex-col justify-center items-center text-center p-8">
                 <p className="text-sm text-muted-foreground uppercase mb-4">Total Duration</p>
                 <div className="space-y-2">
                   <h2 className="text-4xl font-black text-primary">{dateDiff.years}y {dateDiff.months}m {dateDiff.days}d</h2>
                   <p className="text-lg font-bold opacity-60">or {dateDiff.totalDays} total days</p>
                 </div>
              </Card>
            </div>
          )}

          {activeTab === "roman" && (
            <div className="max-w-md mx-auto space-y-6">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-lg">Number to Roman</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="e.g. 2024" value={romanInput} onChange={(e) => setRomanInput(e.target.value)} />
                  <Button onClick={handleRoman} className="w-full">Convert</Button>
                </CardContent>
              </Card>
              {romanOutput && (
                <div className="p-8 text-center bg-secondary/10 rounded-3xl border border-dashed">
                   <p className="text-sm text-muted-foreground mb-2">Result</p>
                   <h2 className="text-5xl font-black text-primary">{romanOutput}</h2>
                </div>
              )}
            </div>
          )}

          {activeTab === "rd" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-lg">RD Investment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Deposit (₹)</Label>
                    <Input type="number" value={rdMonthly} onChange={(e) => setRdMonthly(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input type="number" value={rdRate} onChange={(e) => setRdRate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (Months)</Label>
                    <Input type="number" value={rdMonths} onChange={(e) => setRdMonths(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-muted-foreground">Invested</p>
                     <p className="text-xl font-bold">₹{rdResult.invested}</p>
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground">Interest</p>
                     <p className="text-xl font-bold text-green-600">+₹{rdResult.interest}</p>
                   </div>
                 </div>
                 <div className="pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Maturity Value</p>
                    <h2 className="text-4xl font-black text-primary">₹{rdResult.maturity}</h2>
                 </div>
              </Card>
            </div>
          )}

          {activeTab === "gpa" && (
            <div className="max-w-md mx-auto space-y-6">
               <Card>
                 <CardHeader><CardTitle>GPA 4.0 Converter</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <Label>Enter 10-point CGPA or Percentage</Label>
                    <Input type="number" value={gpaInput} onChange={(e) => setGpaInput(e.target.value)} />
                    <div className="p-6 text-center bg-primary/5 rounded-2xl border">
                       <p className="text-xs text-muted-foreground mb-1">US 4.0 Equivalent</p>
                       <h2 className="text-4xl font-black text-primary">{(parseFloat(gpaInput) * 0.4).toFixed(2)}</h2>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic text-center">Note: This is a general estimate. WES evaluation may differ.</p>
                 </CardContent>
               </Card>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
