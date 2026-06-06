"use client";

import React, { useState } from "react";
import { 
	UserIcon, 
	CopyIcon, 
	CheckCircleIcon,
	DownloadIcon,
	TrashIcon,
	ShuffleIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RandomNameGeneratorTool() {
	const nameData = {
		western: {
			male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald"],
			female: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret"],
			surnames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"],
			locations: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA"]
		},
		indian: {
			male: ["Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Reyansh", "Sai", "Arjun", "Krishna", "Aditya", "Ishaan", "Shaurya", "Atharv", "Pranav", "Aryan"],
			female: ["Aadhya", "Saanvi", "Ananya", "Diya", "Pari", "Pihu", "Khushi", "Aaradhya", "Kiara", "Ira", "Myra", "Avani", "Riya", "Aanya", "Anvi"],
			surnames: ["Sharma", "Verma", "Gupta", "Kumar", "Singh", "Patel", "Reddy", "Mehta", "Joshi", "Rao", "Nair", "Iyer", "Sen", "Das", "Choudhury"],
			locations: ["Mumbai, MH", "Delhi, NCR", "Bangalore, KA", "Hyderabad, TS", "Chennai, TN", "Kolkata, WB", "Pune, MH", "Ahmedabad, GJ"]
		}
	};

	const occupations = [
		"Software Engineer", "Data Scientist", "UI/UX Designer", "Product Manager", "Systems Architect",
		"Marketing Manager", "Financial Analyst", "Content Writer", "HR Specialist", "Operations Manager",
		"Business Analyst", "Network Engineer", "Graphic Designer", "Customer Success Lead", "Sales Executive"
	];

	const [gender, setGender] = useState("random");
	const [origin, setOrigin] = useState("western");
	const [count, setCount] = useState([10]);
	const [includeMeta, setIncludeMeta] = useState(true);
	const [names, setNames] = useState([]);
	const [copied, setCopied] = useState(false);

	const generateNames = () => {
		const region = nameData[origin];
		const results = [];
		const total = count[0];

		for (let i = 0; i < total; i++) {
			let g = gender;
			if (g === "random") {
				g = Math.random() > 0.5 ? "male" : "female";
			}

			const firsts = region[g];
			const lasts = region.surnames;

			const first = firsts[Math.floor(Math.random() * firsts.length)];
			const last = lasts[Math.floor(Math.random() * lasts.length)];
			const name = `${first} ${last}`;

			if (includeMeta) {
				const age = Math.floor(Math.random() * 45) + 21; // 21 to 65
				const occ = occupations[Math.floor(Math.random() * occupations.length)];
				const loc = region.locations[Math.floor(Math.random() * region.locations.length)];
				results.push({ name, age, occ, loc, gender: g });
			} else {
				results.push({ name });
			}
		}

		setNames(results);
	};

	React.useEffect(() => {
		generateNames();
	}, [gender, origin, count, includeMeta]);

	const copyToClipboard = () => {
		if (names.length === 0) return;
		const text = names.map(n => {
			if (includeMeta) {
				return `${n.name} (${n.gender}, Age ${n.age}) - ${n.occ} in ${n.loc}`;
			}
			return n.name;
		}).join("\n");
		
		navigator.clipboard.writeText(text);
		setCopied(true);
		toast.success("Names copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const downloadTxt = () => {
		if (names.length === 0) return;
		const text = names.map(n => {
			if (includeMeta) {
				return `${n.name} | ${n.gender} | Age: ${n.age} | ${n.occ} | ${n.loc}`;
			}
			return n.name;
		}).join("\n");

		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `mock_names_sopkit.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Settings */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<UserIcon className="text-primary w-6 h-6 animate-pulse" />
							Profile Generator Settings
						</h3>

						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-bold">Region/Origin</label>
									<Select value={origin} onValueChange={setOrigin}>
										<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-xl border-border/40">
											<SelectItem value="western" className="rounded-lg">Western / US</SelectItem>
											<SelectItem value="indian" className="rounded-lg">Indian / Asian</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-bold">Gender</label>
									<Select value={gender} onValueChange={setGender}>
										<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-xl border-border/40">
											<SelectItem value="random" className="rounded-lg">Mixed (50/50)</SelectItem>
											<SelectItem value="male" className="rounded-lg">Male Only</SelectItem>
											<SelectItem value="female" className="rounded-lg">Female Only</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex justify-between items-end">
									<label className="text-sm font-bold">Profile Count</label>
									<span className="text-2xl font-black text-primary font-mono">{count[0]}</span>
								</div>
								<Slider
									value={count}
									onValueChange={setCount}
									min={1}
									max={50}
									step={1}
									className="py-2"
								/>
							</div>

							<div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
								<div className="flex flex-col">
									<Label htmlFor="include-meta" className="font-bold text-base">Include Mock Details</Label>
									<span className="text-xs text-muted-foreground">Generates Age, Job, and Location</span>
								</div>
								<Switch 
									id="include-meta" 
									checked={includeMeta} 
									onCheckedChange={setIncludeMeta}
									className="scale-110"
								/>
							</div>

							<Button
								onClick={generateNames}
								className="w-full h-14 rounded-xl font-bold bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								<ShuffleIcon className="w-5 h-5" />
								GENERATE PROFILES
							</Button>
						</div>
					</GlassCard>
				</div>

				{/* Display Output */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full">
						<div className="flex justify-between items-center mb-6">
							<span className="font-bold text-2xl">Mocks</span>
							<Badge variant="secondary" className="px-3 py-1 font-mono">Total: {names.length}</Badge>
						</div>

						<div className="flex-1 min-h-60 max-h-96 overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-4 custom-scrollbar space-y-3">
							{names.map((n, idx) => (
								<div 
									key={idx} 
									className="p-4 rounded-xl border border-border/40 bg-background/30 flex items-start gap-4 transition-all hover:bg-primary/[0.01]"
								>
									<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
										<UserIcon className="w-5 h-5" />
									</div>
									<div className="min-w-0">
										<h4 className="font-bold text-base truncate text-foreground">{n.name}</h4>
										{includeMeta && (
											<p className="text-xs text-muted-foreground mt-1">
												Age: <span className="text-foreground/80 font-medium mr-2">{n.age}</span>
												Job: <span className="text-foreground/80 font-medium mr-2">{n.occ}</span>
												Loc: <span className="text-foreground/80 font-medium">{n.loc}</span>
											</p>
										)}
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 grid grid-cols-2 gap-4">
							<Button
								onClick={copyToClipboard}
								disabled={names.length === 0}
								variant="outline"
								className="h-14 rounded-xl font-bold border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] flex items-center justify-center gap-2"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5 text-emerald-500" />
										COPIED!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5 text-muted-foreground" />
										COPY ALL
									</>
								)}
							</Button>

							<Button
								onClick={downloadTxt}
								disabled={names.length === 0}
								className="h-14 rounded-xl font-bold bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								<DownloadIcon className="w-5 h-5" />
								DOWNLOAD TXT
							</Button>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
