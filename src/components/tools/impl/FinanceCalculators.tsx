"use client";

import React, { useState, useMemo } from "react";
import { 
  IndianRupee, 
  TrendingUp, 
  PieChart, 
  Briefcase,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinanceCalculators({ defaultTab = "sip" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // SIP States
  const [sipMonthly, setSipMonthly] = useState("5000");
  const [sipRate, setSipRate] = useState("12");
  const [sipYears, setSipYears] = useState("10");

  // FD States
  const [fdPrincipal, setFdPrincipal] = useState("100000");
  const [fdRate, setFdRate] = useState("7");
  const [fdYears, setFdYears] = useState("5");

  // Salary States
  const [ctc, setCtc] = useState("1200000");
  const [bonus, setBonus] = useState("100000");

  // --- SIP Calculations ---
  const sipResult = useMemo(() => {
    const P = parseFloat(sipMonthly) || 0;
    const i = (parseFloat(sipRate) || 0) / 12 / 100;
    const n = (parseFloat(sipYears) || 0) * 12;
    
    if (i === 0) return { invested: P * n, total: P * n, returns: 0 };
    
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    return {
      invested: Math.round(invested),
      total: Math.round(totalValue),
      returns: Math.round(totalValue - invested)
    };
  }, [sipMonthly, sipRate, sipYears]);

  // --- FD Calculations ---
  const fdResult = useMemo(() => {
    const P = parseFloat(fdPrincipal) || 0;
    const r = parseFloat(fdRate) || 0;
    const t = parseFloat(fdYears) || 0;
    const n = 4; // Quarterly compounding
    
    const totalValue = P * Math.pow(1 + (r / 100) / n, n * t);
    return {
      principal: Math.round(P),
      total: Math.round(totalValue),
      interest: Math.round(totalValue - P)
    };
  }, [fdPrincipal, fdRate, fdYears]);

  // --- Salary Calculations (India) ---
  const salaryResult = useMemo(() => {
    const annualCtc = parseFloat(ctc) || 0;
    const annualBonus = parseFloat(bonus) || 0;
    const baseCtc = annualCtc - annualBonus;
    
    const epf = Math.min(baseCtc * 0.12, 1800 * 12); // Simple EPF rule
    const professionalTax = 2500;
    const taxableIncome = baseCtc - epf - professionalTax - 50000; // Standard deduction
    
    // Very simplified tax (Old regime-ish)
    let tax = 0;
    if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3 + 112500;
    else if (taxableIncome > 500000) tax += (taxableIncome - 500000) * 0.2 + 12500;
    else if (taxableIncome > 250000) tax += (taxableIncome - 250000) * 0.05;

    const netAnnual = baseCtc - epf - professionalTax - tax;
    return {
      monthly: Math.round(netAnnual / 12),
      annual: Math.round(netAnnual),
      deductions: Math.round(epf + professionalTax + tax)
    };
  }, [ctc, bonus]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="sip" className="rounded-xl gap-2">
            <TrendingUp className="h-4 w-4" />
            SIP
          </TabsTrigger>
          <TabsTrigger value="fd" className="rounded-xl gap-2">
            <PieChart className="h-4 w-4" />
            Fixed Deposit
          </TabsTrigger>
          <TabsTrigger value="salary" className="rounded-xl gap-2">
            <Briefcase className="h-4 w-4" />
            Salary
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {activeTab === "sip" && (
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">SIP Investment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Investment (₹)</Label>
                    <Input type="number" value={sipMonthly} onChange={(e) => setSipMonthly(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Return Rate (% p.a.)</Label>
                    <Input type="number" value={sipRate} onChange={(e) => setSipRate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Period (Years)</Label>
                    <Input type="number" value={sipYears} onChange={(e) => setSipYears(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "fd" && (
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">FD Investment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Principal Amount (₹)</Label>
                    <Input type="number" value={fdPrincipal} onChange={(e) => setFdPrincipal(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (% p.a.)</Label>
                    <Input type="number" value={fdRate} onChange={(e) => setFdRate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tenure (Years)</Label>
                    <Input type="number" value={fdYears} onChange={(e) => setFdYears(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "salary" && (
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Annual Salary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Annual CTC (₹)</Label>
                    <Input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Bonus (₹)</Label>
                    <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-primary/20 bg-primary/5 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Calculated Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {activeTab === "sip" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Invested Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(sipResult.invested)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Est. Returns</p>
                        <p className="text-xl font-bold text-green-600">+{formatCurrency(sipResult.returns)}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                      <p className="text-4xl font-black text-primary">{formatCurrency(sipResult.total)}</p>
                    </div>
                  </>
                )}

                {activeTab === "fd" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Principal</p>
                        <p className="text-xl font-bold">{formatCurrency(fdResult.principal)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-xl font-bold text-green-600">+{formatCurrency(fdResult.interest)}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Maturity Value</p>
                      <p className="text-4xl font-black text-primary">{formatCurrency(fdResult.total)}</p>
                    </div>
                  </>
                )}

                {activeTab === "salary" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Annual In-Hand</p>
                        <p className="text-xl font-bold">{formatCurrency(salaryResult.annual)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Annual Deductions</p>
                        <p className="text-xl font-bold text-red-600">-{formatCurrency(salaryResult.deductions)}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t bg-background/40 p-6 rounded-2xl border">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Take-Home Salary</p>
                      <p className="text-4xl font-black text-primary">{formatCurrency(salaryResult.monthly)}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex gap-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0" />
        <p>Disclaimer: These calculators provide estimates only. Actual values may vary based on market conditions, specific bank rules, or tax laws. Please consult a financial advisor for critical decisions.</p>
      </div>
    </div>
  );
}
