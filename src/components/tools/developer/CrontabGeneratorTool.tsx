"use client";

import React, { useState, useEffect } from "react";
import { 
	ClockIcon, 
	CopyIcon, 
	CheckCircleIcon, 
	HelpCircleIcon, 
	ZapIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function CrontabGeneratorTool() {
	const [minute, setMinute] = useState("*");
	const [hour, setHour] = useState("*");
	const [dayOfMonth, setDayOfMonth] = useState("*");
	const [month, setMonth] = useState("*");
	const [dayOfWeek, setDayOfWeek] = useState("*");

	const [expression, setExpression] = useState("* * * * *");
	const [description, setDescription] = useState("Every minute");
	const [copied, setCopied] = useState(false);

	const templates = [
		{ name: "Every Minute", min: "*", hr: "*", dom: "*", mon: "*", dow: "*" },
		{ name: "Every Hour", min: "0", hr: "*", dom: "*", mon: "*", dow: "*" },
		{ name: "Every Midnight", min: "0", hr: "0", dom: "*", mon: "*", dow: "*" },
		{ name: "Every Sunday at Midnight", min: "0", hr: "0", dom: "*", mon: "*", dow: "0" },
		{ name: "First of Every Month", min: "0", hr: "0", dom: "1", mon: "*", dow: "*" },
		{ name: "Every Weekday at 9 AM", min: "0", hr: "9", dom: "*", mon: "*", dow: "1-5" }
	];

	const applyTemplate = (t) => {
		setMinute(t.min);
		setHour(t.hr);
		setDayOfMonth(t.dom);
		setMonth(t.mon);
		setDayOfWeek(t.dow);
		toast.success(`Template "${t.name}" loaded`);
	};

	const generateCronExpression = () => {
		const expr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
		setExpression(expr);

		// Dynamic Translation explanation
		let desc = "Runs ";

		// Minutes explanation
		if (minute === "*") {
			desc += "every minute ";
		} else if (minute.startsWith("*/")) {
			desc += `every ${minute.split("/")[1]} minutes `;
		} else {
			desc += `at minute ${minute} `;
		}

		// Hours explanation
		if (hour === "*") {
			desc += "of every hour ";
		} else if (hour.startsWith("*/")) {
			desc += `of every ${hour.split("/")[1]} hours `;
		} else {
			desc += `at hour ${hour}:00 `;
		}

		// Day of Month explanation
		if (dayOfMonth === "*") {
			desc += "on every day of the month ";
		} else {
			desc += `on day ${dayOfMonth} of the month `;
		}

		// Months explanation
		if (month === "*") {
			desc += "of every month ";
		} else {
			const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			const mIdx = parseInt(month, 10);
			desc += `in ${months[mIdx - 1] || month} `;
		}

		// Day of Week explanation
		if (dayOfWeek === "*") {
			// standard
		} else if (dayOfWeek === "1-5") {
			desc += "on weekdays (Monday through Friday)";
		} else if (dayOfWeek === "0,6") {
			desc += "on weekends (Saturday and Sunday)";
		} else {
			const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			const dIdx = parseInt(dayOfWeek, 10);
			desc += `on ${days[dIdx] || dayOfWeek}`;
		}

		setDescription(desc.trim());
	};

	useEffect(() => {
		generateCronExpression();
	}, [minute, hour, dayOfMonth, month, dayOfWeek]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(expression);
		setCopied(true);
		toast.success("Cron expression copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Visual Builder */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<ClockIcon className="text-primary w-6 h-6" />
							Cron Schedule Builder
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* Minutes */}
							<div className="space-y-2">
								<label className="text-sm font-bold">Minutes</label>
								<Select value={minute} onValueChange={setMinute}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value="*">Every Minute (*)</SelectItem>
										<SelectItem value="*/5">Every 5 Minutes (*/5)</SelectItem>
										<SelectItem value="*/15">Every 15 Minutes (*/15)</SelectItem>
										<SelectItem value="*/30">Every 30 Minutes (*/30)</SelectItem>
										<SelectItem value="0">At start of hour (0)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Hours */}
							<div className="space-y-2">
								<label className="text-sm font-bold">Hours</label>
								<Select value={hour} onValueChange={setHour}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value="*">Every Hour (*)</SelectItem>
										<SelectItem value="*/2">Every 2 Hours (*/2)</SelectItem>
										<SelectItem value="*/6">Every 6 Hours (*/6)</SelectItem>
										<SelectItem value="0">Midnight (0)</SelectItem>
										<SelectItem value="12">Noon (12)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Day of Month */}
							<div className="space-y-2">
								<label className="text-sm font-bold">Day of Month</label>
								<Select value={dayOfMonth} onValueChange={setDayOfMonth}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value="*">Every Day (*)</SelectItem>
										<SelectItem value="1">1st of Month (1)</SelectItem>
										<SelectItem value="15">15th of Month (15)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Month */}
							<div className="space-y-2">
								<label className="text-sm font-bold">Month</label>
								<Select value={month} onValueChange={setMonth}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value="*">Every Month (*)</SelectItem>
										<SelectItem value="1">January</SelectItem>
										<SelectItem value="6">June</SelectItem>
										<SelectItem value="12">December</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Day of Week */}
							<div className="space-y-2 sm:col-span-2">
								<label className="text-sm font-bold">Day of Week</label>
								<Select value={dayOfWeek} onValueChange={setDayOfWeek}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value="*">Every Day (*)</SelectItem>
										<SelectItem value="1-5">Weekdays only (Mon-Fri)</SelectItem>
										<SelectItem value="0,6">Weekends only (Sat-Sun)</SelectItem>
										<SelectItem value="0">Sunday only</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Expression & Templates */}
				<div className="lg:col-span-5 space-y-8">
					{/* Result */}
					<GlassCard className="p-8 space-y-6">
						<span className="font-bold text-xl block">Expression</span>

						<div className="p-6 bg-muted/10 border border-border/40 rounded-2xl flex items-center justify-between gap-4">
							<span className="font-mono text-2xl font-black text-primary tracking-wide select-all">
								{expression}
							</span>
							<Button size="icon" onClick={copyToClipboard} className="rounded-xl hover:scale-105 active:scale-95 transition-all">
								{copied ? <CheckCircleIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
							</Button>
						</div>

						<div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border/40">
							<HelpCircleIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-bold text-foreground mb-1">Human Readable:</h4>
								<p className="capitalize">{description}</p>
							</div>
						</div>
					</GlassCard>

					{/* Templates */}
					<GlassCard className="p-8">
						<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
							<ZapIcon className="text-amber-500 w-5 h-5 fill-current" />
							Presets & Templates
						</h3>
						<div className="grid grid-cols-1 gap-3">
							{templates.map((t) => (
								<Button
									key={t.name}
									variant="outline"
									onClick={() => applyTemplate(t)}
									className="h-12 justify-start rounded-xl font-medium border-border/40 hover:border-primary/40 hover:bg-primary/[0.02]"
								>
									{t.name}
								</Button>
							))}
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
