"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Sparkles, RefreshCw, Layers, ShieldCheck, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function CssGlassmorphismGenerator() {
	const [blur, setBlur] = useState<number>(16);
	const [opacity, setOpacity] = useState<number>(25);
	const [saturation, setSaturation] = useState<number>(180);
	const [borderOpacity, setBorderOpacity] = useState<number>(20);
	const [borderRadius, setBorderRadius] = useState<number>(24);
	const [bgColor, setBgColor] = useState<string>("#ffffff");
	const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

	// Convert hex to rgb
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: { r: 255, g: 255, b: 255 };
	};

	const rgb = useMemo(() => hexToRgb(bgColor), [bgColor]);

	const glassCss = useMemo(() => {
		const bgRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
		const borderRgba = `rgba(255, 255, 255, ${borderOpacity / 100})`;
		return `background: ${bgRgba};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${borderRadius}px;
border: 1px solid ${borderRgba};
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);`;
	}, [blur, opacity, saturation, borderOpacity, borderRadius, rgb]);

	const tailwindClasses = useMemo(() => {
		return `bg-white/[0.${opacity}] backdrop-blur-[${blur}px] backdrop-saturate-[${saturation}%] rounded-[${borderRadius}px] border border-white/[0.${borderOpacity}] shadow-xl`;
	}, [blur, opacity, saturation, borderOpacity, borderRadius]);

	const handleCopy = (text: string, format: string) => {
		navigator.clipboard.writeText(text);
		setCopiedFormat(format);
		toast.success(`Copied ${format} to clipboard!`);
		setTimeout(() => setCopiedFormat(null), 2000);
	};

	const resetDefaults = () => {
		setBlur(16);
		setOpacity(25);
		setSaturation(180);
		setBorderOpacity(20);
		setBorderRadius(24);
		setBgColor("#ffffff");
		toast.info("Reset to default glass parameters.");
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Generator: Real-time CSS rendering inside your browser. No styles or data sent to external servers.</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Controls Panel */}
				<div className="lg:col-span-6 space-y-6 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
								<Layers className="h-4 w-4" />
							</div>
							<h3 className="text-base font-bold text-foreground">Glass Settings</h3>
						</div>
						<Button variant="ghost" size="sm" onClick={resetDefaults} className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground">
							<RefreshCw className="h-3.5 w-3.5" />
							Reset
						</Button>
					</div>

					{/* Blur Slider */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="blur-slider">Backdrop Blur</Label>
							<span className="text-blue-600 dark:text-blue-400">{blur}px</span>
						</div>
						<Slider
							id="blur-slider"
							value={[blur]}
							min={0}
							max={40}
							step={1}
							onValueChange={(val) => setBlur(val[0])}
						/>
					</div>

					{/* Background Opacity */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="opacity-slider">Glass Opacity</Label>
							<span className="text-blue-600 dark:text-blue-400">{opacity}%</span>
						</div>
						<Slider
							id="opacity-slider"
							value={[opacity]}
							min={0}
							max={100}
							step={1}
							onValueChange={(val) => setOpacity(val[0])}
						/>
					</div>

					{/* Saturation */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="sat-slider">Backdrop Saturation</Label>
							<span className="text-blue-600 dark:text-blue-400">{saturation}%</span>
						</div>
						<Slider
							id="sat-slider"
							value={[saturation]}
							min={50}
							max={300}
							step={5}
							onValueChange={(val) => setSaturation(val[0])}
						/>
					</div>

					{/* Border Opacity */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="border-slider">Border Outline Opacity</Label>
							<span className="text-blue-600 dark:text-blue-400">{borderOpacity}%</span>
						</div>
						<Slider
							id="border-slider"
							value={[borderOpacity]}
							min={0}
							max={100}
							step={1}
							onValueChange={(val) => setBorderOpacity(val[0])}
						/>
					</div>

					{/* Border Radius */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="radius-slider">Corner Rounding</Label>
							<span className="text-blue-600 dark:text-blue-400">{borderRadius}px</span>
						</div>
						<Slider
							id="radius-slider"
							value={[borderRadius]}
							min={0}
							max={60}
							step={2}
							onValueChange={(val) => setBorderRadius(val[0])}
						/>
					</div>

					{/* Color Tint */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-semibold text-foreground">
							<Label htmlFor="color-picker">Glass Base Color</Label>
							<span className="text-muted-foreground font-mono">{bgColor}</span>
						</div>
						<div className="flex items-center gap-3">
							<input
								id="color-picker"
								type="color"
								value={bgColor}
								onChange={(e) => setBgColor(e.target.value)}
								className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
							/>
							<div className="flex gap-2 flex-wrap">
								{["#ffffff", "#0f172a", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"].map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => setBgColor(c)}
										className="w-7 h-7 rounded-md border border-border/80 transition-transform hover:scale-110"
										style={{ backgroundColor: c }}
										aria-label={`Select color ${c}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Visual Live Preview & Code Outputs */}
				<div className="lg:col-span-6 space-y-6">
					{/* Interactive Playground Canvas */}
					<div className="relative h-64 md:h-72 rounded-2xl overflow-hidden p-6 flex items-center justify-center bg-gradient-to-tr from-violet-600 via-indigo-500 to-pink-500 shadow-inner">
						{/* Background geometric shapes */}
						<div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-amber-400 blur-sm opacity-80 animate-pulse" />
						<div className="absolute bottom-4 right-6 w-32 h-32 rounded-3xl bg-cyan-400 blur-sm opacity-80" />
						<div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-xl bg-emerald-400 blur-sm opacity-70" />

						{/* Live Glass Element */}
						<div
							className="relative z-10 w-full max-w-sm p-6 text-center space-y-2 transition-all duration-200"
							style={{
								backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`,
								backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
								WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
								borderRadius: `${borderRadius}px`,
								border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
								boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
							}}
						>
							<div className="w-10 h-10 rounded-full bg-white/20 inline-flex items-center justify-center text-white mx-auto shadow-sm">
								<Sparkles className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-white text-base drop-shadow-sm">Frosted Glass</h4>
							<p className="text-xs text-white/90 leading-relaxed drop-shadow-sm">
								Ultra-modern frosted glass surface with hardware-accelerated blur.
							</p>
						</div>
					</div>

					{/* Generated CSS Snippet */}
					<div className="space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Standard CSS</h4>
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleCopy(glassCss, "CSS")}
								className="h-7 text-xs gap-1.5 rounded-lg border-border/60 hover:border-blue-500/40"
							>
								{copiedFormat === "CSS" ? (
									<>
										<Check className="h-3.5 w-3.5 text-emerald-500" />
										<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5" />
										<span>Copy CSS</span>
									</>
								)}
							</Button>
						</div>
						<pre className="p-3.5 rounded-xl bg-muted/50 border border-border/40 font-mono text-[11px] leading-relaxed text-foreground overflow-x-auto">
							{glassCss}
						</pre>
					</div>

					{/* Tailwind CSS Classes */}
					<div className="space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Tailwind CSS</h4>
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleCopy(tailwindClasses, "Tailwind")}
								className="h-7 text-xs gap-1.5 rounded-lg border-border/60 hover:border-blue-500/40"
							>
								{copiedFormat === "Tailwind" ? (
									<>
										<Check className="h-3.5 w-3.5 text-emerald-500" />
										<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5" />
										<span>Copy Classes</span>
									</>
								)}
							</Button>
						</div>
						<pre className="p-3.5 rounded-xl bg-muted/50 border border-border/40 font-mono text-[11px] leading-relaxed text-foreground overflow-x-auto whitespace-pre-wrap">
							{tailwindClasses}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
