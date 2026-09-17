"use client";

import { AlertCircle, Check, Copy, Download, Phone } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WhatsAppDPDownloaderTool() {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [dpUrl, setDpUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const extractWhatsAppDP = async () => {
		if (!phoneNumber.trim()) {
			toast.error("Please enter a phone number");
			return;
		}

		// Clean phone number (remove spaces, hyphens, etc.)
		const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

		if (!cleanNumber.startsWith("+")) {
			toast.error("Please include country code (e.g., +1234567890)");
			return;
		}

		setLoading(true);
		try {
			// Generate WhatsApp profile picture URL
			// Note: This is a simplified version. In production, you'd need proper API integration
			const whatsappDPUrl = `https://web.whatsapp.com/pp?phone=${cleanNumber.substring(1)}&type=image`;
			setDpUrl(whatsappDPUrl);
			toast.success("Profile picture URL generated!");
		} catch (error) {
			toast.error("Error generating profile picture URL");
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(dpUrl);
			setCopied(true);
			toast.success("URL copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy URL");
		}
	};

	const downloadImage = () => {
		if (!dpUrl) return;

		const link = document.createElement("a");
		link.href = dpUrl;
		link.download = `whatsapp_dp_${phoneNumber.replace(/[^\d]/g, "")}.jpg`;
		link.target = "_blank";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Download started!");
	};

	return (
		<div className="max-w-xl mx-auto space-y-5">
			{/* Main Phone Input Card */}
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold flex items-center gap-2">
						<Phone className="h-4 w-4 text-emerald-500" />
						Target Contact Number
					</CardTitle>
					<CardDescription>
						Enter any international phone number with country code (e.g. +1, +44, +91)
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Input
							id="phone"
							placeholder="+1 234 567 8900"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							className="font-mono text-base h-11"
						/>
					</div>

					<Button
						onClick={extractWhatsAppDP}
						disabled={loading || !phoneNumber.trim()}
						className="w-full font-semibold h-11"
					>
						{loading ? "Resolving Profile..." : "Lookup WhatsApp Avatar"}
					</Button>
				</CardContent>
			</Card>

			{/* Avatar Result Card */}
			{dpUrl && (
				<Card className="border-border/60 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
					<CardContent className="p-6 text-center space-y-4">
						<div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-md bg-muted/40 flex items-center justify-center">
							<img
								src={dpUrl}
								alt="WhatsApp Profile"
								className="w-full h-full object-cover"
								width={128}
								height={128}
								onError={() => toast.error("Could not load profile picture")}
							/>
						</div>

						<div className="space-y-1">
							<div className="font-mono text-sm font-semibold text-foreground">
								{phoneNumber}
							</div>
							<p className="text-xs text-muted-foreground">
								Public profile picture preview
							</p>
						</div>

						<div className="flex items-center justify-center gap-2 pt-2">
							<Button
								onClick={downloadImage}
								size="sm"
								className="font-semibold"
							>
								<Download className="h-4 w-4 mr-1.5" />
								Download Image
							</Button>
							<Button
								onClick={copyToClipboard}
								variant="outline"
								size="sm"
							>
								{copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-500" /> : <Copy className="h-4 w-4 mr-1.5" />}
								{copied ? "Copied" : "Copy URL"}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Notes Banner */}
			<div className="p-4 rounded-xl border border-border/50 bg-muted/20 text-xs space-y-1.5 text-muted-foreground">
				<div className="flex items-center gap-1.5 font-semibold text-foreground">
					<AlertCircle className="h-3.5 w-3.5 text-amber-500" />
					Privacy & Availability Notice
				</div>
				<p>
					Profile picture visibility depends on the user's individual WhatsApp privacy settings (Everyone, My Contacts, or Nobody).
				</p>
			</div>
		</div>
	);
}
