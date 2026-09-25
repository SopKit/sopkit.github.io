"use client";

import React, { useState, useRef } from "react";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
} from "@/components/tools/shared/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Printer, Upload, Trash2, Heart, Briefcase, RotateCcw, Download, ShieldCheck } from "lucide-react";

type BioMode = "marriage" | "job";
type ThemeStyle = "royal" | "rose" | "classic";

export default function BioDataMaker() {
	const [mode, setMode] = useState<BioMode>("marriage");
	const [theme, setTheme] = useState<ThemeStyle>("royal");
	const [includeHeaderMotto, setIncludeHeaderMotto] = useState(true);
	const [headerMotto, setHeaderMotto] = useState("|| Shree Ganeshay Namah ||");

	// Personal Details
	const [fullName, setFullName] = useState("Rajesh Kumar Sharma");
	const [dob, setDob] = useState("1996-08-15");
	const [tob, setTob] = useState("08:45 AM");
	const [pob, setPob] = useState("New Delhi, India");
	const [height, setHeight] = useState("5 ft 9 in (175 cm)");
	const [complexion, setComplexion] = useState("Fair");
	const [motherTongue, setMotherTongue] = useState("Hindi");
	const [bloodGroup, setBloodGroup] = useState("B+");

	// Horoscope (Marriage)
	const [showAstro, setShowAstro] = useState(true);
	const [rashi, setRashi] = useState("Leo (सिंह)");
	const [nakshatra, setNakshatra] = useState("Purva Phalguni");
	const [gotra, setGotra] = useState("Kashyap");
	const [manglik, setManglik] = useState("No");

	// Education & Career
	const [education, setEducation] = useState("B.Tech in Computer Science (IIT Delhi)");
	const [occupation, setOccupation] = useState("Senior Software Engineer at Google");
	const [company, setCompany] = useState("Google India Pvt Ltd");
	const [salary, setSalary] = useState("32 LPA");

	// Family Background (Marriage)
	const [fatherName, setFatherName] = useState("Mr. Ramesh Kumar Sharma");
	const [fatherOcc, setFatherOcc] = useState("Gazetted Officer (Retired, CPWD)");
	const [motherName, setMotherName] = useState("Mrs. Sunita Devi");
	const [motherOcc, setMotherOcc] = useState("Homemaker");
	const [siblings, setSiblings] = useState("1 Elder Brother (Married, Software Architect), 1 Younger Sister (Pursuing MBA)");
	const [familyType, setFamilyType] = useState("Nuclear Family, Upper Middle Class");
	const [nativePlace, setNativePlace] = useState("Jaipur, Rajasthan");

	// Job Mode Fields
	const [summary, setSummary] = useState("Results-driven Software Engineer with 5+ years of experience designing high-throughput distributed systems, modern React web applications, and resilient cloud architectures.");
	const [skills, setSkills] = useState("TypeScript, React, Next.js, Node.js, Go, PostgreSQL, Redis, Docker, Kubernetes, AWS");
	const [experience, setExperience] = useState("Senior Software Engineer at TechCorp (2022 - Present):\n• Led migration of legacy monolithic app to micro-frontends, cutting page load by 48%.\n• Mentored 6 junior engineers and authored core UI component library.\n\nFull-Stack Developer at InnoSoft (2019 - 2022):\n• Developed customer billing workflows serving 200,000 active monthly subscribers.");

	// Contact
	const [contactPerson, setContactPerson] = useState("Mr. Ramesh Sharma (Father)");
	const [phone, setPhone] = useState("+91 98765 43210");
	const [email, setEmail] = useState("rajesh.sharma.contact@email.com");
	const [address, setAddress] = useState("Sector 62, Noida, Uttar Pradesh - 201309");

	// Profile Photo
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [photoUrl, setPhotoUrl] = useState<string>("");

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 3 * 1024 * 1024) {
				toast.error("Photo size should be under 3MB.");
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) {
					setPhotoUrl(event.target.result as string);
					toast.success("Photo uploaded successfully.");
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const removePhoto = () => {
		setPhotoUrl("");
		if (photoInputRef.current) photoInputRef.current.value = "";
	};

	const handlePrint = () => {
		window.print();
	};

	const handleReset = () => {
		setFullName("Rajesh Kumar Sharma");
		setDob("1996-08-15");
		setTob("08:45 AM");
		setPob("New Delhi, India");
		setEducation("B.Tech in Computer Science");
		setOccupation("Senior Software Engineer");
		setPhotoUrl("");
		toast.info("Form reset to template defaults.");
	};

	const exportJson = () => {
		const data = {
			mode,
			theme,
			fullName,
			dob,
			tob,
			pob,
			height,
			complexion,
			motherTongue,
			bloodGroup,
			showAstro,
			rashi,
			nakshatra,
			gotra,
			manglik,
			education,
			occupation,
			company,
			salary,
			fatherName,
			fatherOcc,
			motherName,
			motherOcc,
			siblings,
			familyType,
			nativePlace,
			summary,
			skills,
			experience,
			contactPerson,
			phone,
			email,
			address,
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `biodata-${fullName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Saved backup ${link.download}`);
	};

	return (
		<ToolShell>
			{/* Print stylesheet override */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
						@media print {
							body * {
								visibility: hidden;
							}
							#biodata-paper-zone, #biodata-paper-zone * {
								visibility: visible;
							}
							#biodata-paper-zone {
								position: absolute;
								left: 0;
								top: 0;
								width: 100%;
								box-shadow: none !important;
								border: none !important;
								padding: 0 !important;
							}
							.no-print {
								display: none !important;
							}
						}
					`,
				}}
			/>

			{/* Top Action Command Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant={mode === "marriage" ? "default" : "outline"}
						onClick={() => setMode("marriage")}
						className="rounded-full gap-1.5"
					>
						<Heart className="h-4 w-4 text-rose-500" /> Marriage Biodata
					</Button>
					<Button
						size="sm"
						variant={mode === "job" ? "default" : "outline"}
						onClick={() => setMode("job")}
						className="rounded-full gap-1.5"
					>
						<Briefcase className="h-4 w-4 text-indigo-500" /> Job / CV Resume
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Button size="sm" onClick={handlePrint} className="gap-2 font-semibold shadow-sm">
						<Printer className="h-4 w-4" /> Print / Save as PDF
					</Button>
					<Button variant="outline" size="sm" onClick={exportJson} className="gap-1.5 text-xs">
						<Download className="h-3.5 w-3.5" /> Save JSON Backup
					</Button>
					<Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs text-muted-foreground">
						<RotateCcw className="h-3.5 w-3.5" /> Reset
					</Button>
				</div>
			</div>

			<ToolGrid>
				{/* Left Configuration Column */}
				<ToolGridMain>
					{/* Style & Theme Settings */}
					<ToolPanel className="no-print">
						<ToolSectionTitle
							title="Format & Visual Theme"
							description="Choose color palette and header styling."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Color Theme">
								<Select value={theme} onValueChange={(val: ThemeStyle) => setTheme(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Theme" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="royal">Royal Maroon & Gold (Traditional)</SelectItem>
										<SelectItem value="rose">Soft Rose & Slate (Modern Elegant)</SelectItem>
										<SelectItem value="classic">Classic Navy (Corporate / Minimalist)</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>

							{mode === "marriage" && (
								<ToolField label="Header Motto">
									<Input value={headerMotto} onChange={(e) => setHeaderMotto(e.target.value)} />
								</ToolField>
							)}
						</div>
					</ToolPanel>

					{/* Personal Details */}
					<ToolPanel className="mt-6 no-print">
						<ToolSectionTitle
							title="Personal Details"
							description="Basic identity, physical attributes, and portrait photo."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Full Name">
								<Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
							</ToolField>
							<ToolField label="Date of Birth">
								<Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
							<ToolField label="Time of Birth">
								<Input value={tob} onChange={(e) => setTob(e.target.value)} placeholder="e.g. 08:45 AM" />
							</ToolField>
							<ToolField label="Place of Birth">
								<Input value={pob} onChange={(e) => setPob(e.target.value)} placeholder="e.g. New Delhi" />
							</ToolField>
							<ToolField label="Height">
								<Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 5 ft 9 in" />
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
							<ToolField label="Complexion">
								<Input value={complexion} onChange={(e) => setComplexion(e.target.value)} placeholder="e.g. Fair / Wheatish" />
							</ToolField>
							<ToolField label="Mother Tongue">
								<Input value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} placeholder="e.g. Hindi" />
							</ToolField>
							<ToolField label="Blood Group">
								<Input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. B+" />
							</ToolField>
						</div>

						<div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
							<input
								ref={photoInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handlePhotoUpload}
							/>
							<Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} className="gap-1.5 text-xs">
								<Upload className="h-3.5 w-3.5" /> {photoUrl ? "Change Photograph" : "Upload Photograph"}
							</Button>
							{photoUrl && (
								<Button variant="ghost" size="sm" onClick={removePhoto} className="text-xs text-destructive">
									<Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Photo
								</Button>
							)}
						</div>
					</ToolPanel>

					{/* Horoscope / Astro Details (Marriage Mode Only) */}
					{mode === "marriage" && (
						<ToolPanel className="mt-6 no-print">
							<div className="flex items-center justify-between mb-4">
								<ToolSectionTitle
									title="Astrological & Horoscope Information"
									description="Rashi, Nakshatra, Gotra, and Manglik details."
								/>
								<div className="flex items-center gap-2">
									<Label htmlFor="astro-toggle" className="text-xs cursor-pointer">Include Horoscope</Label>
									<Switch id="astro-toggle" checked={showAstro} onCheckedChange={setShowAstro} />
								</div>
							</div>

							{showAstro && (
								<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
									<ToolField label="Rashi (Moon Sign)">
										<Input value={rashi} onChange={(e) => setRashi(e.target.value)} placeholder="e.g. Leo" />
									</ToolField>
									<ToolField label="Nakshatra">
										<Input value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} placeholder="e.g. Purva Phalguni" />
									</ToolField>
									<ToolField label="Gotra">
										<Input value={gotra} onChange={(e) => setGotra(e.target.value)} placeholder="e.g. Kashyap" />
									</ToolField>
									<ToolField label="Manglik">
										<Select value={manglik} onValueChange={setManglik}>
											<SelectTrigger>
												<SelectValue placeholder="Manglik" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="No">No (Non-Manglik)</SelectItem>
												<SelectItem value="Yes">Yes (Manglik)</SelectItem>
												<SelectItem value="Anshik">Anshik (Partial)</SelectItem>
												<SelectItem value="Don't Know">Not Known</SelectItem>
											</SelectContent>
										</Select>
									</ToolField>
								</div>
							)}
						</ToolPanel>
					)}

					{/* Education & Professional Details */}
					<ToolPanel className="mt-6 no-print">
						<ToolSectionTitle
							title="Education & Profession"
							description="Academic achievements, company, and annual package."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Highest Education">
								<Input value={education} onChange={(e) => setEducation(e.target.value)} />
							</ToolField>
							<ToolField label="Current Occupation / Designation">
								<Input value={occupation} onChange={(e) => setOccupation(e.target.value)} />
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Organization / Employer">
								<Input value={company} onChange={(e) => setCompany(e.target.value)} />
							</ToolField>
							<ToolField label="Annual Income / Package">
								<Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 18 LPA or $120,000" />
							</ToolField>
						</div>
					</ToolPanel>

					{/* Family Background (Marriage Mode Only) */}
					{mode === "marriage" && (
						<ToolPanel className="mt-6 no-print">
							<ToolSectionTitle
								title="Family Background"
								description="Parents' details, siblings, and native origin."
							/>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<ToolField label="Father's Full Name">
									<Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
								</ToolField>
								<ToolField label="Father's Occupation">
									<Input value={fatherOcc} onChange={(e) => setFatherOcc(e.target.value)} />
								</ToolField>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<ToolField label="Mother's Full Name">
									<Input value={motherName} onChange={(e) => setMotherName(e.target.value)} />
								</ToolField>
								<ToolField label="Mother's Occupation">
									<Input value={motherOcc} onChange={(e) => setMotherOcc(e.target.value)} />
								</ToolField>
							</div>

							<div className="mt-4">
								<ToolField label="Brothers & Sisters">
									<Input value={siblings} onChange={(e) => setSiblings(e.target.value)} />
								</ToolField>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<ToolField label="Family Type / Values">
									<Input value={familyType} onChange={(e) => setFamilyType(e.target.value)} />
								</ToolField>
								<ToolField label="Native Place / Hometown">
									<Input value={nativePlace} onChange={(e) => setNativePlace(e.target.value)} />
								</ToolField>
							</div>
						</ToolPanel>
					)}

					{/* Professional Details (Job Mode Only) */}
					{mode === "job" && (
						<ToolPanel className="mt-6 no-print">
							<ToolSectionTitle
								title="Professional Summary & Skills"
								description="Core competencies and chronological experience."
							/>
							<div className="mt-4">
								<ToolField label="Professional Summary">
									<Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="resize-y" />
								</ToolField>
							</div>
							<div className="mt-4">
								<ToolField label="Key Technical Skills">
									<Input value={skills} onChange={(e) => setSkills(e.target.value)} />
								</ToolField>
							</div>
							<div className="mt-4">
								<ToolField label="Work Experience Highlights">
									<Textarea rows={6} value={experience} onChange={(e) => setExperience(e.target.value)} className="resize-y" />
								</ToolField>
							</div>
						</ToolPanel>
					)}

					{/* Contact Details */}
					<ToolPanel className="mt-6 no-print">
						<ToolSectionTitle
							title="Contact & Location Information"
							description="Phone numbers, email address, and home residence."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
							<ToolField label="Contact Person">
								<Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
							</ToolField>
							<ToolField label="Contact Number">
								<Input value={phone} onChange={(e) => setPhone(e.target.value)} />
							</ToolField>
							<ToolField label="Email Address">
								<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
							</ToolField>
						</div>
						<div className="mt-4">
							<ToolField label="Residential Address">
								<Input value={address} onChange={(e) => setAddress(e.target.value)} />
							</ToolField>
						</div>
					</ToolPanel>

					{/* Live Rendered Document Sheet */}
					<ToolPanel className="mt-8">
						<div className="flex items-center justify-between mb-4 no-print">
							<ToolSectionTitle
								title="Document Preview"
								description="Print-ready document formatted with classical typography."
							/>
							<Button size="sm" onClick={handlePrint} className="gap-1.5 font-semibold text-xs">
								<Printer className="h-3.5 w-3.5" /> Print / Save as PDF
							</Button>
						</div>

						{/* Document Container */}
						<div
							id="biodata-paper-zone"
							className={`p-8 sm:p-12 rounded-xl bg-white text-neutral-900 border-2 shadow-2xl font-serif text-xs leading-relaxed ${
								theme === "royal"
									? "border-amber-700/40"
									: theme === "rose"
									? "border-rose-300"
									: "border-slate-300"
							}`}
						>
							{/* Traditional Header Motto */}
							{mode === "marriage" && includeHeaderMotto && (
								<div className="text-center pb-2 mb-4 border-b border-neutral-200">
									<p
										className={`text-sm font-bold tracking-widest ${
											theme === "royal"
												? "text-amber-800"
												: theme === "rose"
												? "text-rose-700"
												: "text-slate-700"
										}`}
									>
										{headerMotto}
									</p>
								</div>
							)}

							{/* Title and Photo Header */}
							<div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-neutral-800">
								<div>
									<h1 className="text-2xl font-bold uppercase tracking-wide text-neutral-950">
										{fullName || "[Full Name]"}
									</h1>
									<p className="text-sm font-sans text-neutral-700 font-medium mt-1">
										{occupation} {company && `at ${company}`}
									</p>
									<p className="text-neutral-500 font-sans text-xs mt-0.5">
										{dob} • {height} • {education}
									</p>
								</div>

								{photoUrl && (
									<div className="shrink-0">
										<img
											src={photoUrl}
											alt={fullName}
											className="h-28 w-24 object-cover rounded-lg border-2 border-neutral-300 shadow-sm"
										/>
									</div>
								)}
							</div>

							{/* Sections */}
							<div className="space-y-6 mt-6">
								{/* Personal Details Section */}
								<div>
									<h3
										className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3 ${
											theme === "royal"
												? "text-amber-800 border-amber-300"
												: theme === "rose"
												? "text-rose-700 border-rose-200"
												: "text-slate-800 border-slate-300"
										}`}
									>
										Personal Information
									</h3>
									<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
										<div><strong className="text-neutral-600">Date of Birth:</strong> {dob}</div>
										<div><strong className="text-neutral-600">Time of Birth:</strong> {tob || "N/A"}</div>
										<div><strong className="text-neutral-600">Place of Birth:</strong> {pob || "N/A"}</div>
										<div><strong className="text-neutral-600">Height:</strong> {height}</div>
										<div><strong className="text-neutral-600">Complexion:</strong> {complexion}</div>
										<div><strong className="text-neutral-600">Mother Tongue:</strong> {motherTongue}</div>
										<div><strong className="text-neutral-600">Blood Group:</strong> {bloodGroup}</div>
									</div>
								</div>

								{/* Horoscope Details (Marriage) */}
								{mode === "marriage" && showAstro && (
									<div>
										<h3
											className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3 ${
												theme === "royal"
													? "text-amber-800 border-amber-300"
													: theme === "rose"
													? "text-rose-700 border-rose-200"
													: "text-slate-800 border-slate-300"
											}`}
										>
											Horoscope &amp; Astrological Details
										</h3>
										<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
											<div><strong className="text-neutral-600">Rashi (Sign):</strong> {rashi}</div>
											<div><strong className="text-neutral-600">Nakshatra:</strong> {nakshatra}</div>
											<div><strong className="text-neutral-600">Gotra:</strong> {gotra}</div>
											<div><strong className="text-neutral-600">Manglik Status:</strong> {manglik}</div>
										</div>
									</div>
								)}

								{/* Education & Career */}
								<div>
									<h3
										className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3 ${
											theme === "royal"
												? "text-amber-800 border-amber-300"
												: theme === "rose"
												? "text-rose-700 border-rose-200"
												: "text-slate-800 border-slate-300"
										}`}
									>
										Education &amp; Career
									</h3>
									<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
										<div><strong className="text-neutral-600">Highest Education:</strong> {education}</div>
										<div><strong className="text-neutral-600">Occupation:</strong> {occupation}</div>
										<div><strong className="text-neutral-600">Employer:</strong> {company || "N/A"}</div>
										<div><strong className="text-neutral-600">Annual Income:</strong> {salary || "N/A"}</div>
									</div>
								</div>

								{/* Family Details (Marriage) */}
								{mode === "marriage" && (
									<div>
										<h3
											className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3 ${
												theme === "royal"
													? "text-amber-800 border-amber-300"
													: theme === "rose"
													? "text-rose-700 border-rose-200"
													: "text-slate-800 border-slate-300"
											}`}
										>
											Family Background
										</h3>
										<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
											<div><strong className="text-neutral-600">Father's Name:</strong> {fatherName}</div>
											<div><strong className="text-neutral-600">Father's Occupation:</strong> {fatherOcc}</div>
											<div><strong className="text-neutral-600">Mother's Name:</strong> {motherName}</div>
											<div><strong className="text-neutral-600">Mother's Occupation:</strong> {motherOcc}</div>
											<div className="col-span-2"><strong className="text-neutral-600">Siblings:</strong> {siblings}</div>
											<div><strong className="text-neutral-600">Family Type:</strong> {familyType}</div>
											<div><strong className="text-neutral-600">Native Place:</strong> {nativePlace}</div>
										</div>
									</div>
								)}

								{/* Professional Summary & Skills (Job Mode) */}
								{mode === "job" && (
									<>
										<div>
											<h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-800">
												Professional Summary
											</h3>
											<p className="text-[11px] text-neutral-700 leading-relaxed">{summary}</p>
										</div>
										<div>
											<h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-800">
												Technical Competencies
											</h3>
											<p className="text-[11px] text-neutral-700 font-mono">{skills}</p>
										</div>
										<div>
											<h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-800">
												Experience Highlights
											</h3>
											<p className="text-[11px] text-neutral-700 whitespace-pre-line leading-relaxed">
												{experience}
											</p>
										</div>
									</>
								)}

								{/* Contact Information */}
								<div>
									<h3
										className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3 ${
											theme === "royal"
												? "text-amber-800 border-amber-300"
												: theme === "rose"
												? "text-rose-700 border-rose-200"
												: "text-slate-800 border-slate-300"
										}`}
									>
										Contact Details
									</h3>
									<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
										<div><strong className="text-neutral-600">Contact Person:</strong> {contactPerson}</div>
										<div><strong className="text-neutral-600">Phone Number:</strong> {phone}</div>
										<div><strong className="text-neutral-600">Email:</strong> {email}</div>
										<div><strong className="text-neutral-600">Address:</strong> {address}</div>
									</div>
								</div>
							</div>
						</div>
					</ToolPanel>
				</ToolGridMain>

				{/* Sidebar Guides */}
				<ToolGridSide>
					<ToolPanel className="no-print">
						<ToolSectionTitle
							title="Biodata Features"
							description="Instant, print-ready document options."
						/>
						<div className="space-y-3 mt-4 text-xs text-muted-foreground leading-relaxed">
							<p>
								<strong>Dual Profiles:</strong> Toggle between traditional Indian Matrimonial Biodata (with Rashi, Nakshatra, and Family pedigree) or standard Job Resume.
							</p>
							<p>
								<strong>Vector A4 Printing:</strong> Formatted to fit comfortably onto one single A4 paper page with sharp serif typography and print CSS layout.
							</p>
						</div>
					</ToolPanel>

					<ToolPanel className="mt-6 no-print">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<ShieldCheck className="h-4 w-4 text-emerald-500" />
								100% Client-Side Privacy
							</h3>
							<p>
								Personal family details, photographs, salary records, and contact numbers should never be uploaded to matrimonial portals without your consent.
							</p>
							<p>
								SopKit executes all image processing and PDF compilation directly in your browser. Nothing is stored in any cloud database.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
