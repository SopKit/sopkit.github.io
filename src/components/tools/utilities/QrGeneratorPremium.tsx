"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { CornerDotType, CornerSquareType, DotType, Options } from "qr-code-styling";
import {
	Copy,
	Download,
	Image as ImageIcon,
	Loader2,
	Palette,
	RefreshCw,
	Shapes,
	ShieldCheck,
	Sparkles,
	Type,
	Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	ToolDropzone,
	ToolField,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolModeTabs,
	ToolPanel,
	ToolPreviewFrame,
	ToolPrivacyNote,
	ToolSectionTitle,
	ToolShell,
} from "@/components/tools/shared/design-system";
import { SITE_URL } from "@/constants/config";

type QrMode = "link" | "text" | "wifi" | "email" | "contact";

interface CutePreset {
	id: string;
	label: string;
	emoji: string;
	swatch: string;
	dotType: DotType;
	cornerSquareType: CornerSquareType;
	cornerDotType: CornerDotType;
	useGradient: boolean;
	color1: string;
	color2: string;
	bgColor: string;
}

const PRESETS: CutePreset[] = [
	{
		id: "classic",
		label: "Classic",
		emoji: "🔳",
		swatch: "linear-gradient(135deg,#111827 0 50%,#ffffff 50% 100%)",
		dotType: "square",
		cornerSquareType: "square",
		cornerDotType: "square",
		useGradient: false,
		color1: "#111827",
		color2: "#111827",
		bgColor: "#ffffff",
	},
	{
		id: "bubblegum",
		label: "Bubblegum",
		emoji: "🍬",
		swatch: "linear-gradient(135deg,#ec4899,#a855f7)",
		dotType: "dots",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#ec4899",
		color2: "#a855f7",
		bgColor: "#ffffff",
	},
	{
		id: "mint",
		label: "Minty",
		emoji: "🌿",
		swatch: "linear-gradient(135deg,#10b981,#14b8a6)",
		dotType: "rounded",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#10b981",
		color2: "#14b8a6",
		bgColor: "#ffffff",
	},
	{
		id: "sunset",
		label: "Sunset",
		emoji: "🌅",
		swatch: "linear-gradient(135deg,#f97316,#ef4444)",
		dotType: "classy-rounded",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#f97316",
		color2: "#ef4444",
		bgColor: "#fff7ed",
	},
	{
		id: "ocean",
		label: "Ocean",
		emoji: "🌊",
		swatch: "linear-gradient(135deg,#3b82f6,#06b6d4)",
		dotType: "extra-rounded",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#3b82f6",
		color2: "#06b6d4",
		bgColor: "#f0f9ff",
	},
	{
		id: "grape",
		label: "Grape",
		emoji: "🍇",
		swatch: "linear-gradient(135deg,#8b5cf6,#6366f1)",
		dotType: "classy",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#8b5cf6",
		color2: "#6366f1",
		bgColor: "#faf5ff",
	},
	{
		id: "candy",
		label: "Candy",
		emoji: "🧁",
		swatch: "linear-gradient(135deg,#f472b6,#fb7185)",
		dotType: "classy-rounded",
		cornerSquareType: "extra-rounded",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#f472b6",
		color2: "#fb7185",
		bgColor: "#fdf2f8",
	},
	{
		id: "midnight",
		label: "Midnight",
		emoji: "🌙",
		swatch: "linear-gradient(135deg,#0f172a,#a5b4fc)",
		dotType: "rounded",
		cornerSquareType: "dot",
		cornerDotType: "dot",
		useGradient: true,
		color1: "#e2e8f0",
		color2: "#a5b4fc",
		bgColor: "#0f172a",
	},
];

const EMOJI_LOGOS = ["", "❤️", "⭐", "😊", "🌸", "🐱", "🍕", "🚀", "🎁"];

const DOT_TYPES: { value: DotType; label: string }[] = [
	{ value: "square", label: "Square" },
	{ value: "rounded", label: "Rounded" },
	{ value: "dots", label: "Dots" },
	{ value: "classy", label: "Classy" },
	{ value: "classy-rounded", label: "Classy rounded" },
	{ value: "extra-rounded", label: "Extra rounded" },
];

const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
	{ value: "square", label: "Square" },
	{ value: "extra-rounded", label: "Rounded" },
	{ value: "dot", label: "Dot" },
];

const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
	{ value: "square", label: "Square" },
	{ value: "dot", label: "Dot" },
];

/** Emoji -> transparent PNG data URL so it can be embedded as the QR logo. */
function emojiToDataUrl(emoji: string): string {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";
	ctx.clearRect(0, 0, 128, 128);
	ctx.font =
		"96px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(emoji, 64, 72);
	return canvas.toDataURL("image/png");
}

function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

function escapeWifi(value: string): string {
	return value.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrGeneratorPremium({
	initialText = SITE_URL,
}: {
	initialText?: string;
}) {
	const [mode, setMode] = useState<QrMode>("link");

	// Content fields
	const [linkValue, setLinkValue] = useState(initialText);
	const [textValue, setTextValue] = useState("Hello from SopKit ✨");
	const [wifiSsid, setWifiSsid] = useState("Guest_WiFi");
	const [wifiPassword, setWifiPassword] = useState("password123");
	const [wifiSecurity, setWifiSecurity] = useState("WPA");
	const [wifiHidden, setWifiHidden] = useState(false);
	const [emailTo, setEmailTo] = useState("");
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [contactName, setContactName] = useState("");
	const [contactPhone, setContactPhone] = useState("");
	const [contactEmail, setContactEmail] = useState("");
	const [contactOrg, setContactOrg] = useState("");
	const [contactUrl, setContactUrl] = useState("");

	// Style state
	const [presetId, setPresetId] = useState<string>("bubblegum");
	const [dotType, setDotType] = useState<DotType>("dots");
	const [cornerSquareType, setCornerSquareType] =
		useState<CornerSquareType>("extra-rounded");
	const [cornerDotType, setCornerDotType] = useState<CornerDotType>("dot");
	const [useGradient, setUseGradient] = useState(true);
	const [color1, setColor1] = useState("#ec4899");
	const [color2, setColor2] = useState("#a855f7");
	const [gradientRotation, setGradientRotation] = useState(45);
	const [bgColor, setBgColor] = useState("#ffffff");
	const [logo, setLogo] = useState("");
	const [logoChoice, setLogoChoice] = useState("");

	// Output settings
	const [size, setSize] = useState("512");
	const [margin, setMargin] = useState(8);
	const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("Q");

	const [engineReady, setEngineReady] = useState(false);
	const [loadError, setLoadError] = useState("");

	const qrRef = useRef<QRCodeStyling | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const data = useMemo(() => {
		switch (mode) {
			case "link":
				return linkValue.trim();
			case "text":
				return textValue;
			case "wifi":
				return `WIFI:T:${wifiSecurity};S:${escapeWifi(wifiSsid)};P:${escapeWifi(
					wifiPassword,
				)};H:${wifiHidden ? "true" : "false"};;`;
			case "email":
				return `mailto:${emailTo}?subject=${encodeURIComponent(
					emailSubject,
				)}&body=${encodeURIComponent(emailBody)}`;
			case "contact":
				return [
					"BEGIN:VCARD",
					"VERSION:3.0",
					`FN:${contactName}`,
					`TEL:${contactPhone}`,
					`EMAIL:${contactEmail}`,
					`ORG:${contactOrg}`,
					`URL:${contactUrl}`,
					"END:VCARD",
				].join("\n");
			default:
				return linkValue.trim();
		}
	}, [
		mode,
		linkValue,
		textValue,
		wifiSecurity,
		wifiSsid,
		wifiPassword,
		wifiHidden,
		emailTo,
		emailSubject,
		emailBody,
		contactName,
		contactPhone,
		contactEmail,
		contactOrg,
		contactUrl,
	]);

	const options = useMemo<Partial<Options>>(() => {
		const cornerColor = useGradient ? color2 : color1;
		const sizePx = Number(size);
		return {
			type: "canvas",
			width: sizePx,
			height: sizePx,
			data,
			margin,
			image: logo || undefined,
			imageOptions: {
				hideBackgroundDots: true,
				imageSize: 0.35,
				margin: 6,
			},
			qrOptions: { errorCorrectionLevel: errorCorrection },
			dotsOptions: useGradient
				? {
						type: dotType,
						gradient: {
							type: "linear",
							rotation: (gradientRotation * Math.PI) / 180,
							colorStops: [
								{ offset: 0, color: color1 },
								{ offset: 1, color: color2 },
							],
						},
					}
				: { type: dotType, color: color1 },
			cornersSquareOptions: { type: cornerSquareType, color: cornerColor },
			cornersDotOptions: { type: cornerDotType, color: cornerColor },
			backgroundOptions: { color: bgColor },
		};
	}, [
		data,
		size,
		margin,
		logo,
		errorCorrection,
		dotType,
		useGradient,
		gradientRotation,
		color1,
		color2,
		cornerSquareType,
		cornerDotType,
		bgColor,
	]);

	// Load the styling engine once, on demand (kept out of the initial bundle).
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const mod = await import("qr-code-styling");
				const Engine = mod.default;
				if (cancelled || !containerRef.current) return;
				const instance = new Engine({
					type: "canvas",
					width: 512,
					height: 512,
					data: SITE_URL,
					margin: 8,
				});
				instance.append(containerRef.current);
				qrRef.current = instance;
				setEngineReady(true);
			} catch (error) {
				console.error("Failed to load QR engine", error);
				if (!cancelled) {
					setLoadError("Could not load the QR engine. Check your connection and retry.");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	// Re-render whenever the content or style changes. Empty content clears the preview.
	useEffect(() => {
		if (!engineReady) return;
		qrRef.current?.update(options);
	}, [engineReady, options]);

	const applyPreset = useCallback((preset: CutePreset) => {
		setPresetId(preset.id);
		setDotType(preset.dotType);
		setCornerSquareType(preset.cornerSquareType);
		setCornerDotType(preset.cornerDotType);
		setUseGradient(preset.useGradient);
		setColor1(preset.color1);
		setColor2(preset.color2);
		setBgColor(preset.bgColor);
	}, []);

	const surpriseMe = useCallback(() => {
		const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
		applyPreset(preset);
		setGradientRotation(Math.floor(Math.random() * 360));
		const emoji = EMOJI_LOGOS[Math.floor(Math.random() * EMOJI_LOGOS.length)];
		setLogoChoice(emoji);
		setLogo(emoji ? emojiToDataUrl(emoji) : "");
	}, [applyPreset]);

	const handleLogoFile = useCallback(async (files: File[]) => {
		const file = files[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image file.");
			return;
		}
		try {
			const url = await readFileAsDataUrl(file);
			setLogo(url);
			setLogoChoice("custom");
		} catch {
			toast.error("Could not read that image.");
		}
	}, []);

	const download = useCallback(
		async (extension: "png" | "svg") => {
			const qr = qrRef.current;
			if (!qr) {
				toast.error("QR engine is still loading.");
				return;
			}
			if (!data.trim()) {
				toast.error("Add some content first.");
				return;
			}
			try {
				await qr.download({ name: `sopkit-qr-${mode}`, extension });
				toast.success(`Downloaded as ${extension.toUpperCase()}`);
			} catch (error) {
				console.error(error);
				toast.error("Export failed. Try PNG instead.");
			}
		},
		[data, mode],
	);

	const copyImage = useCallback(async () => {
		const qr = qrRef.current;
		if (!qr || typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
			toast.error("Image copy is not supported in this browser.");
			return;
		}
		try {
			const blob = await qr.getRawData("png");
			if (!(blob instanceof Blob)) throw new Error("No image data");
			await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
			toast.success("QR image copied to clipboard");
		} catch (error) {
			console.error(error);
			toast.error("Could not copy the image.");
		}
	}, []);

	const contentFields = () => {
		switch (mode) {
			case "link":
				return (
					<ToolField
						label="Website or link URL"
						value={linkValue}
						onChange={(event) => setLinkValue(event.target.value)}
						placeholder="https://example.com"
					/>
				);
			case "text":
				return (
					<ToolField label="Text content" fieldId="qr-text">
						<Textarea
							id="qr-text"
							value={textValue}
							onChange={(event) => setTextValue(event.target.value)}
							placeholder="Type anything you like..."
							rows={4}
						/>
					</ToolField>
				);
			case "wifi":
				return (
					<>
						<ToolField
							label="Network name (SSID)"
							value={wifiSsid}
							onChange={(event) => setWifiSsid(event.target.value)}
							placeholder="MyWiFiNetwork"
						/>
						<ToolField
							label="Password"
							type="password"
							value={wifiPassword}
							onChange={(event) => setWifiPassword(event.target.value)}
							placeholder="password123"
						/>
						<ToolField label="Security" fieldId="qr-wifi-security">
							<Select value={wifiSecurity} onValueChange={setWifiSecurity}>
								<SelectTrigger id="qr-wifi-security">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="WPA">WPA/WPA2</SelectItem>
									<SelectItem value="WEP">WEP</SelectItem>
									<SelectItem value="nopass">No password</SelectItem>
								</SelectContent>
							</Select>
						</ToolField>
						<div className="flex items-center justify-between">
							<Label htmlFor="qr-wifi-hidden">Hidden network</Label>
							<Switch
								id="qr-wifi-hidden"
								checked={wifiHidden}
								onCheckedChange={setWifiHidden}
							/>
						</div>
					</>
				);
			case "email":
				return (
					<>
						<ToolField
							label="Recipient email"
							type="email"
							value={emailTo}
							onChange={(event) => setEmailTo(event.target.value)}
							placeholder="hello@example.com"
						/>
						<ToolField
							label="Subject"
							value={emailSubject}
							onChange={(event) => setEmailSubject(event.target.value)}
							placeholder="Quick question"
						/>
						<ToolField label="Message" fieldId="qr-email-body">
							<Textarea
								id="qr-email-body"
								value={emailBody}
								onChange={(event) => setEmailBody(event.target.value)}
								placeholder="Message body..."
								rows={3}
							/>
						</ToolField>
					</>
				);
			case "contact":
				return (
					<>
						<ToolField
							label="Full name"
							value={contactName}
							onChange={(event) => setContactName(event.target.value)}
							placeholder="Jane Doe"
						/>
						<ToolField
							label="Phone"
							value={contactPhone}
							onChange={(event) => setContactPhone(event.target.value)}
							placeholder="+1 555 010 2030"
						/>
						<ToolField
							label="Email"
							type="email"
							value={contactEmail}
							onChange={(event) => setContactEmail(event.target.value)}
							placeholder="jane@example.com"
						/>
						<ToolField
							label="Organisation"
							value={contactOrg}
							onChange={(event) => setContactOrg(event.target.value)}
							placeholder="Acme Inc."
						/>
						<ToolField
							label="Website"
							value={contactUrl}
							onChange={(event) => setContactUrl(event.target.value)}
							placeholder="https://example.com"
						/>
					</>
				);
			default:
				return null;
		}
	};

	const previewBg = useGradient
		? `linear-gradient(135deg, ${color1}22, ${color2}22)`
		: `${color1}14`;

	return (
		<ToolShell>
			<ToolModeTabs
				ariaLabel="QR content type"
				value={mode}
				onChange={(value) => setMode(value as QrMode)}
				tabs={[
					{ value: "link", label: "Link" },
					{ value: "text", label: "Text" },
					{ value: "wifi", label: "Wi-Fi" },
					{ value: "email", label: "Email" },
					{ value: "contact", label: "Contact" },
				]}
			/>

			<ToolGrid>
				<ToolGridMain>
					<ToolPanel>
						<ToolSectionTitle icon={<Type className="h-3.5 w-3.5" />} title="Content" />
						<div className="space-y-4">{contentFields()}</div>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle
							icon={<Sparkles className="h-3.5 w-3.5" />}
							title="Cute styles"
							description="Pick a vibe, then fine-tune it below."
						/>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
							{PRESETS.map((preset) => {
								const active = presetId === preset.id;
								return (
									<button
										key={preset.id}
										type="button"
										onClick={() => applyPreset(preset)}
										aria-pressed={active}
										className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
											active
												? "border-primary bg-primary/5 text-foreground shadow-xs"
												: "border-border/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
										}`}
									>
										<span
											aria-hidden
											className="h-7 w-7 rounded-full border border-black/5 shadow-inner"
											style={{ background: preset.swatch }}
										/>
										<span>
											{preset.emoji} {preset.label}
										</span>
									</button>
								);
							})}
						</div>
						<Button variant="outline" size="sm" className="gap-2" onClick={surpriseMe}>
							<RefreshCw className="h-4 w-4" /> Surprise me
						</Button>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle icon={<Shapes className="h-3.5 w-3.5" />} title="Shape" />
						<div className="grid sm:grid-cols-3 gap-4">
							<ToolField label="Dot style" fieldId="qr-dot-type">
								<Select
									value={dotType}
									onValueChange={(value) => {
										setDotType(value as DotType);
										setPresetId("");
									}}
								>
									<SelectTrigger id="qr-dot-type">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DOT_TYPES.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField label="Corner frame" fieldId="qr-corner-square">
								<Select
									value={cornerSquareType}
									onValueChange={(value) => {
										setCornerSquareType(value as CornerSquareType);
										setPresetId("");
									}}
								>
									<SelectTrigger id="qr-corner-square">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CORNER_SQUARE_TYPES.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField label="Corner dot" fieldId="qr-corner-dot">
								<Select
									value={cornerDotType}
									onValueChange={(value) => {
										setCornerDotType(value as CornerDotType);
										setPresetId("");
									}}
								>
									<SelectTrigger id="qr-corner-dot">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CORNER_DOT_TYPES.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</ToolField>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="qr-gradient">Colour gradient</Label>
							<Switch
								id="qr-gradient"
								checked={useGradient}
								onCheckedChange={(checked) => {
									setUseGradient(checked);
									setPresetId("");
								}}
							/>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
							<ToolField label={useGradient ? "Gradient from" : "QR colour"} fieldId="qr-color-1">
								<div className="flex gap-2">
									<Input
										type="color"
										value={color1}
										onChange={(event) => {
											setColor1(event.target.value);
											setPresetId("");
										}}
										className="w-12 h-9 p-1 rounded-lg"
										aria-label="Primary colour"
									/>
									<Input
										id="qr-color-1"
										value={color1}
										onChange={(event) => setColor1(event.target.value)}
										className="flex-1 font-mono uppercase h-9"
									/>
								</div>
							</ToolField>

							{useGradient && (
								<ToolField label="Gradient to" fieldId="qr-color-2">
									<div className="flex gap-2">
										<Input
											type="color"
											value={color2}
											onChange={(event) => {
												setColor2(event.target.value);
												setPresetId("");
											}}
											className="w-12 h-9 p-1 rounded-lg"
											aria-label="Secondary colour"
										/>
										<Input
											id="qr-color-2"
											value={color2}
											onChange={(event) => setColor2(event.target.value)}
											className="flex-1 font-mono uppercase h-9"
										/>
									</div>
								</ToolField>
							)}

							<ToolField label="Background" fieldId="qr-bg">
								<div className="flex gap-2">
									<Input
										type="color"
										value={bgColor}
										onChange={(event) => {
											setBgColor(event.target.value);
											setPresetId("");
										}}
										className="w-12 h-9 p-1 rounded-lg"
										aria-label="Background colour"
									/>
									<Input
										id="qr-bg"
										value={bgColor}
										onChange={(event) => setBgColor(event.target.value)}
										className="flex-1 font-mono uppercase h-9"
									/>
								</div>
							</ToolField>

							{useGradient && (
								<div className="space-y-2 sm:col-span-2">
									<Label className="text-xs text-muted-foreground">
										Gradient angle: {gradientRotation}°
									</Label>
									<Slider
										value={[gradientRotation]}
										onValueChange={(value) => setGradientRotation(value[0] ?? 0)}
										min={0}
										max={359}
										step={1}
										aria-label="Gradient angle"
									/>
								</div>
							)}
						</div>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle
							icon={<ImageIcon className="h-3.5 w-3.5" />}
							title="Center logo"
							description="A small logo makes it cute — keep error correction high for scannability."
						/>
						<div className="flex flex-wrap gap-2">
							{EMOJI_LOGOS.map((emoji) => {
								const active = logoChoice === emoji;
								return (
									<button
										key={emoji || "none"}
										type="button"
										onClick={() => {
											setLogoChoice(emoji);
											setLogo(emoji ? emojiToDataUrl(emoji) : "");
										}}
										aria-pressed={active}
										aria-label={emoji ? `Use ${emoji} logo` : "No logo"}
										className={`h-10 w-10 rounded-xl border text-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
											active
												? "border-primary bg-primary/5 shadow-xs"
												: "border-border/70 hover:border-foreground/30"
										}`}
									>
										{emoji || "🚫"}
									</button>
								);
							})}
						</div>
						<ToolDropzone
							title="Drop your own logo"
							subtitle="PNG, JPG or SVG — square images work best"
							accept="image/*"
							onFiles={(files) => void handleLogoFile(files)}
							icon={<Upload className="h-6 w-6 text-foreground" />}
							className="p-4 md:p-5"
						/>
					</ToolPanel>

					<ToolPanel>
						<ToolSectionTitle icon={<Palette className="h-3.5 w-3.5" />} title="Output" />
						<div className="grid sm:grid-cols-3 gap-4">
							<ToolField label="Export size" fieldId="qr-size">
								<Select value={size} onValueChange={setSize}>
									<SelectTrigger id="qr-size">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="256">256 px</SelectItem>
										<SelectItem value="512">512 px</SelectItem>
										<SelectItem value="1024">1024 px</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField label="Error correction" fieldId="qr-ecc">
								<Select
									value={errorCorrection}
									onValueChange={(value) =>
										setErrorCorrection(value as "L" | "M" | "Q" | "H")
									}
								>
									<SelectTrigger id="qr-ecc">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="L">Low (7%)</SelectItem>
										<SelectItem value="M">Medium (15%)</SelectItem>
										<SelectItem value="Q">Quartile (25%)</SelectItem>
										<SelectItem value="H">High (30%) — best with logo</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField
								label={`Quiet zone: ${margin}px`}
								fieldId="qr-margin"
								type="number"
								min={0}
								max={40}
								value={margin}
								onChange={(event) =>
									setMargin(Math.max(0, Math.min(40, Number(event.target.value) || 0)))
								}
							/>
						</div>
					</ToolPanel>
				</ToolGridMain>

				<ToolGridSide>
					<ToolPanel className="sticky top-24">
						<ToolSectionTitle icon={<Sparkles className="h-3.5 w-3.5" />} title="Live preview" />
						<ToolPreviewFrame
							className="flex items-center justify-center min-h-[280px]"
							style={{ background: previewBg }}
						>
							{loadError ? (
								<div className="p-4 text-center space-y-3">
									<p className="text-sm text-muted-foreground">{loadError}</p>
									<Button size="sm" variant="outline" onClick={() => window.location.reload()}>
										Retry
									</Button>
								</div>
							) : (
								<div
									ref={containerRef}
									className="w-full max-w-[260px] overflow-hidden rounded-xl [&_canvas]:w-full [&_canvas]:h-auto [&_svg]:w-full [&_svg]:h-auto"
									style={{ display: engineReady ? "block" : "none" }}
								/>
							)}
							{!engineReady && !loadError && (
								<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<Loader2 className="h-7 w-7 animate-spin text-primary/60" />
									<span className="text-xs">Loading QR engine…</span>
								</div>
							)}
						</ToolPreviewFrame>

						<div className="grid grid-cols-2 gap-2">
							<Button className="gap-2" onClick={() => void download("png")} disabled={!engineReady}>
								<Download className="h-4 w-4" /> PNG
							</Button>
							<Button
								variant="outline"
								className="gap-2"
								onClick={() => void download("svg")}
								disabled={!engineReady}
							>
								<ImageIcon className="h-4 w-4" /> SVG
							</Button>
							<Button
								variant="ghost"
								className="col-span-2 gap-2"
								onClick={() => void copyImage()}
								disabled={!engineReady}
							>
								<Copy className="h-4 w-4" /> Copy image
							</Button>
						</div>

						<div className="space-y-2 text-xs text-muted-foreground">
							<ToolPrivacyNote>
								Generated entirely in your browser — nothing is uploaded.
							</ToolPrivacyNote>
							<p className="flex items-center gap-1.5">
								<ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
								Test-scan before printing. Busy backgrounds can reduce contrast.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
