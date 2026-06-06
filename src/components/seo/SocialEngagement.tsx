"use client";

import {
	ArrowRight,
	Bookmark,
	CheckCircle2,
	Copy,
	Globe,
	Monitor,
	Share2,
	Smartphone,
	Star,
	Tablet,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Tool } from "@/lib/tools";

// Social sharing component
export interface SocialShareProps {
	url: string;
	title: string;
	description: string;
	className?: string;
}

export function SocialShare({ url, title, description, className = "" }: SocialShareProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title,
					text: description,
					url,
				});
			} catch (err) {
				// User might have cancelled or it failed
				if ((err as Error).name !== 'AbortError') {
					console.error("Error sharing:", err);
				}
			}
		} else {
			handleCopy();
		}
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Button
				variant="outline"
				size="sm"
				onClick={handleCopy}
				className="rounded-none border-border/40"
			>
				{copied ? (
					<CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
				) : (
					<Copy className="h-4 w-4 mr-2" />
				)}
				{copied ? "Copied" : "Copy Link"}
			</Button>
			<Button
				variant="default"
				size="sm"
				onClick={handleShare}
				className="rounded-none"
			>
				<Share2 className="h-4 w-4 mr-2" />
				Share
			</Button>
		</div>
	);
}

// Related tools component
export interface RelatedToolsProps {
	currentTool: string;
	category?: string;
	tools?: Tool[];
	title?: string;
	showCategory?: boolean;
}

export function RelatedTools({
	currentTool,
	category,
	tools = [],
	title = "Related Tools",
	showCategory = true,
}: RelatedToolsProps) {
	// Filter related tools (excluding current tool)
	const relatedTools = tools
		.filter((tool) => tool.id !== currentTool && tool.category === category)
		.slice(0, 10);

	if (relatedTools.length === 0) {
		return null;
	}

	return (
		<Card className="rounded-none border-t-4 border-t-primary shadow-2xl">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-black italic uppercase tracking-tighter">
					<TrendingUp className="h-6 w-6 text-primary" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
					{relatedTools.map((tool, index) => {
						const isHighlighted = index < 3;
						return (
							<Link
								key={tool.id}
								href={tool.route}
								className={cn(
									"group relative block p-6 border transition-all duration-300 rounded-none",
									isHighlighted 
										? "bg-primary/[0.03] border-primary/30 shadow-lg shadow-primary/5" 
										: "bg-card border-border/40 hover:border-primary/20"
								)}
							>
								{isHighlighted && (
									<div className="absolute top-0 right-0 px-3 py-1 bg-primary text-[10px] font-black text-white uppercase tracking-widest leading-none">
										Top Recommendation
									</div>
								)}
								<div className="flex items-start gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className={cn(
												"font-bold transition-colors group-hover:text-primary",
												isHighlighted ? "text-xl" : "text-lg"
											)}>
												{tool.name}
											</h3>
											{isHighlighted && <Star className="h-4 w-4 text-primary fill-current" />}
										</div>
										<p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
											{tool.description}
										</p>
										{showCategory && (
											<div className="mt-4 flex flex-wrap gap-2">
												<Badge variant="secondary" className="rounded-none text-[10px] font-bold uppercase tracking-wider bg-muted/50">
													{tool.category}
												</Badge>
												{isHighlighted && (
													<Badge variant="outline" className="rounded-none text-[10px] font-bold uppercase tracking-wider border-primary/20 text-primary">
														Featured
													</Badge>
												)}
											</div>
										)}
									</div>
									<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
								</div>
							</Link>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

// Popular tools showcase
export interface PopularToolsProps {
	tools?: Tool[];
	title?: string;
	showStats?: boolean;
}

export function PopularTools({
	tools = [],
	title = "Most Popular Tools",
	showStats = true,
}: PopularToolsProps) {
	const popularTools = tools.filter((tool) => tool.popular).slice(0, 8);

	return (
		<section className="py-12 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2">{title}</h2>
					<p className="text-muted-foreground">
						The most loved tools by our community
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{popularTools.map((tool, index) => (
						<Card
							key={tool.id}
							className="group hover:shadow-lg transition-shadow"
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<Badge variant="secondary" className="text-xs">
										#{index + 1} Popular
									</Badge>
									<Star className="h-4 w-4 text-primary fill-current" />
								</div>
								<CardTitle className="text-lg">{tool.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
									{tool.description}
								</p>

								{showStats && (
									<div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3" />
											<span>Free to use</span>
										</div>
										<div className="flex items-center gap-1">
											<TrendingUp className="h-3 w-3" />
											<span>No signup required</span>
										</div>
									</div>
								)}

								<Button asChild className="w-full" size="sm">
									<Link href={tool.route}>
										Try Now
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

// Device compatibility indicator
export function DeviceCompatibility() {
	const devices = [
		{ name: "Desktop", icon: Monitor, supported: true },
		{ name: "Tablet", icon: Tablet, supported: true },
		{ name: "Mobile", icon: Smartphone, supported: true },
		{ name: "Web Browser", icon: Globe, supported: true },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Device Compatibility</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{devices.map((device) => {
						const Icon = device.icon;
						return (
							<div key={device.name} className="text-center">
								<div className="flex items-center justify-center mb-2">
									<Icon
										className={`h-8 w-8 ${device.supported ? "text-primary" : "text-muted-foreground"}`}
									/>
								</div>
								<div className="text-sm font-medium">{device.name}</div>
								<div
									className={`text-xs ${device.supported ? "text-primary" : "text-muted-foreground"}`}
								>
									{device.supported ? "Supported" : "Not Supported"}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

// Quick action buttons
export interface QuickActionsProps {
	toolName: string;
	toolUrl: string;
	showBookmark?: boolean;
	showShare?: boolean;
	className?: string;
}

export function QuickActions({
	toolName,
	toolUrl,
	showBookmark = true,
	showShare = true,
	className = "",
}: QuickActionsProps) {
	const [bookmarked, setBookmarked] = useState(false);

	const handleBookmark = () => {
		setBookmarked(!bookmarked);
		// In a real app, save to user preferences or local storage
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{showBookmark && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleBookmark}
					className={cn("rounded-none", bookmarked ? "bg-muted/50 border-border" : "")}
				>
					<Bookmark
						className={cn("h-4 w-4 mr-2", bookmarked ? "fill-current text-primary" : "")}
					/>
					{bookmarked ? "Bookmarked" : "Bookmark"}
				</Button>
			)}

			{showShare && (
				<SocialShare
					url={toolUrl}
					title={`${toolName} - Free Online Tool`}
					description={`Try ${toolName} - a free, fast, and secure online tool.`}
				/>
			)}
		</div>
	);
}

// Tool features showcase
export interface ToolFeaturesProps {
	features?: string[];
	title?: string;
	variant?: "list" | "grid" | "badges";
}

export function ToolFeatures({
	features = [],
	title = "Key Features",
	variant = "list", // "list", "grid", "badges"
}: ToolFeaturesProps) {
	if (!features || features.length === 0) {
		return null;
	}

	const renderList = () => (
		<div className="space-y-3">
			{features.map((feature, index) => (
				<div key={index} className="flex items-start gap-3">
					<div className="flex-shrink-0 w-6 h-6 bg-primary/10 flex items-center justify-center mt-0.5">
						<div className="w-2 h-2 bg-primary " />
					</div>
					<div>
						<h4 className="font-medium text-sm">{feature}</h4>
					</div>
				</div>
			))}
		</div>
	);

	const renderGrid = () => (
		<div className="grid md:grid-cols-2 gap-4">
			{features.map((feature, index) => (
				<div
					key={index}
					className="flex items-center gap-3 p-3 border "
				>
					<div className="flex-shrink-0 w-8 h-8 bg-primary/10 flex items-center justify-center">
						<div className="w-3 h-3 bg-primary " />
					</div>
					<span className="font-medium text-sm">{feature}</span>
				</div>
			))}
		</div>
	);

	const renderBadges = () => (
		<div className="flex flex-wrap gap-2">
			{features.map((feature, index) => (
				<Badge key={index} variant="secondary" className="text-sm">
					{feature}
				</Badge>
			))}
		</div>
	);

	return (
		<Card className="rounded-none">
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{variant === "list" && renderList()}
				{variant === "grid" && renderGrid()}
				{variant === "badges" && renderBadges()}
			</CardContent>
		</Card>
	);
}
