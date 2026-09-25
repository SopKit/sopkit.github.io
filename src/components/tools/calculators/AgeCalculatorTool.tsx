"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	Calendar,
	Clock,
	Sparkles,
	Copy,
	Check,
	RefreshCw,
	Compass,
	Award,
	HelpCircle,
	ArrowRight,
	Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
	ToolPrivacyNote,
} from "@/components/tools/shared/design-system";

// Zodiac helper
function getWesternZodiac(month: number, day: number): { sign: string; symbol: string; element: string } {
	// month is 1-indexed (1 = Jan)
	if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", symbol: "♈", element: "Fire" };
	if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉", element: "Earth" };
	if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊", element: "Air" };
	if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋", element: "Water" };
	if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", symbol: "♌", element: "Fire" };
	if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍", element: "Earth" };
	if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", symbol: "♎", element: "Air" };
	if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏", element: "Water" };
	if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐", element: "Fire" };
	if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑", element: "Earth" };
	if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒", element: "Air" };
	return { sign: "Pisces", symbol: "♓", element: "Water" };
}

function getChineseZodiac(year: number): { animal: string; icon: string } {
	const animals = [
		{ animal: "Rat", icon: "🐀" },
		{ animal: "Ox", icon: "🐂" },
		{ animal: "Tiger", icon: "🐅" },
		{ animal: "Rabbit", icon: "🐇" },
		{ animal: "Dragon", icon: "🐉" },
		{ animal: "Snake", icon: "🐍" },
		{ animal: "Horse", icon: "🐎" },
		{ animal: "Goat", icon: "🐐" },
		{ animal: "Monkey", icon: "🐒" },
		{ animal: "Rooster", icon: "🐓" },
		{ animal: "Dog", icon: "🐕" },
		{ animal: "Pig", icon: "🐖" },
	];
	const index = (year - 4) % 12;
	return animals[index >= 0 ? index : index + 12];
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AgeCalculatorTool() {
	// Default to a 25-year-old birthday
	const defaultDate = useMemo(() => {
		const d = new Date();
		d.setFullYear(d.getFullYear() - 25);
		return d.toISOString().split("T")[0];
	}, []);

	const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

	const [dob, setDob] = useState(defaultDate);
	const [targetDate, setTargetDate] = useState(todayStr);
	const [copied, setCopied] = useState(false);

	// Quick presets
	const handlePreset = (yearsAgo: number) => {
		const d = new Date();
		d.setFullYear(d.getFullYear() - yearsAgo);
		setDob(d.toISOString().split("T")[0]);
		setTargetDate(todayStr);
	};

	// Detailed chronological calculation
	const ageStats = useMemo(() => {
		if (!dob || !targetDate) return null;

		const birth = new Date(dob + "T00:00:00");
		const target = new Date(targetDate + "T00:00:00");

		if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
		if (birth > target) {
			return { isFuture: true };
		}

		// Exact years, months, days calculation
		let years = target.getFullYear() - birth.getFullYear();
		let months = target.getMonth() - birth.getMonth();
		let days = target.getDate() - birth.getDate();

		if (days < 0) {
			// Borrow days from previous month
			const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
			days += prevMonthLastDay;
			months -= 1;
		}

		if (months < 0) {
			months += 12;
			years -= 1;
		}

		// Total units
		const diffMs = target.getTime() - birth.getTime();
		const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const totalWeeks = Math.floor(totalDays / 7);
		const remainingDaysInWeek = totalDays % 7;
		const totalMonths = years * 12 + months;
		const totalHours = totalDays * 24;
		const totalMinutes = totalHours * 60;
		const totalSeconds = totalMinutes * 60;

		// Day of week born
		const dayBorn = DAYS_OF_WEEK[birth.getDay()];

		// Next birthday calculation relative to target
		const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
		if (nextBday < target) {
			nextBday.setFullYear(target.getFullYear() + 1);
		}
		const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
		const nextBdayDayOfWeek = DAYS_OF_WEEK[nextBday.getDay()];

		// Zodiac info
		const western = getWesternZodiac(birth.getMonth() + 1, birth.getDate());
		const chinese = getChineseZodiac(birth.getFullYear());

		return {
			isFuture: false,
			years,
			months,
			days,
			totalDays,
			totalWeeks,
			remainingDaysInWeek,
			totalMonths,
			totalHours,
			totalMinutes,
			totalSeconds,
			dayBorn,
			daysToNextBday,
			nextBdayDayOfWeek,
			western,
			chinese,
		};
	}, [dob, targetDate]);

	const handleCopySummary = () => {
		if (!ageStats || ageStats.isFuture) return;
		const text = `Age Summary:
• Chronological Age: ${ageStats.years} years, ${ageStats.months} months, ${ageStats.days} days
• Total Days Lived: ${ageStats.totalDays.toLocaleString()} days (${ageStats.totalWeeks.toLocaleString()} weeks)
• Day of Birth: ${ageStats.dayBorn}
• Zodiac: ${ageStats.western.sign} ${ageStats.western.symbol} (${ageStats.western.element})
• Next Birthday: In ${ageStats.daysToNextBday} days (${ageStats.nextBdayDayOfWeek})
Calculated privately with SopKit (https://sopkit.space/age-calculator)`;

		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<ToolShell>
			<ToolGrid>
				{/* Main Inputs & Primary Result */}
				<ToolGridMain className="space-y-6">
					<ToolPanel className="space-y-5">
						<ToolSectionTitle
							icon={<Calendar className="h-4 w-4 text-primary" />}
							title="Date Configuration"
							subtitle="Enter your birthdate and calculate age as of today or any custom cutoff date"
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<ToolField label="Date of Birth" fieldId="dob-input">
								<Input
									id="dob-input"
									type="date"
									value={dob}
									max="2100-12-31"
									onChange={(e) => setDob(e.target.value)}
									className="h-10 text-base"
								/>
							</ToolField>

							<ToolField label="Age as of Date" fieldId="target-date-input">
								<Input
									id="target-date-input"
									type="date"
									value={targetDate}
									onChange={(e) => setTargetDate(e.target.value)}
									className="h-10 text-base"
								/>
							</ToolField>
						</div>

						{/* Quick Preset Chips */}
						<div className="space-y-1.5 pt-1">
							<span className="text-xs text-muted-foreground font-medium">Quick Presets:</span>
							<div className="flex flex-wrap gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7 rounded-full"
									onClick={() => handlePreset(18)}
								>
									18 Years Old
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7 rounded-full"
									onClick={() => handlePreset(21)}
								>
									21 Years Old
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7 rounded-full"
									onClick={() => handlePreset(30)}
								>
									30 Years Old
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7 rounded-full"
									onClick={() => handlePreset(60)}
								>
									60 Years Old (Retirement)
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="text-xs h-7 rounded-full text-muted-foreground"
									onClick={() => {
										setDob(defaultDate);
										setTargetDate(todayStr);
									}}
								>
									<RefreshCw className="h-3 w-3 mr-1" /> Reset
								</Button>
							</div>
						</div>
					</ToolPanel>

					{/* Chronological Age Highlight Card */}
					{ageStats && !ageStats.isFuture && (
						<ToolPanel className="space-y-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
								<ToolSectionTitle
									icon={<Award className="h-4 w-4 text-emerald-500" />}
									title="Exact Chronological Age"
									subtitle={`Calculated from ${dob} to ${targetDate}`}
								/>
								<Button
									size="sm"
									variant="secondary"
									className="h-8 gap-1.5 text-xs rounded-xl self-start sm:self-auto"
									onClick={handleCopySummary}
								>
									{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
									<span>{copied ? "Copied Summary" : "Copy Summary"}</span>
								</Button>
							</div>

							{/* Hero Age Display */}
							<div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
								<div className="p-4 sm:p-5 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
									<div className="text-3xl sm:text-5xl font-mono font-bold text-foreground">
										{ageStats.years}
									</div>
									<div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
										Years
									</div>
								</div>
								<div className="p-4 sm:p-5 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
									<div className="text-3xl sm:text-5xl font-mono font-bold text-foreground">
										{ageStats.months}
									</div>
									<div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
										Months
									</div>
								</div>
								<div className="p-4 sm:p-5 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
									<div className="text-3xl sm:text-5xl font-mono font-bold text-foreground">
										{ageStats.days}
									</div>
									<div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
										Days
									</div>
								</div>
							</div>

							<div className="p-3.5 rounded-xl bg-background border border-border/80 text-xs sm:text-sm text-foreground flex items-center justify-between">
								<span className="text-muted-foreground">Standard Notation:</span>
								<span className="font-mono font-semibold">
									{ageStats.years}y {ageStats.months}m {ageStats.days}d
								</span>
							</div>

							{/* Next Birthday Banner */}
							<div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
										<Cake className="h-5 w-5" />
									</div>
									<div>
										<div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
											Upcoming Birthday
										</div>
										<div className="text-sm font-medium text-foreground">
											{ageStats.daysToNextBday === 0 ? (
												<span className="text-emerald-600 font-bold">🎉 Happy Birthday today!</span>
											) : (
												<>
													In <span className="font-mono font-bold">{ageStats.daysToNextBday}</span> days (on a {ageStats.nextBdayDayOfWeek})
												</>
											)}
										</div>
									</div>
								</div>
								<Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
									Turning {ageStats.years + 1}
								</Badge>
							</div>
						</ToolPanel>
					)}

					{/* Future date warning */}
					{ageStats?.isFuture && (
						<ToolPanel className="border-amber-500/30 bg-amber-500/5 text-center py-8">
							<p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
								The birth date is later than the comparison date. Please select a valid birth date in the past.
							</p>
						</ToolPanel>
					)}

					{/* Lifetime Equivalencies & Units */}
					{ageStats && !ageStats.isFuture && (
						<ToolPanel className="space-y-4">
							<ToolSectionTitle
								icon={<Clock className="h-4 w-4 text-primary" />}
								title="Lifespan Equivalent Metrics"
								subtitle="Your entire age broken down into single continuous measurement units"
							/>

							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Months</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalMonths.toLocaleString()}
									</div>
								</div>
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Weeks</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalWeeks.toLocaleString()}
									</div>
								</div>
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Days</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalDays.toLocaleString()}
									</div>
								</div>
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Hours</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalHours.toLocaleString()}
									</div>
								</div>
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Minutes</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalMinutes.toLocaleString()}
									</div>
								</div>
								<div className="p-3 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Seconds</span>
									<div className="text-lg font-mono font-semibold text-foreground mt-0.5">
										{ageStats.totalSeconds.toLocaleString()}
									</div>
								</div>
							</div>
						</ToolPanel>
					)}
				</ToolGridMain>

				{/* Sidebar: Astrological & Cultural Insights */}
				<ToolGridSide className="space-y-6">
					{ageStats && !ageStats.isFuture && (
						<ToolPanel className="space-y-4">
							<ToolSectionTitle
								icon={<Compass className="h-4 w-4 text-primary" />}
								title="Astrology & Milestones"
								subtitle="Birth chart profile"
							/>

							<div className="space-y-3 text-sm">
								<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/40 dark:bg-muted/20 border border-border">
									<span className="text-muted-foreground text-xs">Day of Week Born:</span>
									<span className="font-semibold text-foreground">{ageStats.dayBorn}</span>
								</div>

								<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/40 dark:bg-muted/20 border border-border">
									<span className="text-muted-foreground text-xs">Western Zodiac:</span>
									<span className="font-semibold text-foreground">
										{ageStats.western.sign} {ageStats.western.symbol}
									</span>
								</div>

								<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/40 dark:bg-muted/20 border border-border">
									<span className="text-muted-foreground text-xs">Zodiac Element:</span>
									<Badge variant="outline" className="text-xs">
										{ageStats.western.element}
									</Badge>
								</div>

								<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/40 dark:bg-muted/20 border border-border">
									<span className="text-muted-foreground text-xs">Chinese Zodiac:</span>
									<span className="font-semibold text-foreground">
										Year of the {ageStats.chinese.animal} {ageStats.chinese.icon}
									</span>
								</div>
							</div>
						</ToolPanel>
					)}

					<ToolPanel className="space-y-3">
						<ToolSectionTitle
							icon={<HelpCircle className="h-4 w-4 text-muted-foreground" />}
							title="How Calculations Work"
						/>
						<p className="text-xs text-muted-foreground leading-relaxed">
							This calculator measures elapsed calendar time using ISO date math. Month lengths (28 to 31 days) and leap years (February 29) are fully factored into day borrows to ensure legal and institutional precision.
						</p>
						<ToolPrivacyNote>All dates are computed locally in your browser sandbox.</ToolPrivacyNote>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
