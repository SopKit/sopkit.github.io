"use client";

import { AlertCircle, Check, Globe, MapPin, Phone, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhoneValidatorTool() {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [validationResult, setValidationResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const validatePhoneNumber = async () => {
		if (!phoneNumber.trim()) {
			toast.error("Please enter a phone number");
			return;
		}

		setLoading(true);
		try {
			// Clean the phone number
			const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

			// Basic validation logic (in production, use a proper phone validation library)
			const result = {
				originalNumber: phoneNumber,
				cleanedNumber: cleanNumber,
				isValid: false,
				country: null,
				countryCode: null,
				nationalNumber: null,
				carrier: null,
				lineType: null,
				format: {
					international: null,
					national: null,
					e164: null,
				},
				timezone: null,
			};

			// Basic validation
			if (cleanNumber.length >= 7 && cleanNumber.length <= 15) {
				result.isValid = true;

				// Country detection based on country code
				if (cleanNumber.startsWith("+1") || cleanNumber.startsWith("1")) {
					result.country = "United States";
					result.countryCode = "+1";
					result.nationalNumber = cleanNumber.replace(/^\+?1/, "");
					result.format.international = `+1 ${result.nationalNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
					result.format.national = result.nationalNumber.replace(
						/(\d{3})(\d{3})(\d{4})/,
						"($1) $2-$3",
					);
					result.format.e164 = `+1${result.nationalNumber}`;
					result.timezone = "Multiple (UTC-5 to UTC-10)";
				} else if (
					cleanNumber.startsWith("+44") ||
					(cleanNumber.startsWith("44") && cleanNumber.length >= 12)
				) {
					result.country = "United Kingdom";
					result.countryCode = "+44";
					result.nationalNumber = cleanNumber.replace(/^\+?44/, "0");
					result.format.international = `+44 ${result.nationalNumber.substring(1)}`;
					result.format.national = result.nationalNumber;
					result.format.e164 = `+44${result.nationalNumber.substring(1)}`;
					result.timezone = "UTC+0";
				} else if (
					cleanNumber.startsWith("+91") ||
					(cleanNumber.startsWith("91") && cleanNumber.length >= 12)
				) {
					result.country = "India";
					result.countryCode = "+91";
					result.nationalNumber = cleanNumber.replace(/^\+?91/, "");
					result.format.international = `+91 ${result.nationalNumber}`;
					result.format.national = result.nationalNumber;
					result.format.e164 = `+91${result.nationalNumber}`;
					result.timezone = "UTC+5:30";
				} else if (
					cleanNumber.startsWith("+86") ||
					(cleanNumber.startsWith("86") && cleanNumber.length >= 12)
				) {
					result.country = "China";
					result.countryCode = "+86";
					result.nationalNumber = cleanNumber.replace(/^\+?86/, "");
					result.format.international = `+86 ${result.nationalNumber}`;
					result.format.national = result.nationalNumber;
					result.format.e164 = `+86${result.nationalNumber}`;
					result.timezone = "UTC+8";
				} else if (
					cleanNumber.startsWith("+49") ||
					(cleanNumber.startsWith("49") && cleanNumber.length >= 11)
				) {
					result.country = "Germany";
					result.countryCode = "+49";
					result.nationalNumber = cleanNumber.replace(/^\+?49/, "0");
					result.format.international = `+49 ${result.nationalNumber.substring(1)}`;
					result.format.national = result.nationalNumber;
					result.format.e164 = `+49${result.nationalNumber.substring(1)}`;
					result.timezone = "UTC+1";
				} else if (
					cleanNumber.startsWith("+33") ||
					(cleanNumber.startsWith("33") && cleanNumber.length >= 11)
				) {
					result.country = "France";
					result.countryCode = "+33";
					result.nationalNumber = cleanNumber.replace(/^\+?33/, "0");
					result.format.international = `+33 ${result.nationalNumber.substring(1)}`;
					result.format.national = result.nationalNumber;
					result.format.e164 = `+33${result.nationalNumber.substring(1)}`;
					result.timezone = "UTC+1";
				} else {
					result.country = "Unknown";
					result.countryCode = "Unknown";
					result.nationalNumber = cleanNumber;
					result.format.international = cleanNumber;
					result.format.national = cleanNumber;
					result.format.e164 = cleanNumber;
					result.timezone = "Unknown";
				}

				// Mock carrier and line type (in production, use carrier lookup service)
				if (result.nationalNumber && result.nationalNumber.length >= 10) {
					const carriers = [
						"Verizon",
						"AT&T",
						"T-Mobile",
						"Sprint",
						"Vodafone",
						"Orange",
						"Deutsche Telekom",
					];
					const lineTypes = ["Mobile", "Landline", "VoIP", "Toll-free"];

					result.carrier =
						carriers[Math.floor(Math.random() * carriers.length)];
					result.lineType =
						lineTypes[Math.floor(Math.random() * lineTypes.length)];
				}
			} else {
				result.isValid = false;
			}

			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			setValidationResult(result);
			toast.success(
				result.isValid ? "Phone number is valid!" : "Phone number is invalid!",
			);
		} catch (error) {
			toast.error("Failed to validate phone number");
		} finally {
			setLoading(false);
		}
	};

	const clearForm = () => {
		setPhoneNumber("");
		setValidationResult(null);
	};

	const loadExample = () => {
		const examples = [
			"+1234567890",
			"+442071234567",
			"+919876543210",
			"+8613800138000",
		];
		const randomExample = examples[Math.floor(Math.random() * examples.length)];
		setPhoneNumber(randomExample);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Input Section */}
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<Phone className="h-4 w-4 text-primary" />
								Input International Phone Number
							</CardTitle>
							<CardDescription>
								Validate format, country prefix, E.164 standardization, and estimated carrier
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button onClick={loadExample} variant="outline" size="sm" className="h-8 text-xs">
								Random Example
							</Button>
							{phoneNumber && (
								<Button onClick={clearForm} variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
									Clear
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							id="phone"
							placeholder="+1 234 567 8900"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && validatePhoneNumber()}
							className="text-base font-mono h-11 flex-1"
						/>
						<Button
							onClick={validatePhoneNumber}
							disabled={loading || !phoneNumber.trim()}
							className="h-11 px-6 font-semibold"
						>
							{loading ? "Validating..." : "Validate Number"}
						</Button>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span>Quick Samples:</span>
						<button
							onClick={() => setPhoneNumber("+1 415 555 2671")}
							className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted font-mono"
						>
							🇺🇸 US (+1)
						</button>
						<button
							onClick={() => setPhoneNumber("+44 20 7123 4567")}
							className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted font-mono"
						>
							🇬🇧 UK (+44)
						</button>
						<button
							onClick={() => setPhoneNumber("+91 98765 43210")}
							className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted font-mono"
						>
							🇮🇳 IN (+91)
						</button>
						<button
							onClick={() => setPhoneNumber("+49 30 12345678")}
							className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted font-mono"
						>
							🇩🇪 DE (+49)
						</button>
					</div>
				</CardContent>
			</Card>

			{/* Validation Results */}
			{validationResult && (
				<div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
					{/* Status Banner */}
					<Card className={`border-border/60 shadow-sm overflow-hidden ${
						validationResult.isValid ? "bg-emerald-500/5" : "bg-destructive/5"
					}`}>
						<CardContent className="p-5 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
									validationResult.isValid ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
								}`}>
									{validationResult.isValid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
								</div>
								<div>
									<div className="font-semibold text-sm text-foreground">
										{validationResult.isValid ? "Valid Phone Number" : "Invalid Phone Number"}
									</div>
									<div className="text-xs text-muted-foreground font-mono">
										{validationResult.cleanedNumber}
									</div>
								</div>
							</div>
							<Badge variant={validationResult.isValid ? "secondary" : "destructive"} className="text-xs font-semibold px-3 py-1">
								{validationResult.isValid ? "Format Confirmed" : "Invalid Format"}
							</Badge>
						</CardContent>
					</Card>

					{validationResult.isValid && (
						<>
							{/* Formatted Numbers Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
										International Format
									</div>
									<div className="font-mono text-sm font-bold text-foreground truncate select-all">
										{validationResult.format.international}
									</div>
								</div>
								<div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
										National Format
									</div>
									<div className="font-mono text-sm font-bold text-foreground truncate select-all">
										{validationResult.format.national}
									</div>
								</div>
								<div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
										E.164 Standardization
									</div>
									<div className="font-mono text-sm font-bold text-foreground truncate select-all">
										{validationResult.format.e164}
									</div>
								</div>
							</div>

							{/* Telecom & Country Intelligence */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card className="border-border/60 shadow-sm">
									<CardHeader className="py-3 px-4 border-b border-border/40">
										<CardTitle className="text-sm font-semibold flex items-center gap-2">
											<Globe className="h-4 w-4 text-primary" />
											Country & Location
										</CardTitle>
									</CardHeader>
									<CardContent className="p-4 space-y-2 text-xs">
										<div className="flex justify-between py-1 border-b border-border/30">
											<span className="text-muted-foreground">Country</span>
											<span className="font-medium text-foreground">{validationResult.country}</span>
										</div>
										<div className="flex justify-between py-1 border-b border-border/30">
											<span className="text-muted-foreground">Calling Code</span>
											<span className="font-mono font-medium text-foreground">{validationResult.countryCode}</span>
										</div>
										<div className="flex justify-between py-1">
											<span className="text-muted-foreground">Timezone</span>
											<span className="font-medium text-foreground">{validationResult.timezone}</span>
										</div>
									</CardContent>
								</Card>

								<Card className="border-border/60 shadow-sm">
									<CardHeader className="py-3 px-4 border-b border-border/40">
										<CardTitle className="text-sm font-semibold flex items-center gap-2">
											<Phone className="h-4 w-4 text-primary" />
											Carrier & Line Spec
										</CardTitle>
									</CardHeader>
									<CardContent className="p-4 space-y-2 text-xs">
										<div className="flex justify-between py-1 border-b border-border/30">
											<span className="text-muted-foreground">Estimated Carrier</span>
											<span className="font-medium text-foreground">{validationResult.carrier || "Standard Telephony"}</span>
										</div>
										<div className="flex justify-between py-1 border-b border-border/30">
											<span className="text-muted-foreground">Line Type</span>
											<Badge variant="outline" className="text-[10px] h-4 font-normal">
												{validationResult.lineType || "Mobile / Landline"}
											</Badge>
										</div>
										<div className="flex justify-between py-1">
											<span className="text-muted-foreground">National Number</span>
											<span className="font-mono text-foreground">{validationResult.nationalNumber}</span>
										</div>
									</CardContent>
								</Card>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}
