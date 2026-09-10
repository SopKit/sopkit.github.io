"use client";

import html2canvas from "html2canvas";
import {
	Anchor,
	Briefcase,
	Coffee,
	Code2,
	Download,
	FileJson,
	Flame,
	Github,
	Globe,
	Heart,
	Hexagon,
	Highlighter,
	ImageIcon,
	Lightbulb,
	LineChart,
	Loader2,
	Lock,
	Mail,
	Moon,
	Plug,
	RefreshCcw,
	Rocket,
	Save,
	Settings2,
	Smartphone,
	Star,
	Sun,
	Tag,
	Twitter,
	Undo2,
	User,
	Zap,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Layout = "left" | "top" | "right" | "stack" | "around";
type Weight = "normal" | "medium" | "semibold" | "bold";
type Transform = "none" | "uppercase" | "lowercase" | "capitalize";
type BackgroundType = "solid" | "gradientLinear" | "gradientRadial" | "grid" | "dots" | "stripes";
type ExportKind = "png" | "svg";

type HistoryState = {
	text: string;
	tagline: string;
	font: string;
	iconId: string;
	layout: Layout;
	textColor: string;
	iconColor: string;
	backgroundColor: string;
	backgroundType: BackgroundType;
	fontSize: number;
	iconSize: number;
	gap: number;
	fontWeight: Weight;
	textTransform: Transform;
	letterSpacing: number;
	lineHeight: number;
	padding: number;
	textShadow: string;
	textStroke: string;
	iconShadow: string;
	borderRadius: number;
	align: "left" | "center" | "right";
	exportKind: ExportKind;
	name: string;
};

type Preset = {
	id: string;
	name: string;
	state: HistoryState;
};

const FONTS = [
	{ id: "inter", label: "Inter (Modern)", family: "Inter, sans-serif" },
	{ id: "serif", label: "Serif (Classic)", family: "serif" },
	{ id: "mono", label: "Monospace (Tech)", family: "monospace" },
	{ id: "cursive", label: "Cursive (Creative)", family: "cursive" },
	{ id: "fantasy", label: "Fantasy (Bold)", family: "fantasy" },
	{ id: "geist", label: "Geist", family: "Geist, system-ui, sans-serif" },
	{ id: "system-ui", label: "System UI", family: "system-ui, sans-serif" },
];

const ICONS = [
	{ id: "rocket", label: "Rocket", icon: Rocket as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "zap", label: "Lightning", icon: Zap as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "star", label: "Star", icon: Star as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "heart", label: "Heart", icon: Heart as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "globe", label: "Globe", icon: Globe as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "briefcase", label: "Briefcase", icon: Briefcase as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "coffee", label: "Coffee", icon: Coffee as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "code", label: "Code", icon: Code2 as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "music", label: "Music", icon: Code2 as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "camera", label: "Camera", icon: ImageIcon as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "smile", label: "Emoji", icon: Smartphone as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "sun", label: "Sun", icon: Sun as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "moon", label: "Moon", icon: Moon as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "cloud", label: "Cloud", icon: ImageIcon as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "droplet", label: "Drop", icon: Flame as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "flame", label: "Flame", icon: Flame as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "anchor", label: "Anchor", icon: Anchor as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "feather", label: "Feather", icon: LineChart as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "key", label: "Key", icon: Lock as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "lock", label: "Lock", icon: Lock as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "mail", label: "Mail", icon: Mail as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "user", label: "User", icon: User as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "tag", label: "Tag", icon: Tag as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "plugin", label: "Plugin", icon: Plug as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "settings", label: "Settings", icon: Settings2 as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "highlighter", label: "Highlight", icon: Highlighter as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "lightbulb", label: "Idea", icon: Lightbulb as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "shape", label: "Hexagon", icon: Hexagon as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "chart", label: "Chart", icon: LineChart as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "smartphone", label: "Phone", icon: Smartphone as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "github", label: "GitHub", icon: Github as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
	{ id: "twitter", label: "Twitter", icon: Twitter as React.ComponentType<{ className?: string; style?: React.CSSProperties }> },
] as const;

const LAYOUTS: { id: Layout; label: string }[] = [
	{ id: "left", label: "Icon Left" },
	{ id: "top", label: "Icon Top" },
	{ id: "right", label: "Icon Right" },
	{ id: "stack", label: "Stacked" },
	{ id: "around", label: "Around" },
];

const WEIGHTS: { id: Weight; label: string }[] = [
	{ id: "normal", label: "Normal" },
	{ id: "medium", label: "Medium" },
	{ id: "semibold", label: "Semibold" },
	{ id: "bold", label: "Bold" },
];

const TRANSFORMS: { id: Transform; label: string }[] = [
	{ id: "none", label: "None" },
	{ id: "uppercase", label: "Uppercase" },
	{ id: "lowercase", label: "Lowercase" },
	{ id: "capitalize", label: "Capitalize" },
];

const BACKGROUND_TYPES: { id: BackgroundType; label: string }[] = [
	{ id: "solid", label: "Solid" },
	{ id: "gradientLinear", label: "Linear Gradient" },
	{ id: "gradientRadial", label: "Radial Gradient" },
	{ id: "grid", label: "Grid" },
	{ id: "dots", label: "Dots" },
	{ id: "stripes", label: "Stripes" },
];

const PRESETS: Preset[] = [
	{
		id: "modern-minimal",
		name: "Modern Minimal",
		state: {
			text: "SopKit",
			tagline: "Private by default",
			font: "inter",
			iconId: "rocket",
			layout: "left",
			textColor: "#0a0a0a",
			iconColor: "#2563eb",
			backgroundColor: "#ffffff",
			backgroundType: "solid",
			fontSize: 56,
			iconSize: 64,
			gap: 20,
			fontWeight: "semibold",
			textTransform: "none",
			letterSpacing: -0.5,
			lineHeight: 1.05,
			padding: 64,
			textShadow: "none",
			textStroke: "none",
			iconShadow: "none",
			borderRadius: 18,
			align: "left",
			exportKind: "png",
			name: "Modern Minimal",
		},
	},
	{
		id: "bold-badge",
		name: "Bold Badge",
		state: {
			text: "ALPHA",
			tagline: "OWERED STUDIO",
			font: "mono",
			iconId: "flame",
			layout: "top",
			textColor: "#ffffff",
			iconColor: "#ffffff",
			backgroundColor: "#111827",
			backgroundType: "solid",
			fontSize: 64,
			iconSize: 54,
			gap: 18,
			fontWeight: "bold",
			textTransform: "uppercase",
			letterSpacing: 6,
			lineHeight: 1.1,
			padding: 72,
			textShadow: "0 10px 25px rgba(0,0,0,0.35)",
			textStroke: "none",
			iconShadow: "0 12px 30px rgba(0,0,0,0.45)",
			borderRadius: 28,
			align: "center",
			exportKind: "png",
			name: "Bold Badge",
		},
	},
	{
		id: "glass-overlay",
		name: "Soft Glass",
		state: {
			text: "Lumina",
			tagline: "Create freely",
			font: "serif",
			iconId: "sun",
			layout: "left",
			textColor: "#1f2937",
			iconColor: "#f59e0b",
			backgroundColor: "#f8fafc",
			backgroundType: "solid",
			fontSize: 54,
			iconSize: 60,
			gap: 24,
			fontWeight: "normal",
			textTransform: "capitalize",
			letterSpacing: 0,
			lineHeight: 1.15,
			padding: 56,
			textShadow: "0 1px 0 rgba(255,255,255,0.7)",
			textStroke: "none",
			iconShadow: "0 10px 20px rgba(0,0,0,0.08)",
			borderRadius: 20,
			align: "left",
			exportKind: "png",
			name: "Soft Glass",
		},
	},
];

const initialState: HistoryState = {
	text: "My Brand",
	tagline: "",
	font: "inter",
	iconId: "rocket",
	layout: "left",
	textColor: "#111111",
	iconColor: "#2563eb",
	backgroundColor: "#ffffff",
	backgroundType: "solid",
	fontSize: 52,
	iconSize: 64,
	gap: 20,
	fontWeight: "semibold",
	textTransform: "none",
	letterSpacing: 0,
	lineHeight: 1.1,
	padding: 56,
	textShadow: "none",
	textStroke: "none",
	iconShadow: "none",
	borderRadius: 10,
	align: "left",
	exportKind: "png",
	name: "Custom",
};

export default function LogoGeneratorTool() {
	const [state, setState] = useState<HistoryState>(initialState);
	const [history, setHistory] = useState<HistoryState[]>([initialState]);
	const [historyIndex, setHistoryIndex] = useState(0);
	const [isExporting, setIsExporting] = useState(false);
	const [selectedPreset, setSelectedPreset] = useState("custom");
	const [presetName, setPresetName] = useState("My preset");
	const logoRef = useRef<HTMLDivElement>(null);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	const set = (partial: Partial<HistoryState>) => {
		setState((s) => {
			const next = { ...s, ...partial };
			setHistory((h) => {
				const newHistory = historyIndex < h.length - 1 ? h.slice(0, historyIndex + 1) : h;
				return [...newHistory, next];
			});
			setHistoryIndex((i) => Math.min(i + 1, history.length));
			return next;
		});
	};

	const undo = () => {
		if (!canUndo) return;
		const previous = history[historyIndex - 1];
		setState(previous);
		setHistoryIndex((i) => i - 1);
	};

	const redo = () => {
		if (!canRedo) return;
		const next = history[historyIndex + 1];
		setState(next);
		setHistoryIndex((i) => i + 1);
	};

	const canUndo = historyIndex > 0;
	const canRedo = historyIndex < history.length - 1;

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
				e.preventDefault();
				e.shiftKey ? redo() : undo();
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
				e.preventDefault();
				redo();
			}
		};
		window.addEventListener("keydown", handleKey, { passive: false });
		return () => window.removeEventListener("keydown", handleKey);
	}, [canUndo, canRedo]);

	const loadPreset = (preset: Preset) => {
		setState(preset.state);
		setHistory([preset.state]);
		setHistoryIndex(0);
		setSelectedPreset(preset.id);
		toast.success(`Loaded ${preset.name}`);
	};

	const savePreset = () => {
		const name = presetName.trim() || "Untitled preset";
		const preset: Preset = { id: `custom-${Date.now()}`, name, state };
		const existing = JSON.parse(localStorage.getItem("logo-presets") || "[]");
		localStorage.setItem("logo-presets", JSON.stringify([...existing, preset]));
		toast.success("Preset saved");
	};

	const loadSavedPresets = () => {
		try {
			return JSON.parse(localStorage.getItem("logo-presets") || "[]") as Preset[];
		} catch {
			return [];
		}
	};

	const SelectedIconComponent =
		ICONS.find((i) => i.id === state.iconId)?.icon || Rocket;
	const selectedFontFamily = FONTS.find((f) => f.id === state.font)?.family;

	const measureCanvas = () => {
		if (!logoRef.current) return;
		const { width, height } = logoRef.current.getBoundingClientRect();
		setCanvasSize({ width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) });
	};

	useLayoutEffect(() => {
		const timeout = setTimeout(measureCanvas, 0);
		return () => clearTimeout(timeout);
	}, [state]);

	const buildBackgroundCss = () => {
		switch (state.backgroundType) {
			case "solid":
				return { backgroundColor: state.backgroundColor };
			case "gradientLinear":
				return { background: `linear-gradient(135deg, ${state.backgroundColor}, #0f172a)` };
			case "gradientRadial":
				return { background: `radial-gradient(circle at center, ${state.backgroundColor}, #0f172a)` };
			case "grid":
				return {
					backgroundColor: state.backgroundColor,
					backgroundImage:
						"linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				};
			case "dots":
				return {
					backgroundColor: state.backgroundColor,
					backgroundImage: "radial-gradient(rgba(15,23,42,0.18) 1px, transparent 1px)",
					backgroundSize: "18px 18px",
				};
			case "stripes":
				return {
					backgroundColor: state.backgroundColor,
					backgroundImage:
						"repeating-linear-gradient(45deg, transparent, transparent 16px, rgba(15,23,42,0.08) 16px, rgba(15,23,42,0.08) 32px)",
				};
			default:
				return {};
		}
	};

	const textShadowCss =
		state.textShadow === "none" ? {} : { textShadow: state.textShadow };
	const textStrokeCss =
		state.textStroke === "none"
			? {}
			: {
					WebkitTextStroke: `1px ${state.textStroke}`,
					textStroke: `1px ${state.textStroke}`,
				};
	const iconShadowCss =
		state.iconShadow === "none" ? {} : { filter: `drop-shadow(${state.iconShadow})` };

	const buildSvg = () => {
		const fontSize = state.fontSize;
		const iconSize = state.iconSize;
		const paddingY = state.padding;
		const paddingX = state.padding * 1.35;
		const horizontalGap = state.gap;
		const verticalGap = state.gap;
		const taglineSize = Math.max(12, fontSize * 0.38);
		const taglineGap = 6;
		const iconBlockHeight =
			state.layout === "top"
				? iconSize + (Number.isFinite(taglineSize) && state.tagline ? taglineSize + taglineGap : 0)
				: iconSize;
		const textBlockHeight =
			fontSize +
			(state.tagline ? Math.max(0, Number.isFinite(taglineSize) ? taglineSize + taglineGap : 0) : 0);
		const contentHeight = state.layout === "top" ? iconBlockHeight + verticalGap + textBlockHeight : Math.max(iconBlockHeight, textBlockHeight);

		let contentWidth: number;
		if (state.layout === "top") {
			const iconWidth =
				Number.isFinite(iconSize) ? Math.round(iconSize * 1.05) : Math.round(iconSize);
			const textWidth = Math.round(state.text.length * fontSize * 0.6);
			contentWidth = Math.max(iconWidth, textWidth) + horizontalGap * 2;
		} else if (state.layout === "stack") {
			const iconWidth = Number.isFinite(iconSize) ? Math.round(iconSize * 1.05) : Math.round(iconSize);
			const textWidth = Math.round(state.text.length * fontSize * 0.6);
			contentWidth = Math.max(iconWidth, textWidth) + horizontalGap * 2;
		} else if (state.layout === "around") {
			const centerWidth = Math.round(state.text.length * fontSize * 0.6);
			const sideBoxSize = Math.round(iconSize * 1.25);
			contentWidth = sideBoxSize + centerWidth + sideBoxSize + horizontalGap * 4;
		} else {
			const iconWidth =
				Number.isFinite(iconSize) ? Math.round(iconSize * 1.05) : Math.round(iconSize);
			const textWidth = Math.round(state.text.length * fontSize * 0.6);
			contentWidth = iconWidth + horizontalGap + textWidth;
		}

		const width = Math.max(10, Math.round(contentWidth + paddingX * 2));
		const height = Math.max(10, Math.round(contentHeight + paddingY * 2));
		const cx = width / 2;
		const cy = paddingY + contentHeight / 2;

		const yIcon = cy - (state.layout === "top" ? contentHeight / 2 : 0);
		const yText = state.layout === "right" || state.layout === "left" ? cy - fontSize / 2 : cy + iconBlockHeight / 2 - textBlockHeight / 2;
		const textAnchor = state.align === "left" ? "start" : state.align === "right" ? "end" : "middle";

		let background =
			state.backgroundType === "solid"
				? `<rect x="0" y="0" width="${width}" height="${height}" fill="${state.backgroundColor}" rx="${state.borderRadius}"/>`
				: state.backgroundType === "gradientLinear"
					? `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${state.backgroundColor}"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect x="0" y="0" width="${width}" height="${height}" fill="url(#g)" rx="${state.borderRadius}"/>`
					: state.backgroundType === "gradientRadial"
						? `<defs><radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${state.backgroundColor}"/><stop offset="100%" stop-color="#0f172a"/></radialGradient></defs><rect x="0" y="0" width="${width}" height="${height}" fill="url(#g)" rx="${state.borderRadius}"/>`
						: state.backgroundType === "grid"
							? `<rect x="0" y="0" width="${width}" height="${height}" fill="${state.backgroundColor}" rx="${state.borderRadius}"/><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(15,23,42,0.1)" stroke-width="1"/></pattern></defs><rect x="0" y="0" width="${width}" height="${height}" fill="url(#grid)" rx="${state.borderRadius}"/>`
							: state.backgroundType === "dots"
								? `<rect x="0" y="0" width="${width}" height="${height}" fill="${state.backgroundColor}" rx="${state.borderRadius}"/><defs><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(15,23,42,0.18)"/></pattern></defs><rect x="0" y="0" width="${width}" height="${height}" fill="url(#dots)" rx="${state.borderRadius}"/>`
								: `<rect x="0" y="0" width="${width}" height="${height}" fill="${state.backgroundColor}" rx="${state.borderRadius}"/><defs><pattern id="stripes" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="32" fill="rgba(15,23,42,0.09)"/></pattern></defs><rect x="0" y="0" width="${width}" height="${height}" fill="url(#stripes)" rx="${state.borderRadius}"/>`;

		const xText =
			state.layout === "around" ? cx : state.align === "center" ? cx : state.align === "right" ? paddingX + contentWidth - horizontalGap : paddingX + horizontalGap;

		const mainTextY = state.layout === "top" || state.layout === "around" ? yText : yText + fontSize * 0.15;
		const taglineY = Number.isFinite(taglineSize) ? mainTextY + taglineGap + taglineSize : mainTextY;

		const taglinePart =
			state.tagline && Number.isFinite(taglineSize)
				? `<text x="${xText}" y="${taglineY}" text-anchor="${textAnchor}" font-family="${selectedFontFamily}" font-size="${taglineSize}" fill="${state.textColor}" opacity="0.82" font-style="italic" letter-spacing="${state.letterSpacing * 0.5}">${escapeSvg(state.tagline)}</text>`
				: "";

		const textShadowSvg =
			state.textShadow !== "none"
				? `<filter id="ts" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="${state.textColor}" flood-opacity="0.35"/></filter>`
				: "";
		const iconShadowSvg =
			state.iconShadow !== "none"
				? `<filter id="is" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/></filter>`
				: "";

		let iconSvg = "";
		const iconRadius = iconSize / 2;
		let xIcon = state.layout === "right" ? width - paddingX - iconSize : state.layout === "around" ? paddingX + horizontalGap : paddingX + horizontalGap;
		let yIconBlock = state.layout === "top" ? paddingY + (Math.max(iconBlockHeight, textBlockHeight) - iconBlockHeight) / 2 : paddingY + (contentHeight - iconBlockHeight) / 2;

		if (state.layout === "around") {
			iconSvg = `<circle cx="${paddingX + iconRadius + horizontalGap / 2}" cy="${cy}" r="${iconRadius}" fill="${state.iconColor}" opacity="0.95"${iconShadowSvg ? ` filter="url(#is)"` : ""}/>`;
			const iconLabel = ICONS.find((i) => i.id === state.iconId)?.label || "Icon";
			iconSvg += `<text x="${paddingX + iconRadius + horizontalGap / 2}" y="${cy + 4}" text-anchor="middle" font-size="${iconSize * 0.45}" fill="#fff">${iconLabel.slice(0, 2).toUpperCase()}</text>`;
		} else {
			iconSvg = `<circle cx="${xIcon + iconRadius}" cy="${yIconBlock + iconRadius}" r="${iconRadius}" fill="${state.iconColor}"${iconShadowSvg ? ` filter="url(#is)"` : ""}/>`;
			const iconLabel = ICONS.find((i) => i.id === state.iconId)?.label || "Icon";
			iconSvg += `<text x="${xIcon + iconRadius}" y="${yIconBlock + iconRadius + 4}" text-anchor="middle" font-size="${iconSize * 0.45}" fill="#fff">${iconLabel.slice(0, 2).toUpperCase()}</text>`;
		}

		if (state.layout === "around") {
			iconSvg += `<circle cx="${width - paddingX - iconRadius - horizontalGap / 2}" cy="${cy}" r="${iconRadius}" fill="${state.iconColor}" opacity="0.95"/>`;
			const iconLabel = ICONS.find((i) => i.id === state.iconId)?.label || "Icon";
			iconSvg += `<text x="${width - paddingX - iconRadius - horizontalGap / 2}" y="${cy + 4}" text-anchor="middle" font-size="${iconSize * 0.45}" fill="#fff">${iconLabel.slice(0, 2).toUpperCase()}</text>`;
		}

		return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>${escapeSvg(state.text)}</title>
  ${textShadowSvg}
  ${iconShadowSvg}
  ${background}
  ${iconSvg}
  <text x="${xText}" y="${mainTextY}" text-anchor="${textAnchor}" font-family="${selectedFontFamily}" font-size="${fontSize}" font-weight="${state.fontWeight}" fill="${state.textColor}" text-transform="${state.textTransform}" letter-spacing="${state.letterSpacing}" line-height="${state.lineHeight}"${textShadowSvg ? ` filter="url(#ts)"` : ""}${textStrokeSvgAttribute(state.textStroke)}>${escapeSvg(state.text)}</text>
  ${taglinePart}
</svg>`;
	};

	const download = async (kind: ExportKind) => {
		if (!logoRef.current) return;
		setIsExporting(true);
		try {
			if (kind === "svg") {
				const svg = buildSvg();
				const blob = new Blob([svg], { type: "image/svg+xml" });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.download = `${state.text.trim().replace(/\s+/g, "-").toLowerCase() || "logo"}.svg`;
				link.href = url;
				link.click();
				URL.revokeObjectURL(url);
			} else {
				const canvas = await html2canvas(logoRef.current, {
					useCORS: true,
					scale: 4,
					backgroundColor: null,
					logging: false,
					width: canvasSize.width,
					height: canvasSize.height,
				});
				const url = canvas.toDataURL("image/png");
				const link = document.createElement("a");
				link.download = `${state.text.trim().replace(/\s+/g, "-").toLowerCase() || "logo"}.png`;
				link.href = url;
				link.click();
			}
			toast.success(`${kind.toUpperCase()} exported`);
		} catch (e) {
			console.error(e);
			toast.error("Export failed");
		} finally {
			setIsExporting(false);
		}
	};

	const reset = () => {
		setState(initialState);
		setHistory([initialState]);
		setHistoryIndex(0);
		setSelectedPreset("custom");
		toast.success("Reset logo");
	};

	const exportActive =
		state.exportKind === "svg" ? (
			<>
				<FileJson className="w-4 h-4 mr-2" />
				{"Download SVG"}
			</>
		) : (
			<>
				<Download className="w-4 h-4 mr-2" />
				{"Download PNG"}
			</>
		);

	const flexDir =
		state.layout === "top"
			? "column"
			: state.layout === "right"
				? "row-reverse"
				: state.layout === "around"
					? "row"
					: "row";

	const alignItems = state.align === "center" ? "center" : state.align === "right" ? "flex-end" : "flex-start";
	const textAlign = state.align;

	return (
		<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
			<div className="xl:col-span-1 space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Logo Studio</h2>
					<div className="flex items-center gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}>
										<Undo2 className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Undo</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}>
										<RefreshCcw className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Redo</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button variant="outline" size="sm" onClick={reset}>
							Reset
						</Button>
					</div>
				</div>

				<Tabs defaultValue="content" className="w-full">
					<TabsList className="w-full grid grid-cols-3">
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="style">Style</TabsTrigger>
						<TabsTrigger value="export">Export</TabsTrigger>
					</TabsList>
					<TabsContent value="content" className="space-y-4">
						<Card>
							<CardContent className="space-y-4 pt-6">
								<div className="space-y-2">
									<Label>Brand Name</Label>
									<Input
										value={state.text}
										onChange={(e) => set({ text: e.target.value })}
										placeholder="Enter brand or business name"
									/>
								</div>
								<div className="space-y-2">
									<Label>Tagline (Optional)</Label>
									<Textarea
										value={state.tagline}
										onChange={(e) => set({ tagline: e.target.value })}
										placeholder="Short phrase underneath the name"
										className="resize-none"
										rows={2}
									/>
								</div>
								<div className="space-y-2">
									<Label>Icon</Label>
									<Select value={state.iconId} onValueChange={(v) => set({ iconId: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ICONS.map((icon) => (
												<SelectItem key={icon.id} value={icon.id}>
													<div className="flex items-center gap-2">
														<icon.icon className="w-4 h-4" />
														{icon.label}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Font</Label>
									<Select value={state.font} onValueChange={(v) => set({ font: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{FONTS.map((f) => (
												<SelectItem key={f.id} value={f.id}>
													<span style={{ fontFamily: f.family }}>{f.label}</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Layout</Label>
									<div className="grid grid-cols-3 gap-2">
										{LAYOUTS.map((l) => (
											<Button
												key={l.id}
												variant={state.layout === l.id ? "default" : "outline"}
												size="sm"
												onClick={() => set({ layout: l.id })}
											>
												{l.label}
											</Button>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="style" className="space-y-4">
						<Card>
							<CardContent className="space-y-5 pt-6">
								<div className="space-y-2">
									<Label>Background</Label>
									<Select value={state.backgroundType} onValueChange={(v) => set({ backgroundType: v as BackgroundType })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{BACKGROUND_TYPES.map((bg) => (
												<SelectItem key={bg.id} value={bg.id}>
													{bg.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<div className="flex items-center gap-2">
										<Input
											type="color"
											value={state.backgroundColor}
											onChange={(e) => set({ backgroundColor: e.target.value })}
											className="w-12 h-10 p-1 cursor-pointer"
										/>
										<Input
											type="text"
											value={state.backgroundColor}
											onChange={(e) => set({ backgroundColor: e.target.value })}
											className="flex-1"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Colors</Label>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<span className="text-xs text-muted-foreground">Text</span>
											<div className="flex items-center gap-2 mt-1">
												<Input
													type="color"
													value={state.textColor}
													onChange={(e) => set({ textColor: e.target.value })}
													className="w-10 h-9 p-1 cursor-pointer"
												/>
												<Input
													type="text"
													value={state.textColor}
													onChange={(e) => set({ textColor: e.target.value })}
												/>
											</div>
										</div>
										<div>
											<span className="text-xs text-muted-foreground">Icon</span>
											<div className="flex items-center gap-2 mt-1">
												<Input
													type="color"
													value={state.iconColor}
													onChange={(e) => set({ iconColor: e.target.value })}
													className="w-10 h-9 p-1 cursor-pointer"
												/>
												<Input
													type="text"
													value={state.iconColor}
													onChange={(e) => set({ iconColor: e.target.value })}
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label>Weight</Label>
										<Select value={state.fontWeight} onValueChange={(v) => set({ fontWeight: v as Weight })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{WEIGHTS.map((w) => (
													<SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Casing</Label>
										<Select value={state.textTransform} onValueChange={(v) => set({ textTransform: v as Transform })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TRANSFORMS.map((t) => (
													<SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-3">
									<div>
										<Label>Font Size ({state.fontSize}px)</Label>
										<Slider value={[state.fontSize]} onValueChange={(v) => set({ fontSize: v[0] })} min={18} max={140} step={1} />
									</div>
									<div>
										<Label>Icon Size ({state.iconSize}px)</Label>
										<Slider value={[state.iconSize]} onValueChange={(v) => set({ iconSize: v[0] })} min={16} max={160} step={1} />
									</div>
									<div>
										<Label>Spacing ({state.gap}px)</Label>
										<Slider value={[state.gap]} onValueChange={(v) => set({ gap: v[0] })} min={-20} max={120} step={1} />
									</div>
									<div>
										<Label>Padding ({state.padding}px)</Label>
										<Slider value={[state.padding]} onValueChange={(v) => set({ padding: v[0] })} min={12} max={200} step={1} />
									</div>
									<div>
										<Label>Corner Radius ({state.borderRadius}px)</Label>
										<Slider value={[state.borderRadius]} onValueChange={(v) => set({ borderRadius: v[0] })} min={0} max={120} step={1} />
									</div>
								</div>

								<div className="space-y-3">
									<div>
										<Label>Letter Spacing ({state.letterSpacing}px)</Label>
										<Slider value={[state.letterSpacing]} onValueChange={(v) => set({ letterSpacing: v[0] })} min={-4} max={20} step={0.5} />
									</div>
									<div>
										<Label>Line Height ({state.lineHeight})</Label>
										<Slider value={[state.lineHeight]} onValueChange={(v) => set({ lineHeight: v[0] })} min={0.6} max={2.2} step={0.05} />
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label>Text Shadow</Label>
										<Select value={state.textShadow} onValueChange={(v) => set({ textShadow: v })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="0 2px 0 rgba(0,0,0,0.14)">Subtle</SelectItem>
												<SelectItem value="0 6px 18px rgba(0,0,0,0.28)">Soft</SelectItem>
												<SelectItem value="0 10px 25px rgba(0,0,0,0.45)">Deep</SelectItem>
												<SelectItem value="2px 2px 0px #ffffff">Inset white</SelectItem>
												<SelectItem value="0 0 20px rgba(37,99,235,0.55)">Glow blue</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Text Stroke</Label>
										<Select value={state.textStroke} onValueChange={(v) => set({ textStroke: v })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="#ffffff">White</SelectItem>
												<SelectItem value="#000000">Black</SelectItem>
												<SelectItem value="#2563eb">Blue</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label>Icon Shadow</Label>
										<Select value={state.iconShadow} onValueChange={(v) => set({ iconShadow: v })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="0 10px 20px rgba(0,0,0,0.22)">Soft</SelectItem>
												<SelectItem value="0 14px 28px rgba(0,0,0,0.4)">Deep</SelectItem>
												<SelectItem value="0 0 22px rgba(37,99,235,0.6)">Glow</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Alignment</Label>
										<Select value={state.align} onValueChange={(v) => set({ align: v as HistoryState["align"] })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="left">Left</SelectItem>
												<SelectItem value="center">Center</SelectItem>
												<SelectItem value="right">Right</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="export" className="space-y-4">
						<Card>
							<CardContent className="space-y-4 pt-6">
								<div>
									<Label>Presets</Label>
									<div className="flex gap-2 mt-2">
										<Select value={selectedPreset} onValueChange={(v) => {
											if (v === "custom") return;
											const preset = [...PRESETS, ...loadSavedPresets()].find((p) => p.id === v);
											if (preset) {
												setSelectedPreset(v);
												loadPreset(preset);
											}
										}}>
											<SelectTrigger>
												<SelectValue placeholder="Choose a preset" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="custom">Custom</SelectItem>
												{PRESETS.map((preset) => (
													<SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
												))}
												{loadSavedPresets().map((preset) => (
													<SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Save Current Preset</Label>
									<div className="flex gap-2">
										<Input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="Preset name" />
										<Button onClick={savePreset} size="icon">
											<Save className="w-4 h-4" />
										</Button>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Format</Label>
									<Select value={state.exportKind} onValueChange={(v) => set({ exportKind: v as ExportKind })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="png">PNG</SelectItem>
											<SelectItem value="svg">SVG</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button className="w-full" onClick={() => download(state.exportKind)} disabled={isExporting}>
									{isExporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : exportActive}
								</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			<div className="xl:col-span-2">
				<Card className="h-full min-h-[520px] flex items-center justify-center bg-background overflow-hidden relative">
					<div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
						<div className="grid grid-cols-12 gap-4 w-full h-full">
							{Array.from({ length: 144 }).map((_, i) => (
								<div key={i} className="border border-gray-300/50" />
							))}
						</div>
					</div>
					<CardContent className="p-10 w-full flex items-center justify-center">
						<div
							ref={logoRef}
							className="inline-flex overflow-hidden select-none"
							style={{
								...buildBackgroundCss(),
								flexDirection:
									state.layout === "top" || state.layout === "stack"
										? "column"
										: state.layout === "right" || state.layout === "around"
											? "row"
											: "row",
								alignItems,
								justifyContent: state.align === "center" ? "center" : state.align === "right" ? "flex-end" : "flex-start",
								textAlign,
								gap: `${state.gap}px`,
								padding: `${state.padding}px`,
								borderRadius: `${state.borderRadius}px`,
							}}
						>
							{state.layout === "around" ? (
								<>
									<SelectedIconComponent style={{ width: `${state.iconSize}px`, height: `${state.iconSize}px`, color: state.iconColor, ...iconShadowCss }} />
									<div className="flex flex-col" style={{ alignItems: textAlign === "center" ? "center" : state.align, textAlign }}>
										<span style={{ fontFamily: selectedFontFamily, fontSize: `${state.fontSize}px`, color: state.textColor, lineHeight: state.lineHeight, fontWeight: state.fontWeight, textTransform: state.textTransform, letterSpacing: `${state.letterSpacing}px`, ...textShadowCss, ...textStrokeCss }}>
											{state.text}
										</span>
										{state.tagline && (
											<span style={{ fontFamily: selectedFontFamily, fontSize: `${state.fontSize * 0.38}px`, color: state.textColor, opacity: 0.85, marginTop: 2, letterSpacing: `${state.letterSpacing * 0.5}px`, lineHeight: state.lineHeight }}>
												{state.tagline}
											</span>
										)}
									</div>
									<SelectedIconComponent style={{ width: `${state.iconSize}px`, height: `${state.iconSize}px`, color: state.iconColor, ...iconShadowCss }} />
								</>
							) : (
								<>
									{(state.layout === "right" || state.layout === "left") ? (
										<SelectedIconComponent style={{ width: `${state.iconSize}px`, height: `${state.iconSize}px`, color: state.iconColor, ...iconShadowCss }} />
									) : null}
									<div className="flex flex-col" style={{ alignItems: textAlign === "center" ? "center" : state.align, textAlign }}>
										<span style={{ fontFamily: selectedFontFamily, fontSize: `${state.fontSize}px`, color: state.textColor, lineHeight: state.lineHeight, fontWeight: state.fontWeight, textTransform: state.textTransform, letterSpacing: `${state.letterSpacing}px`, ...textShadowCss, ...textStrokeCss }}>
											{state.text}
										</span>
										{state.tagline && (
											<span style={{ fontFamily: selectedFontFamily, fontSize: `${state.fontSize * 0.38}px`, color: state.textColor, opacity: 0.85, marginTop: 2, letterSpacing: `${state.letterSpacing * 0.5}px`, lineHeight: state.lineHeight }}>
												{state.tagline}
											</span>
										)}
									</div>
									{state.layout === "left" || state.layout === "right" ? (
										<SelectedIconComponent style={{ width: `${state.iconSize}px`, height: `${state.iconSize}px`, color: state.iconColor, ...iconShadowCss }} />
									) : null}
								</>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function escapeSvg(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function textStrokeSvgAttribute(value: string) {
	if (value === "none") return "";
	return ` stroke="${value}" stroke-width="1" paint-order="stroke"`;
}
