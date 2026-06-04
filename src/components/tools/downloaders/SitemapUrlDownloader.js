"use client";

import { useState } from "react";
import { 
	AlertCircle, 
	Download, 
	Search, 
	Loader2, 
	Copy, 
	FileText, 
	List, 
	Globe,
	FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SitemapUrlDownloader() {
	const [url, setUrl] = useState("");
	const [xmlText, setXmlText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [urls, setUrls] = useState([]);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("url"); // "url" or "paste"
	const [searchTerm, setSearchTerm] = useState("");

	const extractUrlsFromXml = (xmlString) => {
		try {
			// Basic XML parsing using DOMParser
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xmlString, "application/xml");
			
			// Check if parsing failed
			const parserError = xmlDoc.querySelector("parsererror");
			if (parserError) {
				// If XML parsing failed, fallback to regex extraction of <loc> tags
				return extractUrlsViaRegex(xmlString);
			}

			const locElements = xmlDoc.getElementsByTagName("loc");
			const extracted = [];
			for (let i = 0; i < locElements.length; i++) {
				const val = locElements[i].textContent?.trim();
				if (val && val.startsWith("http")) {
					extracted.push(val);
				}
			}
			return extracted;
		} catch (err) {
			return extractUrlsViaRegex(xmlString);
		}
	};

	const extractUrlsViaRegex = (text) => {
		const locRegex = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
		const extracted = [];
		let match;
		while ((match = locRegex.exec(text)) !== null) {
			extracted.push(match[1].trim());
		}
		// Try raw URLs if no loc tags found
		if (extracted.length === 0) {
			const urlRegex = /(https?:\/\/[^\s"'<>\(\)]+)/gi;
			let urlMatch;
			while ((urlMatch = urlRegex.exec(text)) !== null) {
				const candidate = urlMatch[1].trim();
				// Clean trailing punctuation
				const cleaned = candidate.replace(/[\.,;\?!\)]$/, "");
				if (cleaned && (cleaned.includes(".") || cleaned.includes("localhost"))) {
					extracted.push(cleaned);
				}
			}
		}
		return [...new Set(extracted)]; // Unique URLs
	};

	const handleFetchSitemap = async () => {
		if (!url.trim()) {
			setError("Please enter a sitemap URL");
			return;
		}
		setIsLoading(true);
		setError("");
		setUrls([]);
		
		try {
			// First try a proxy or direct fetch
			let response;
			try {
				response = await fetch(url.trim(), { mode: "cors" });
			} catch (corsErr) {
				// Fallback to proxy
				response = await fetch("/api/proxy/universal", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url: url.trim() }),
				});
			}

			if (!response.ok) {
				throw new Error("Failed to fetch the sitemap. Please verify the URL or try pasting the sitemap XML content directly below.");
			}

			const text = await response.text();
			let parsedXml = text;
			
			// If it came back from our JSON proxy, it might be JSON wrapped
			if (text.startsWith("{")) {
				try {
					const data = JSON.parse(text);
					if (data.content) {
						parsedXml = data.content;
					} else if (data.html) {
						parsedXml = data.html;
					}
				} catch (e) {
					// Ignore json parse error
				}
			}

			const extracted = extractUrlsFromXml(parsedXml);
			if (extracted.length === 0) {
				throw new Error("No URLs found in the sitemap content. Make sure it is a valid XML sitemap.");
			}

			setUrls(extracted);
			toast.success(`Successfully extracted ${extracted.length} URLs!`);
		} catch (err) {
			setError(err.message || "Failed to fetch sitemap. Please check your internet connection or paste the sitemap XML directly.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleExtractFromPaste = () => {
		if (!xmlText.trim()) {
			setError("Please paste sitemap XML content");
			return;
		}
		setIsLoading(true);
		setError("");
		setUrls([]);

		try {
			const extracted = extractUrlsFromXml(xmlText);
			if (extracted.length === 0) {
				throw new Error("No URLs found in the pasted content. Make sure it contains valid URLs or <loc> elements.");
			}
			setUrls(extracted);
			toast.success(`Successfully extracted ${extracted.length} URLs!`);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyToClipboard = () => {
		if (urls.length === 0) return;
		const text = urls.join("\n");
		navigator.clipboard.writeText(text);
		toast.success("All URLs copied to clipboard!");
	};

	const handleDownloadTxt = () => {
		if (urls.length === 0) return;
		const text = urls.join("\n");
		const blob = new Blob([text], { type: "text/plain" });
		const fileUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = fileUrl;
		a.download = "sitemap-urls.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(fileUrl);
		toast.success("Downloaded sitemap-urls.txt successfully!");
	};

	const filteredUrls = urls.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			<Card className="border-border/40 bg-card shadow-lg rounded-2xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-bold">
						<Globe className="h-5 w-5 text-blue-500" />
						Sitemap URL Extractor
					</CardTitle>
					<CardDescription>
						Extract and download all URL paths from any XML sitemap index or sitemap file.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/40 w-fit">
						<Button 
							variant={activeTab === "url" ? "secondary" : "ghost"}
							onClick={() => { setActiveTab("url"); setError(""); }}
							className="rounded-lg font-bold text-sm h-9 px-4"
						>
							<Globe className="h-4 w-4 mr-2" />
							Extract from URL
						</Button>
						<Button 
							variant={activeTab === "paste" ? "secondary" : "ghost"}
							onClick={() => { setActiveTab("paste"); setError(""); }}
							className="rounded-lg font-bold text-sm h-9 px-4"
						>
							<FileCode className="h-4 w-4 mr-2" />
							Paste XML Content
						</Button>
					</div>

					{activeTab === "url" ? (
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row gap-3">
								<Input 
									type="url" 
									placeholder="e.g., https://example.com/sitemap.xml" 
									value={url} 
									onChange={(e) => setUrl(e.target.value)} 
									className="flex-1 rounded-xl h-11 border-border/40 focus-visible:ring-blue-500/20" 
								/>
								<Button 
									onClick={handleFetchSitemap} 
									disabled={isLoading} 
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/10 shrink-0"
								>
									{isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
									Extract URLs
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								Note: Direct fetching is subject to target domain CORS policies. If fetching fails, copy-paste the sitemap XML instead.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							<Textarea 
								placeholder="Paste sitemap XML here... (e.g. <urlset>...<url><loc>https://...</loc></url>... </urlset>)"
								value={xmlText}
								onChange={(e) => setXmlText(e.target.value)}
								className="min-h-[180px] font-mono text-xs rounded-xl border-border/40 focus-visible:ring-blue-500/20 p-4"
							/>
							<Button 
								onClick={handleExtractFromPaste} 
								disabled={isLoading}
								className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/10"
							>
								{isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
								Extract URLs from XML
							</Button>
						</div>
					)}

					{error && (
						<div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-destructive">
							<AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
							<div className="text-sm font-medium">{error}</div>
						</div>
					)}

					{urls.length > 0 && (
						<div className="space-y-4 border-t border-border/40 pt-6 animate-in fade-in duration-300">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<List className="h-5 w-5 text-muted-foreground" />
									<h4 className="text-lg font-bold">Extracted Links</h4>
									<Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold px-3">
										{urls.length} URLs Found
									</Badge>
								</div>
								<div className="flex gap-2">
									<Button 
										variant="outline" 
										onClick={handleCopyToClipboard}
										className="h-10 px-4 rounded-xl border-border/40 font-bold text-sm"
									>
										<Copy className="h-4 w-4 mr-2" />
										Copy List
									</Button>
									<Button 
										variant="outline" 
										onClick={handleDownloadTxt}
										className="h-10 px-4 rounded-xl border-border/40 font-bold text-sm"
									>
										<Download className="h-4 w-4 mr-2" />
										Download TXT
									</Button>
								</div>
							</div>

							<div className="relative">
								<Input 
									type="text" 
									placeholder="Filter extracted URLs..." 
									value={searchTerm} 
									onChange={(e) => setSearchTerm(e.target.value)} 
									className="rounded-xl h-10 border-border/40 mb-3" 
								/>
							</div>

							<div className="max-h-[350px] overflow-y-auto border border-border/40 rounded-xl bg-muted/5 custom-scrollbar p-3">
								<ul className="space-y-2 font-mono text-xs text-muted-foreground">
									{filteredUrls.map((u, i) => (
										<li key={i} className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-colors border-b border-border/10 last:border-0 truncate">
											<span className="text-muted-foreground/45 font-bold w-8 text-right select-none">{i + 1}.</span>
											<a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline truncate">
												{u}
											</a>
										</li>
									))}
									{filteredUrls.length === 0 && (
										<li className="text-center p-8 text-muted-foreground italic">
											No URLs match your search filter.
										</li>
									)}
								</ul>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
