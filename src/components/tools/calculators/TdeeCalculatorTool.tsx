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

interface TDEEResult {
	bmr: number;
	tdee: number;
	loss: number;
	gain: number;
	mildLoss: number;
	mildGain: number;
}

export default function TdeeCalculatorTool() {
	const [gender, setGender] = useState("male");
	const [age, setAge] = useState("25");
	const [weight, setWeight] = useState("70");
	const [weightUnit, setWeightUnit] = useState("kg");
	const [height, setHeight] = useState("175");
	const [heightUnit, setHeightUnit] = useState("cm");
	const [activity, setActivity] = useState("1.55"); // moderate active by default

	const [result, setResult] = useState<TDEEResult | null>(null);
	const [copied, setCopied] = useState(false);

	const calculateTdee = () => {
		const ageVal = parseInt(age, 10);
		let weightVal = parseFloat(weight);
		let heightVal = parseFloat(height);
		const activityFactor = parseFloat(activity);

		if (
			isNaN(ageVal) || isNaN(weightVal) || isNaN(heightVal) || 
			ageVal <= 0 || weightVal <= 0 || heightVal <= 0
		) {
			setResult(null);
			return;
		}

		// Normalize units
		if (weightUnit === "lbs") {
			weightVal = weightVal * 0.45359237;
		}
		if (heightUnit === "inches") {
			heightVal = heightVal * 2.54;
		}

		// Mifflin-St Jeor Formula for BMR
		let bmr = 0;
		if (gender === "male") {
			bmr = (10 * weightVal) + (6.25 * heightVal) - (5 * ageVal) + 5;
		} else {
			bmr = (10 * weightVal) + (6.25 * heightVal) - (5 * ageVal) - 161;
		}

		const tdeeVal = bmr * activityFactor;

		setResult({
			bmr: Math.round(bmr),
			tdee: Math.round(tdeeVal),
			loss: Math.round(tdeeVal - 500),
			gain: Math.round(tdeeVal + 500),
			mildLoss: Math.round(tdeeVal - 250),
			mildGain: Math.round(tdeeVal + 250)
		});
	};

	useEffect(() => {
		calculateTdee();
	}, [gender, age, weight, weightUnit, height, heightUnit, activity]);

	const copySummary = () => {
		if (!result) return;
		const summary = `TDEE Projections:\n- Maintenance: ${result.tdee} kcal/day\n- Weight Loss: ${result.loss} kcal/day\n- Weight Gain: ${result.gain} kcal/day`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("TDEE metrics copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<ActivityIcon className="text-primary w-6 h-6 animate-pulse" />
							Activity Parameters
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Gender</label>
								<Select value={gender} onValueChange={setGender}>
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

							<div className="space-y-2 sm:col-span-2">
								<label className="text-sm font-bold">Daily Physical Activity</label>
								<Select value={activity} onValueChange={setActivity}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="1.2" className="rounded-lg">Sedentary (desk job, no exercise)</SelectItem>
										<SelectItem value="1.375" className="rounded-lg">Lightly Active (light exercise 1-3 days/week)</SelectItem>
										<SelectItem value="1.55" className="rounded-lg">Moderately Active (exercise 3-5 days/week)</SelectItem>
										<SelectItem value="1.725" className="rounded-lg">Very Active (heavy exercise 6-7 days/week)</SelectItem>
										<SelectItem value="1.9" className="rounded-lg">Extremely Active (professional athlete/physical labor)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Your TDEE</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-4xl font-black text-primary font-mono">{result.tdee} <span className="text-sm font-bold">kcal/day</span></div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Maintenance Calories</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Mild Weight Loss (-250):</span>
											<span className="font-bold text-foreground font-mono">{result.mildLoss} kcal</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Standard Weight Loss (-500):</span>
											<span className="font-bold text-foreground font-mono">{result.loss} kcal</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Mild Weight Gain (+250):</span>
											<span className="font-bold text-foreground font-mono">{result.mildGain} kcal</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Standard Weight Gain (+500):</span>
											<span className="font-bold text-foreground font-mono">{result.gain} kcal</span>
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
										COPIED TDEE!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY TDEE DETAILS
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
