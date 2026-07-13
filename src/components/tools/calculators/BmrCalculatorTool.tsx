"use client";

import React, { useState, useEffect } from "react";
import { 
	HeartPulseIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface BmrResult {
	mifflin: number;
	harris: number;
}

export default function BmrCalculatorTool() {
	const [gender, setGender] = useState("male");
	const [age, setAge] = useState("25");
	const [weight, setWeight] = useState("70");
	const [weightUnit, setWeightUnit] = useState("kg"); // kg, lbs
	const [height, setHeight] = useState("175");
	const [heightUnit, setHeightUnit] = useState("cm"); // cm, inches

	const [result, setResult] = useState<BmrResult | null>(null);
	const [copied, setCopied] = useState(false);

	const calculateBmr = () => {
		const ageVal = parseInt(age, 10);
		let weightVal = parseFloat(weight);
		let heightVal = parseFloat(height);

		if (
			isNaN(ageVal) || isNaN(weightVal) || isNaN(heightVal) || 
			ageVal <= 0 || weightVal <= 0 || heightVal <= 0
		) {
			setResult(null);
			return;
		}

		// Normalize units to metric (kg, cm)
		if (weightUnit === "lbs") {
			weightVal = weightVal * 0.45359237;
		}
		if (heightUnit === "inches") {
			heightVal = heightVal * 2.54;
		}

		// Mifflin-St Jeor Equation:
		// Men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
		// Women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
		let bmrMifflin = 0;
		if (gender === "male") {
			bmrMifflin = (10 * weightVal) + (6.25 * heightVal) - (5 * ageVal) + 5;
		} else {
			bmrMifflin = (10 * weightVal) + (6.25 * heightVal) - (5 * ageVal) - 161;
		}

		// Harris-Benedict Equation (Revised by Roza and Shizgal in 1984):
		// Men: BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
		// Women: BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
		let bmrHarris = 0;
		if (gender === "male") {
			bmrHarris = 88.362 + (13.397 * weightVal) + (4.799 * heightVal) - (5.677 * ageVal);
		} else {
			bmrHarris = 447.593 + (9.247 * weightVal) + (3.098 * heightVal) - (4.330 * ageVal);
		}

		setResult({
			mifflin: Math.round(bmrMifflin),
			harris: Math.round(bmrHarris)
		});
	};

	useEffect(() => {
		calculateBmr();
	}, [gender, age, weight, weightUnit, height, heightUnit]);

	const copySummary = () => {
		if (!result) return;
		const summary = `BMR Projections:\n- Mifflin-St Jeor: ${result.mifflin} kcal/day\n- Revised Harris-Benedict: ${result.harris} kcal/day`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("BMR metrics copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<HeartPulseIcon className="text-primary w-6 h-6 animate-pulse" />
							BMR Parameters
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Gender</label>
								<Select value={gender} onValueChange={(v: string) => setGender(v)}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="male" className="rounded-lg">Male</SelectItem>
										<SelectItem value="female" className="rounded-lg">Female</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Age (years)</label>
								<input
									type="number"
									value={age}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Weight</label>
								<div className="relative">
									<input
										type="number"
										value={weight}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 pr-24 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
									<select
										value={weightUnit}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWeightUnit(e.target.value)}
										className="absolute right-3 top-3 h-8 rounded-lg bg-background border border-border/60 px-2 text-xs font-bold focus:outline-none"
									>
										<option value="kg">kg</option>
										<option value="lbs">lbs</option>
									</select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Height</label>
								<div className="relative">
									<input
										type="number"
										value={height}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 pr-24 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
									<select
										value={heightUnit}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHeightUnit(e.target.value)}
										className="absolute right-3 top-3 h-8 rounded-lg bg-background border border-border/60 px-2 text-xs font-bold focus:outline-none"
									>
										<option value="cm">cm</option>
										<option value="inches">inches</option>
									</select>
								</div>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">BMR Projections</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-4xl font-black text-primary font-mono">{result.mifflin} <span className="text-sm font-bold">kcal/day</span></div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Mifflin-St Jeor BMR</div>
									</div>

									<div className="p-6 bg-muted/10 border border-border/40 rounded-3xl text-center">
										<div className="text-4xl font-black text-foreground font-mono">{result.harris} <span className="text-sm font-bold text-muted-foreground">kcal/day</span></div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Harris-Benedict BMR</div>
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
										COPIED METRICS!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY BMR VALUES
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
