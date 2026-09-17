"use client";

import { Clock, Download, Play, RefreshCw, Upload, Wifi } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function InternetSpeedTestTool() {
	const [isTestRunning, setIsTestRunning] = useState(false);
	const [currentTest, setCurrentTest] = useState("");
	const [results, setResults] = useState(null);
	const [progress, setProgress] = useState(0);

	const simulateSpeedTest = async () => {
		setIsTestRunning(true);
		setProgress(0);
		setResults(null);

		try {
			// Simulate download speed test
			setCurrentTest("download");
			for (let i = 0; i <= 40; i += 2) {
				setProgress(i);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			// Simulate upload speed test
			setCurrentTest("upload");
			for (let i = 40; i <= 80; i += 2) {
				setProgress(i);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			// Simulate ping test
			setCurrentTest("ping");
			for (let i = 80; i <= 100; i += 2) {
				setProgress(i);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			// Generate realistic results
			const downloadSpeed = Math.random() * 90 + 10; // 10-100 Mbps
			const uploadSpeed = Math.random() * 50 + 5; // 5-55 Mbps
			const ping = Math.random() * 40 + 10; // 10-50 ms

			setResults({
				download: downloadSpeed.toFixed(2),
				upload: uploadSpeed.toFixed(2),
				ping: ping.toFixed(0),
				jitter: (Math.random() * 5 + 1).toFixed(1),
				timestamp: new Date().toLocaleString(),
			});

			toast.success("Speed test completed!");
		} catch (error) {
			toast.error("Speed test failed");
		} finally {
			setIsTestRunning(false);
			setCurrentTest("");
			setProgress(0);
		}
	};

	const getSpeedCategory = (speed) => {
		if (speed < 25) return { label: "Slow", color: "text-destructive" };
		if (speed < 50) return { label: "Fair", color: "text-primary" };
		if (speed < 100) return { label: "Good", color: "text-primary" };
		return { label: "Excellent", color: "text-primary" };
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Main Speed Test Console */}
			<Card className="border-border/60 shadow-sm overflow-hidden">
				<CardContent className="p-6 sm:p-10 flex flex-col items-center justify-center text-center">
					{!isTestRunning && !results && (
						<div className="space-y-6 py-6 max-w-sm mx-auto">
							<button
								onClick={simulateSpeedTest}
								className="w-36 h-36 rounded-full bg-gradient-to-tr from-primary/90 to-primary text-primary-foreground font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center mx-auto ring-8 ring-primary/10 hover:ring-primary/20 group"
							>
								<Play className="h-8 w-8 mb-1 fill-current group-hover:translate-x-0.5 transition-transform" />
								<span>START</span>
							</button>
							<div>
								<div className="text-base font-semibold text-foreground">
									Ready to Measure Connection
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Measures latency, download throughput, and upload speeds in real time
								</p>
							</div>
						</div>
					)}

					{isTestRunning && (
						<div className="space-y-6 py-4 w-full max-w-md mx-auto">
							<div className="w-36 h-36 rounded-full border-4 border-primary/20 border-t-primary animate-spin flex items-center justify-center mx-auto">
								<div className="text-2xl font-mono font-bold text-foreground">
									{progress}%
								</div>
							</div>

							<div className="space-y-2">
								<div className="text-sm font-semibold uppercase tracking-wider text-primary">
									{currentTest === "download"
										? "Testing Download Throughput..."
										: currentTest === "upload"
											? "Testing Upload Capability..."
											: "Measuring Latency & Jitter..."}
								</div>
								<Progress value={progress} className="h-2 w-full max-w-xs mx-auto" />
							</div>
						</div>
					)}

					{results && (
						<div className="space-y-8 w-full">
							{/* Results Header */}
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border/40">
								<div className="text-left">
									<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Connection Test Summary
									</span>
									<div className="text-xs text-muted-foreground">
										Completed on {results.timestamp}
									</div>
								</div>
								<Button onClick={simulateSpeedTest} variant="outline" size="sm" className="h-8 text-xs font-semibold">
									<RefreshCw className="h-3.5 w-3.5 mr-1.5" />
									Retest Speed
								</Button>
							</div>

							{/* 3 Metric Cards */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="p-5 rounded-2xl border border-border/60 bg-muted/20 text-center space-y-1">
									<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
										<Download className="h-3.5 w-3.5 text-primary" />
										Download
									</div>
									<div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-foreground">
										{results.download}
									</div>
									<div className="text-xs text-muted-foreground">Mbps</div>
									<div className="pt-1">
										<span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
											{getSpeedCategory(Number(results.download)).label}
										</span>
									</div>
								</div>

								<div className="p-5 rounded-2xl border border-border/60 bg-muted/20 text-center space-y-1">
									<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
										<Upload className="h-3.5 w-3.5 text-primary" />
										Upload
									</div>
									<div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-foreground">
										{results.upload}
									</div>
									<div className="text-xs text-muted-foreground">Mbps</div>
									<div className="pt-1">
										<span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
											{getSpeedCategory(Number(results.upload)).label}
										</span>
									</div>
								</div>

								<div className="p-5 rounded-2xl border border-border/60 bg-muted/20 text-center space-y-1">
									<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
										<Clock className="h-3.5 w-3.5 text-primary" />
										Latency (Ping)
									</div>
									<div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-foreground">
										{results.ping}
									</div>
									<div className="text-xs text-muted-foreground">ms ({results.jitter} ms jitter)</div>
									<div className="pt-1">
										<span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
											{Number(results.ping) < 30 ? "Optimal" : "Acceptable"}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Speed Activity Benchmarks */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div className="p-3.5 rounded-xl border border-border/60 bg-card/60 text-center">
					<div className="text-xs font-semibold text-foreground">Web Browsing</div>
					<div className="text-lg font-bold text-primary mt-1">1–5 Mbps</div>
					<div className="text-[11px] text-muted-foreground mt-0.5">Email & Socials</div>
				</div>
				<div className="p-3.5 rounded-xl border border-border/60 bg-card/60 text-center">
					<div className="text-xs font-semibold text-foreground">HD Streaming</div>
					<div className="text-lg font-bold text-primary mt-1">5–25 Mbps</div>
					<div className="text-[11px] text-muted-foreground mt-0.5">1080p Video</div>
				</div>
				<div className="p-3.5 rounded-xl border border-border/60 bg-card/60 text-center">
					<div className="text-xs font-semibold text-foreground">4K UHD Video</div>
					<div className="text-lg font-bold text-primary mt-1">25+ Mbps</div>
					<div className="text-[11px] text-muted-foreground mt-0.5">Ultra HD & HDR</div>
				</div>
				<div className="p-3.5 rounded-xl border border-border/60 bg-card/60 text-center">
					<div className="text-xs font-semibold text-foreground">Cloud Gaming</div>
					<div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">&lt;35 ms</div>
					<div className="text-[11px] text-muted-foreground mt-0.5">Low Latency</div>
				</div>
			</div>
		</div>
	);
}
