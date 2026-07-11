"use client";

import { useState } from "react";
import { DollarSign, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function YouTubeMoneyCalculatorTool() {
	const [dailyViews, setDailyViews] = useState(10000);
	const [rpm, setRpm] = useState(3.50); // Revenue Per Mille (1000 views)
	const [copied, setCopied] = useState(false);

	const calculateEarnings = () => {
		const daily = (dailyViews / 1000) * rpm;
		const monthly = daily * 30.4;
		const yearly = daily * 365;
		return {
			daily: daily.toFixed(2),
			monthly: monthly.toFixed(2),
			yearly: yearly.toFixed(2)
		};
	};

	const earnings = calculateEarnings();

	const handleCopy = () => {
		const summary = `YouTube Estimated Earnings:\nDaily: $${earnings.daily}\nMonthly: $${earnings.monthly}\nYearly: $${earnings.yearly}\nCalculated via SopKit.`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Earnings summary copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 animate-in">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Inputs */}
				<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl p-6 space-y-6">
					<CardHeader className="p-0 pb-4 border-b border-border/20">
						<CardTitle className="text-xl font-bold flex items-center gap-2">
							<DollarSign className="w-5 h-5 text-primary" />
							Earnings Parameters
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0 space-y-6 pt-4">
						<div className="space-y-3">
							<div className="flex justify-between font-semibold text-sm">
								<span>Estimated Daily Views</span>
								<span className="text-primary">{dailyViews.toLocaleString()} views</span>
							</div>
							<input
								type="range"
								min="100"
								max="1000000"
								step="100"
								value={dailyViews}
								onChange={(e) => setDailyViews(parseInt(e.target.value))}
								className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between font-semibold text-sm">
								<span>Estimated RPM (Revenue per 1k views)</span>
								<span className="text-primary">${rpm.toFixed(2)}</span>
							</div>
							<input
								type="range"
								min="0.50"
								max="20.00"
								step="0.10"
								value={rpm}
								onChange={(e) => setRpm(parseFloat(e.target.value))}
								className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Outputs */}
				<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl p-6 flex flex-col justify-between">
					<CardHeader className="p-0 pb-4 border-b border-border/20 flex flex-row items-center justify-between">
						<CardTitle className="text-xl font-bold">Estimated Earnings</CardTitle>
						<Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 text-muted-foreground hover:text-foreground">
							{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
						</Button>
					</CardHeader>
					<CardContent className="p-0 pt-6 space-y-4 flex-1 flex flex-col justify-center">
						<div className="grid grid-cols-3 gap-4 text-center">
							<div className="p-4 bg-muted/40 rounded-xl border border-border/20">
								<span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Daily</span>
								<div className="text-lg sm:text-xl font-black text-primary mt-1">${earnings.daily}</div>
							</div>
							<div className="p-4 bg-muted/40 rounded-xl border border-border/20">
								<span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Monthly</span>
								<div className="text-lg sm:text-xl font-black text-primary mt-1">${earnings.monthly}</div>
							</div>
							<div className="p-4 bg-muted/40 rounded-xl border border-border/20">
								<span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Yearly</span>
								<div className="text-lg sm:text-xl font-black text-primary mt-1">${earnings.yearly}</div>
							</div>
						</div>

						<p className="text-[10px] text-muted-foreground text-center leading-relaxed mt-4">
							Disclaimer: These calculations are estimates based on standard RPM metrics. Actual ad earnings depend on video length, geographic region of viewers, and niche category.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
