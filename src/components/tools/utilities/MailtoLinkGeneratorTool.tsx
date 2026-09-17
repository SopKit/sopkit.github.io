"use client";

import { Check, Copy, ExternalLink, Link, Mail } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function MailtoLinkGeneratorTool() {
	const [formData, setFormData] = useState({
		email: "",
		cc: "",
		bcc: "",
		subject: "",
		body: "",
	});
	const [generatedLink, setGeneratedLink] = useState("");
	const [copied, setCopied] = useState(false);

	const generateMailtoLink = () => {
		if (!formData.email.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		let link = `mailto:${formData.email}`;
		const params = [];

		if (formData.cc.trim()) {
			params.push(`cc=${encodeURIComponent(formData.cc)}`);
		}

		if (formData.bcc.trim()) {
			params.push(`bcc=${encodeURIComponent(formData.bcc)}`);
		}

		if (formData.subject.trim()) {
			params.push(`subject=${encodeURIComponent(formData.subject)}`);
		}

		if (formData.body.trim()) {
			params.push(`body=${encodeURIComponent(formData.body)}`);
		}

		if (params.length > 0) {
			link += `?${params.join("&")}`;
		}

		setGeneratedLink(link);
		toast.success("Mailto link generated successfully!");
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedLink);
			setCopied(true);
			toast.success("Link copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const testEmailLink = () => {
		if (generatedLink) {
			window.location.href = generatedLink;
		}
	};

	const copyHtmlCode = async () => {
		if (!generatedLink) return;

		const htmlCode = `<a href="${generatedLink}">Send Email</a>`;
		try {
			await navigator.clipboard.writeText(htmlCode);
			toast.success("HTML code copied to clipboard!");
		} catch (error) {
			toast.error("Failed to copy HTML code");
		}
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear generated link when form changes
		if (generatedLink) {
			setGeneratedLink("");
		}
	};

	const clearForm = () => {
		setFormData({
			email: "",
			cc: "",
			bcc: "",
			subject: "",
			body: "",
		});
		setGeneratedLink("");
		toast.success("Form cleared!");
	};

	const loadExample = () => {
		setFormData({
			email: "contact@example.com",
			cc: "team@example.com",
			bcc: "",
			subject: "Inquiry about your services",
			body: "Hello,\n\nI would like to inquire about your services. Please provide more information.\n\nThank you!",
		});
		toast.success("Example data loaded!");
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Form Composer Card */}
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<Mail className="h-4 w-4 text-primary" />
								Compose Mailto Link
							</CardTitle>
							<CardDescription>
								Define recipient, subject, carbon copies, and pre-written message body
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button onClick={loadExample} variant="outline" size="sm" className="h-8 text-xs">
								Example
							</Button>
							{(formData.email || formData.subject || formData.body) && (
								<Button onClick={clearForm} variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
									Clear
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Primary Recipient */}
					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-xs font-medium">
							To (Primary Recipient) *
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="hello@example.com"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							className="font-mono text-sm"
						/>
					</div>

					{/* CC & BCC Row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="cc" className="text-xs font-medium text-muted-foreground">
								CC (Carbon Copy)
							</Label>
							<Input
								id="cc"
								type="email"
								placeholder="team@example.com"
								value={formData.cc}
								onChange={(e) => handleInputChange("cc", e.target.value)}
								className="font-mono text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="bcc" className="text-xs font-medium text-muted-foreground">
								BCC (Blind Carbon Copy)
							</Label>
							<Input
								id="bcc"
								type="email"
								placeholder="archive@example.com"
								value={formData.bcc}
								onChange={(e) => handleInputChange("bcc", e.target.value)}
								className="font-mono text-xs"
							/>
						</div>
					</div>

					{/* Subject */}
					<div className="space-y-1.5">
						<Label htmlFor="subject" className="text-xs font-medium">
							Email Subject Line
						</Label>
						<Input
							id="subject"
							placeholder="e.g. Partnership Request or Product Question"
							value={formData.subject}
							onChange={(e) => handleInputChange("subject", e.target.value)}
							className="text-sm"
						/>
					</div>

					{/* Body */}
					<div className="space-y-1.5">
						<Label htmlFor="body" className="text-xs font-medium">
							Email Body Template
						</Label>
						<Textarea
							id="body"
							placeholder="Write the pre-filled message text here..."
							value={formData.body}
							onChange={(e) => handleInputChange("body", e.target.value)}
							rows={4}
							className="text-sm resize-y font-sans"
						/>
					</div>

					<Button
						onClick={generateMailtoLink}
						disabled={!formData.email.trim()}
						className="w-full font-semibold h-10 mt-2"
					>
						<Link className="h-4 w-4 mr-2" />
						Generate Mailto URL & HTML Code
					</Button>
				</CardContent>
			</Card>

			{/* Generated Output Card */}
			{generatedLink && (
				<Card className="border-border/60 shadow-sm animate-in fade-in zoom-in-95 duration-200">
					<CardHeader className="py-3 px-4 border-b border-border/40">
						<div className="flex items-center justify-between">
							<CardTitle className="text-sm font-semibold">
								Generated Mailto Codes
							</CardTitle>
							<Button
								onClick={testEmailLink}
								size="sm"
								variant="outline"
								className="h-7 text-xs font-medium"
							>
								<ExternalLink className="h-3.5 w-3.5 mr-1" />
								Test In Email App
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-4 space-y-4">
						{/* Raw URL */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Mailto URI (For buttons, redirects, and raw links)</span>
								<Button
									onClick={copyToClipboard}
									variant="ghost"
									size="sm"
									className="h-6 text-xs px-2"
								>
									{copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
									{copied ? "Copied" : "Copy Link"}
								</Button>
							</div>
							<Input
								value={generatedLink}
								readOnly
								className="font-mono text-xs select-all bg-muted/20"
							/>
						</div>

						{/* HTML Snippet */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>HTML Anchor Tag (For website source code)</span>
								<Button
									onClick={copyHtmlCode}
									variant="ghost"
									size="sm"
									className="h-6 text-xs px-2"
								>
									<Copy className="h-3.5 w-3.5 mr-1" />
									Copy HTML
								</Button>
							</div>
							<Input
								value={`<a href="${generatedLink}">Send Email</a>`}
								readOnly
								className="font-mono text-xs select-all bg-muted/20"
							/>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
