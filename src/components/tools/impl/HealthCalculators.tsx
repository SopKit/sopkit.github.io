"use client";

import React, { useState, useMemo } from "react";
import { 
  HeartPulse, 
  Flame, 
  Droplets, 
  Scale, 
  Dna, 
  Activity,
  ChevronRight,
  Info,
  Shield,
  Zap,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function HealthCalculators({ defaultTab = "bmr" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Common States
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("70"); // kg
  const [height, setHeight] = useState("175"); // cm
  const [activity, setActivity] = useState("1.375"); // Sedentary to Active
  const [neck, setNeck] = useState("37");
  const [waist, setWaist] = useState("80");
  const [hip, setHip] = useState("95");

  // --- BMR (Mifflin-St Jeor Equation) ---
  const bmr = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    if (w === 0 || h === 0 || a === 0) return 0;

    let base = 10 * w + 6.25 * h - 5 * a;
    return Math.round(gender === "male" ? base + 5 : base - 161);
  }, [weight, height, age, gender]);

  // --- TDEE ---
  const tdee = useMemo(() => {
    return Math.round(bmr * parseFloat(activity));
  }, [bmr, activity]);

  // --- Water Intake ---
  const waterIntake = useMemo(() => {
    const w = parseFloat(weight) || 0;
    return ((w * 0.033) + (activity > 1.5 ? 0.5 : 0)).toFixed(1);
  }, [weight, activity]);

  // --- Body Fat (US Navy Method) ---
  const bodyFat = useMemo(() => {
    const w = parseFloat(waist) || 0;
    const n = parseFloat(neck) || 0;
    const h = parseFloat(height) || 0;
    const hp = parseFloat(hip) || 0;

    if (h === 0 || n === 0 || w === 0) return 0;

    if (gender === "male") {
      return (495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450).toFixed(1);
    } else {
      return (495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450).toFixed(1);
    }
  }, [waist, neck, height, hip, gender]);

  // --- Ideal Weight ---
  const idealWeight = useMemo(() => {
    const h = parseFloat(height) || 0;
    if (h < 152) return "N/A";
    const inchesOver5ft = (h - 152.4) / 2.54;
    const base = gender === "male" ? 50 : 45.5;
    const add = gender === "male" ? 2.3 : 2.3;
    return (base + add * inchesOver5ft).toFixed(1);
  }, [height, gender]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="bmr" className="rounded-xl py-2">BMR</TabsTrigger>
          <TabsTrigger value="tdee" className="rounded-xl py-2">TDEE</TabsTrigger>
          <TabsTrigger value="macro" className="rounded-xl py-2">Macros</TabsTrigger>
          <TabsTrigger value="water" className="rounded-xl py-2">Water</TabsTrigger>
          <TabsTrigger value="body-fat" className="rounded-xl py-2">Body Fat</TabsTrigger>
          <TabsTrigger value="ideal" className="rounded-xl py-2">Ideal Weight</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/10 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                </div>

                {(activeTab === "tdee" || activeTab === "macro") && (
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Sedentary (Office job)</SelectItem>
                        <SelectItem value="1.375">Lightly Active (1-2 days/week)</SelectItem>
                        <SelectItem value="1.55">Moderately Active (3-5 days/week)</SelectItem>
                        <SelectItem value="1.725">Very Active (6-7 days/week)</SelectItem>
                        <SelectItem value="1.9">Extra Active (Athlete/Physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeTab === "body-fat" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Neck (cm)</Label>
                        <Input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Waist (cm)</Label>
                        <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
                      </div>
                    </div>
                    {gender === "female" && (
                      <div className="space-y-2">
                        <Label>Hip (cm)</Label>
                        <Input type="number" value={hip} onChange={(e) => setHip(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center space-y-8 pb-10">
                {activeTab === "bmr" && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Your BMR is</p>
                    <h2 className="text-6xl font-black text-primary">{bmr} <span className="text-xl font-normal">kcal/day</span></h2>
                    <p className="text-sm max-w-sm mx-auto text-muted-foreground">This is the number of calories your body burns just to stay alive at rest.</p>
                  </div>
                )}

                {activeTab === "tdee" && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Your Maintenance Calories</p>
                    <h2 className="text-6xl font-black text-primary">{tdee} <span className="text-xl font-normal">kcal/day</span></h2>
                    <div className="grid grid-cols-2 gap-4 pt-6">
                      <div className="p-4 rounded-2xl bg-background/50 border">
                        <p className="text-xs text-muted-foreground">Weight Loss</p>
                        <p className="font-bold text-green-600">{tdee - 500} kcal</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-background/50 border">
                        <p className="text-xs text-muted-foreground">Weight Gain</p>
                        <p className="font-bold text-orange-600">{tdee + 500} kcal</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "water" && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Recommended Daily Water</p>
                    <h2 className="text-6xl font-black text-blue-600">{waterIntake} <span className="text-xl font-normal">Liters</span></h2>
                    <div className="flex justify-center gap-2">
                       {Array.from({length: Math.ceil(parseFloat(waterIntake) / 0.25)}).map((_, i) => (
                         <Droplets key={i} className="h-5 w-5 text-blue-400 fill-blue-400" />
                       )).slice(0, 10)}
                    </div>
                  </div>
                )}

                {activeTab === "body-fat" && (
                  <div className="text-center space-y-6">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Estimated Body Fat</p>
                    <h2 className="text-6xl font-black text-primary">{bodyFat}%</h2>
                    <Progress value={parseFloat(bodyFat)} className="h-3 max-w-md mx-auto" />
                    <p className="text-xs text-muted-foreground italic">Note: US Navy formula is an estimate. DXA scans are more accurate.</p>
                  </div>
                )}

                {activeTab === "ideal" && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Your Ideal Weight (Miller Formula)</p>
                    <h2 className="text-6xl font-black text-primary">{idealWeight} <span className="text-xl font-normal">kg</span></h2>
                    <p className="text-sm text-muted-foreground">Healthy BMI range for your height: {Math.round(18.5 * Math.pow(parseFloat(height)/100, 2))} - {Math.round(25 * Math.pow(parseFloat(height)/100, 2))} kg</p>
                  </div>
                )}

                {activeTab === "macro" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                       <div className="p-3 text-center rounded-xl bg-orange-100 border-orange-200 border">
                         <p className="text-[10px] uppercase font-bold text-orange-700">Protein</p>
                         <p className="text-lg font-black text-orange-900">{Math.round((tdee * 0.3) / 4)}g</p>
                       </div>
                       <div className="p-3 text-center rounded-xl bg-blue-100 border-blue-200 border">
                         <p className="text-[10px] uppercase font-bold text-blue-700">Carbs</p>
                         <p className="text-lg font-black text-blue-900">{Math.round((tdee * 0.4) / 4)}g</p>
                       </div>
                       <div className="p-3 text-center rounded-xl bg-yellow-100 border-yellow-200 border">
                         <p className="text-[10px] uppercase font-bold text-yellow-700">Fats</p>
                         <p className="text-lg font-black text-yellow-900">{Math.round((tdee * 0.3) / 9)}g</p>
                       </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">Ratio: 30% Protein | 40% Carbs | 30% Fats</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
          <div>
            <h5 className="font-bold text-sm">Safe & Secure</h5>
            <p className="text-xs text-muted-foreground">Your health data never leaves your browser. 100% private.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Dna className="h-5 w-5 text-primary" /></div>
          <div>
            <h5 className="font-bold text-sm">Scientific Formulas</h5>
            <p className="text-xs text-muted-foreground">Calculations based on Mifflin-St Jeor and US Navy standard equations.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Target className="h-5 w-5 text-primary" /></div>
          <div>
            <h5 className="font-bold text-sm">Goal Oriented</h5>
            <p className="text-xs text-muted-foreground">Personalized suggestions for weight loss, gain, or health maintenance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
