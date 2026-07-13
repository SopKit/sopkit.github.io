"use client";

import React, { useState, useEffect } from "react";
import { 
	ActivityIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface MacroResult {
	carbGrams: number;
	proteinGrams: number;
	fatGrams: number;
	carbCals: number;
	proteinCals: number;
	fatCals: number;
	ratios: {
		carb: number;
		protein: number;
		fat: number;
	};
}

type DietType = "balanced" | "lowcarb" | "highprotein" | "keto";

export default function MacroCalculatorTool() {
	const [calories, setCalories] = useState("2000");
	const [dietType, setDietType] = useState<DietType>("balanced"); // balanced, lowcarb, highprotein, keto

	const [result, setResult] = useState<MacroResult | null>(null);
	const [copied, setCopied] = useState(false);

	const dietRatios: Record<DietType, { carb: number; protein: number; fat: number }> = {
		balanced: { carb: 0.40, protein: 0.30, fat: 0.30 },
		lowcarb: { carb: 0.25, protein: 0.40, fat: 0.35 },
		highprotein: { carb: 0.30, protein: 0.40, fat: 0.30 },
		keto: { carb: 0.05, protein: 0.25, fat: 0.70 }
	};

	const calculateMacros = () => {
		const calTarget = parseFloat(calories);
		if (isNaN(calTarget) || calTarget <= 0) {
			setResult(null);
			return;
		}

		const ratio = dietRatios[dietType];

		// Calorie counts
		const carbCals = calTarget * ratio.carb;
		const proteinCals = calTarget * ratio.protein;
		const fatCals = calTarget * ratio.fat;

		// Gram counts (4 kcal/g for carbs/protein, 9 kcal/g for fat)
		const carbGrams = carbCals / 4;
		const proteinGrams = proteinCals / 4;
		const fatGrams = fatCals / 9;

		setResult({
			carbGrams: Math.round(carbGrams),
			proteinGrams: Math.round(proteinGrams),
			fatGrams: Math.round(fatGrams),
			carbCals: Math.round(carbCals),
			proteinCals: Math.round(proteinCals),
			fatCals: Math.round(fatCals),
			ratios: {
				carb: Math.round(ratio.carb * 100),
				protein: Math.round(ratio.protein * 100),
				fat: Math.round(ratio.fat * 100)
			}
		});
	};

	useEffect(() => {
		calculateMacros();
	}, [calories, dietType]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Daily Macronutrients Target (${calories} kcal, ${dietType} diet):\n- Protein: ${result.proteinGrams}g (${result.proteinCals} kcal)\n- Carbs: ${result.carbGrams}g (${result.carbCals} kcal)\n- Fats: ${result.fatGrams}g (${result.fatCals} kcal)`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Macronutrient targets copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<ActivityIcon className="text-primary w-6 h-6 animate-pulse" />
							Diet Profile
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Daily Calorie Target (kcal)</label>
								<input
									type="number"
									value={calories}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCalories(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Diet Strategy / Splits</label>
								<Select value={dietType} onValueChange={setDietType}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="balanced" className="rounded-lg">Balanced (40/30/30)</SelectItem>
										<SelectItem value="lowcarb" className="rounded-lg">Low Carb (25/40/35)</SelectItem>
										<SelectItem value="highprotein" className="rounded-lg">High Protein (30/40/30)</SelectItem>
										<SelectItem value="keto" className="rounded-lg">Ketogenic / Keto (5/25/70)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Macro Splits</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="grid grid-cols-3 gap-4">
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.proteinGrams}g</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Protein ({result.ratios.protein}%)</div>
										</div>
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.carbGrams}g</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Carbs ({result.ratios.carb}%)</div>
										</div>
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.fatGrams}g</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Fats ({result.ratios.fat}%)</div>
										</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Protein Calories:</span>
											<span className="font-bold text-foreground font-mono">{result.proteinCals} kcal</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Carbohydrate Calories:</span>
											<span className="font-bold text-foreground font-mono">{result.carbCals} kcal</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Fat Calories:</span>
											<span className="font-bold text-foreground font-mono">{result.fatCals} kcal</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="mt-8">
							<Button
								onClick={copySummary}
								disabled={!result}
								className="w-full h-16 rounded-[1.5rem] font-bold bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5" />
										COPIED MACROS!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY MACRO TARGETS
									</>
								)}
							</Button>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
