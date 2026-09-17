"use client";

import { Check, Copy, Download, ExternalLink, Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function URLExtractorTool() {
	const [inputText, setInputText] = useState("");
	const [extractedUrls, setExtractedUrls] = useState([]);
	const [copied, setCopied] = useState(false);

	const extractUrls = () => {
		if (!inputText.trim()) {
			toast.error("Please enter some text");
			return;
		}

		// URL regex pattern to match various URL formats
		const urlRegex =
			/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
		const matches = inputText.match(urlRegex) || [];

		// Process and normalize URLs
		const processedUrls = matches.map((url, index) => {
			let normalizedUrl = url.trim();

			// Remove trailing punctuation
			normalizedUrl = normalizedUrl.replace(/[.,;:!?)]+$/, "");

			// Add protocol if missing
			if (normalizedUrl.startsWith("www.")) {
				normalizedUrl = `https://${normalizedUrl}`;
			} else if (
				!normalizedUrl.startsWith("http://") &&
				!normalizedUrl.startsWith("https://")
			) {
				normalizedUrl = `https://${normalizedUrl}`;
			}

			// Extract domain for display
			let domain = "";
			try {
				const urlObj = new URL(normalizedUrl);
				domain = urlObj.hostname;
			} catch (_e) {
				domain = normalizedUrl.split("/")[0];
			}

			return {
				id: index + 1,
				original: url,
				normalized: normalizedUrl,
				domain: domain,
				isValid: isValidUrl(normalizedUrl),
			};
		});

		// Remove duplicates
		const uniqueUrls = processedUrls.filter(
			(url, index, self) =>
				index === self.findIndex((u) => u.normalized === url.normalized),
		);

		setExtractedUrls(uniqueUrls);
		toast.success(`Found ${uniqueUrls.length} unique URLs`);
	};

	const isValidUrl = (string) => {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	};

	const copyAllUrls = async () => {
		if (extractedUrls.length === 0) return;

		const urlList = extractedUrls.map((url) => url.normalized).join("\n");
		try {
			await navigator.clipboard.writeText(urlList);
			setCopied(true);
			toast.success("All URLs copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy URLs");
		}
	};

	const copyUrl = async (url) => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("URL copied to clipboard!");
		} catch (error) {
			toast.error("Failed to copy URL");
		}
	};

	const downloadUrls = () => {
		if (extractedUrls.length === 0) return;

		const urlList = extractedUrls
			.map(
				(url, index) =>
					`${index + 1}. ${url.normalized} (Domain: ${url.domain})`,
			)
			.join("\n");

		const content = `Extracted URLs\n==============\n\n${urlList}\n\nTotal URLs found: ${extractedUrls.length}\nExtracted on: ${new Date().toLocaleString()}`;

		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "extracted_urls.txt";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("URLs downloaded!");
	};

	const openUrl = (url) => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const clearText = () => {
		setInputText("");
		setExtractedUrls([]);
		toast.success("Text cleared!");
	};

	const loadSampleText = () => {
		const sample = `Check out these websites:
https://www.google.com for search
Visit https://github.com/octocat for code repositories
You can also go to www.stackoverflow.com for programming help
Don't forget about youtube.com and wikipedia.org
Email us at contact@example.com or visit our site at https://example.com/contact
ftp://files.example.com/downloads/
http://subdomain.example.org/path/to/resource?param=value#section`;

		setInputText(sample);
		toast.success("Sample text loaded!");
	};

	const getStats = () => {
		const validUrls = extractedUrls.filter((url) => url.isValid).length;
		const domains = [...new Set(extractedUrls.map((url) => url.domain))];

		return {
			total: extractedUrls.length,
			valid: validUrls,
			invalid: extractedUrls.length - validUrls,
			uniqueDomains: domains.length,
		};
	};

	const stats = getStats();

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Input Section */}
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2 text-lg">
								<Link className="h-5 w-5 text-primary" />
								Input Text or Raw Content
							</CardTitle>
							<CardDescription>
								Paste raw text, HTML, markdown, or chat logs to extract links
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button onClick={loadSampleText} variant="outline" size="sm" className="h-8 text-xs">
								Sample
							</Button>
							{inputText && (
								<Button onClick={clearText} variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
									Clear
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<Textarea
						placeholder="Paste your content here... URLs will be extracted and validated instantly."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						rows={8}
						className="font-mono text-sm resize-y"
					/>

					<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
						<Button
							onClick={extractUrls}
							disabled={!inputText.trim()}
							className="w-full sm:w-auto px-6 font-semibold"
						>
							<Link className="h-4 w-4 mr-2" />
							Extract Links Now
						</Button>
						{extractedUrls.length > 0 && (
							<div className="flex items-center gap-2 w-full sm:w-auto">
								<Button onClick={copyAllUrls} variant="outline" size="sm" className="flex-1 sm:flex-none">
									{copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-500" /> : <Copy className="h-4 w-4 mr-1.5" />}
									{copied ? "Copied" : `Copy All (${extractedUrls.length})`}
								</Button>
								<Button onClick={downloadUrls} variant="outline" size="sm">
									<Download className="h-4 w-4 mr-1.5" />
									Export .txt
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Extraction Results */}
			{extractedUrls.length > 0 && (
				<div className="space-y-4">
					{/* Stat Metrics Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						<div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 text-center">
							<div className="text-2xl font-bold tracking-tight text-primary">
								{stats.total}
							</div>
							<div className="text-xs font-medium text-muted-foreground mt-0.5">
								Total URLs
							</div>
						</div>
						<div className="p-3.5 rounded-xl border border-border/60 bg-emerald-500/5 text-center">
							<div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
								{stats.valid}
							</div>
							<div className="text-xs font-medium text-muted-foreground mt-0.5">
								Valid URLs
							</div>
						</div>
						<div className="p-3.5 rounded-xl border border-border/60 bg-destructive/5 text-center">
							<div className="text-2xl font-bold tracking-tight text-destructive">
								{stats.invalid}
							</div>
							<div className="text-xs font-medium text-muted-foreground mt-0.5">
								Invalid Format
							</div>
						</div>
						<div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 text-center">
							<div className="text-2xl font-bold tracking-tight text-foreground">
								{stats.uniqueDomains}
							</div>
							<div className="text-xs font-medium text-muted-foreground mt-0.5">
								Unique Domains
							</div>
						</div>
					</div>

					{/* Extracted URLs List */}
					<Card className="border-border/60">
						<CardHeader className="py-3 px-4 border-b border-border/40">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base font-semibold">
									Extracted Links ({extractedUrls.length})
								</CardTitle>
								<span className="text-xs text-muted-foreground">
									Sanitized & ready to copy
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-0 divide-y divide-border/40 max-h-[460px] overflow-y-auto">
							{extractedUrls.map((urlData) => (
								<div
									key={urlData.id}
									className="flex items-center justify-between p-3 px-4 hover:bg-muted/20 transition-colors gap-3"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<Badge
												variant={urlData.isValid ? "secondary" : "destructive"}
												className="text-[10px] h-5 font-normal px-1.5"
											>
												{urlData.isValid ? "Valid" : "Invalid"}
											</Badge>
											<span className="text-xs font-medium text-muted-foreground truncate">
												{urlData.domain}
											</span>
										</div>
										<div className="font-mono text-xs text-foreground truncate select-all">
											{urlData.normalized}
										</div>
										{urlData.original !== urlData.normalized && (
											<div className="text-[11px] text-muted-foreground truncate mt-0.5">
												Raw: {urlData.original}
											</div>
										)}
									</div>
									<div className="flex items-center gap-1.5 shrink-0">
										{urlData.isValid && (
											<Button
												onClick={() => openUrl(urlData.normalized)}
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
												title="Open in new tab"
											>
												<ExternalLink className="h-3.5 w-3.5" />
											</Button>
										)}
										<Button
											onClick={() => copyUrl(urlData.normalized)}
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
											title="Copy URL"
										>
											<Copy className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
