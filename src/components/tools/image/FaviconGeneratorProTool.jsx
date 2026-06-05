"use client";

import React, { useState, useRef } from "react";
import { 
	UploadIcon, 
	DownloadIcon, 
	ImageIcon, 
	CheckCircleIcon, 
	AlertCircleIcon, 
	ZapIcon,
	TrashIcon,
	HelpCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GlassCard, PremiumDropZone } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function FaviconGeneratorProTool() {
	const [imageSrc, setImageSrc] = useState(null);
	const [fileName, setFileName] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const fileInputRef = useRef(null);
	const [dragActive, setDragActive] = useState(false);

	const [sizes, setSizes] = useState([
		{ size: 16, name: "favicon-16x16.png", checked: true, desc: "Legacy browser tabs" },
		{ size: 32, name: "favicon-32x32.png", checked: true, desc: "Standard browser tabs" },
		{ size: 48, name: "favicon-48x48.png", checked: true, desc: "Windows desktop shortcut" },
		{ size: 180, name: "apple-touch-icon.png", checked: true, desc: "iOS home screen" },
		{ size: 192, name: "android-chrome-192x192.png", checked: true, desc: "Android home screen" },
		{ size: 512, name: "android-chrome-512x512.png", checked: true, desc: "PWA splash screen" }
	]);

	const [includeIco, setIncludeIco] = useState(true);

	const handleFile = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file");
			return;
		}
		setFileName(file.name);
		const reader = new FileReader();
		reader.onload = (e) => {
			setImageSrc(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			handleFile(e.target.files[0]);
		}
	};

	const toggleSize = (index) => {
		setSizes((prev) =>
			prev.map((s, idx) => (idx === index ? { ...s, checked: !s.checked } : s))
		);
	};

	const generateFavicons = async () => {
		if (!imageSrc) return;
		setIsGenerating(true);

		try {
			const JSZip = (await import("jszip")).default;
			const zip = new JSZip();
			const img = new Image();

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
				img.src = imageSrc;
			});

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// Generate selected PNG sizes
			const selectedSizes = sizes.filter((s) => s.checked);
			for (const sizeObj of selectedSizes) {
				canvas.width = sizeObj.size;
				canvas.height = sizeObj.size;
				ctx.clearRect(0, 0, sizeObj.size, sizeObj.size);
				ctx.drawImage(img, 0, 0, sizeObj.size, sizeObj.size);

				const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
				zip.file(sizeObj.name, blob);
			}

			// Generate favicon.ico (composed of 16, 32, 48 sizes if supported, or single 32px standard)
			if (includeIco) {
				canvas.width = 32;
				canvas.height = 32;
				ctx.clearRect(0, 0, 32, 32);
				ctx.drawImage(img, 0, 0, 32, 32);

				const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
				// Standard trick: package PNG directly with .ico extension or let the server/browser interpret it
				zip.file("favicon.ico", blob);
			}

			// Add HTML snippet instructions
			const snippet = `<!-- Standard favicon links -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

			zip.file("readme.txt", `Favicon pack generated with SopKit\n\nPlace the generated files in the root directory of your website.\n\nAdd this to your HTML <head>:\n\n${snippet}`);
			zip.file("site.webmanifest", JSON.stringify({
				name: "SopKit App",
				short_name: "App",
				icons: [
					{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
				],
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone"
			}, null, 2));

			const content = await zip.generateAsync({ type: "blob" });
			const url = URL.createObjectURL(content);
			const link = document.createElement("a");
			link.href = url;
			link.download = "favicon_pack_sopkit.zip";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Favicon pack downloaded successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to generate favicon pack");
		} finally {
			setIsGenerating(false);
		}
	};

	const clearAll = () => {
		setImageSrc(null);
		setFileName("");
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<section>
				<PremiumDropZone
					onDrop={handleDrop}
					onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
					onDragLeave={() => setDragActive(false)}
					onClick={() => fileInputRef.current?.click()}
					dragActive={dragActive}
					icon={ImageIcon}
					title="Drop your logo image here"
					subtitle="Accepts PNG, JPG, WebP or SVG format (Square works best)"
				/>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>

				{imageSrc && (
					<div className="mt-8 flex justify-between items-center px-4">
						<div className="flex items-center gap-4">
							<Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full">
								File loaded: {fileName}
							</Badge>
						</div>
						<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
							<TrashIcon className="h-4 w-4 mr-2" />
							Remove File
						</Button>
					</div>
				)}
			</section>

			{imageSrc && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Options Panel */}
					<div className="lg:col-span-7 space-y-6">
						<GlassCard className="p-8">
							<h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
								<ImageIcon className="text-primary w-6 h-6" />
								Configure Sizes
							</h3>

							<div className="space-y-4">
								{sizes.map((s, idx) => (
									<div 
										key={s.size} 
										className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-all"
									>
										<div className="flex flex-col">
											<span className="font-bold text-lg">{s.size}x{s.size} ({s.name})</span>
											<span className="text-sm text-muted-foreground">{s.desc}</span>
										</div>
										<Switch 
											checked={s.checked} 
											onCheckedChange={() => toggleSize(idx)}
											className="scale-110"
										/>
									</div>
								))}

								<div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20 mt-6">
									<div className="flex flex-col">
										<span className="font-bold text-lg text-primary">Include favicon.ico</span>
										<span className="text-sm text-muted-foreground">Standard 32x32 legacy root wrapper</span>
									</div>
									<Switch 
										checked={includeIco} 
										onCheckedChange={setIncludeIco}
										className="scale-110"
									/>
								</div>
							</div>
						</GlassCard>
					</div>

					{/* Image Preview & Output */}
					<div className="lg:col-span-5 space-y-8">
						<GlassCard className="p-8 flex flex-col items-center justify-center text-center">
							<h3 className="text-xl font-bold mb-6">Source Preview</h3>
							<div className="w-40 h-40 bg-muted/20 border border-border/60 rounded-3xl overflow-hidden flex items-center justify-center p-4">
								<img 
									src={imageSrc} 
									alt="Uploaded preview" 
									className="max-w-full max-h-full object-contain rounded-xl"
								/>
							</div>
							<p className="text-sm text-muted-foreground mt-4 max-w-xs">
								Ensure your image is square (1:1 aspect ratio) for best results. Non-square images will be scaled.
							</p>
						</GlassCard>

						<GlassCard className="p-8">
							<Button
								onClick={generateFavicons}
								disabled={isGenerating || !sizes.some((s) => s.checked)}
								className="w-full h-20 rounded-[2rem] text-xl font-black tracking-tighter shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
							>
								{isGenerating ? "GENERATING..." : "GENERATE FAVICONS"}
								<ZapIcon className="w-6 h-6 fill-current" />
							</Button>
						</GlassCard>
					</div>
				</div>
			)}
		</div>
	);
}
