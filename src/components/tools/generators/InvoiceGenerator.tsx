"use client";

import React, { useState, useMemo, useRef } from "react";
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
import { Printer, Plus, Trash2, ShieldCheck, RotateCcw, Upload, Download, FileText, Check } from "lucide-react";

interface InvoiceItem {
	id: number;
	description: string;
	quantity: number | string;
	rate: number | string;
	taxRate: number | string;
}

type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD" | "SGD" | "JPY";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
	USD: "$",
	EUR: "€",
	GBP: "£",
	INR: "₹",
	CAD: "C$",
	AUD: "A$",
	SGD: "S$",
	JPY: "¥",
};

export default function InvoiceGenerator() {
	// Business Profile
	const [businessName, setBusinessName] = useState("Acme Studio Design Inc.");
	const [businessAddress, setBusinessAddress] = useState("100 Innovation Boulevard\nSan Francisco, CA 94107");
	const [businessEmail, setBusinessEmail] = useState("billing@acmedesign.com");
	const [businessPhone, setBusinessPhone] = useState("+1 (555) 349-2041");
	const [taxId, setTaxId] = useState("US-EIN-94-1234567");

	// Client Info
	const [clientName, setClientName] = useState("Global Retail Enterprises");
	const [clientAddress, setClientAddress] = useState("452 Market Street, Floor 12\nNew York, NY 10001");
	const [clientEmail, setClientEmail] = useState("accounts@globalretail.com");

	// Invoice Settings
	const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0042");
	const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
	const [dueDate, setDueDate] = useState(() => {
		const d = new Date();
		d.setDate(d.getDate() + 14);
		return d.toISOString().split("T")[0];
	});
	const [currency, setCurrency] = useState<CurrencyCode>("USD");
	const [taxEnabled, setTaxEnabled] = useState(true);
	const [discount, setDiscount] = useState("50");

	// Items
	const [items, setItems] = useState<InvoiceItem[]>([
		{ id: 1, description: "Brand Identity Design & Guidelines", quantity: 1, rate: 2500, taxRate: 10 },
		{ id: 2, description: "Design System UI Kit (Figma)", quantity: 25, rate: 80, taxRate: 10 },
		{ id: 3, description: "Mobile App Responsive UX Audit", quantity: 1, rate: 950, taxRate: 10 },
	]);

	// Notes & Banking
	const [paymentTerms, setPaymentTerms] = useState("Payment is due within 14 days of invoice date via ACH or wire transfer.");
	const [bankDetails, setBankDetails] = useState("Bank: Silicon Valley Bank\nRouting / ABA: 121000358\nAccount No: 8847291039");

	// Logo
	const logoInputRef = useRef<HTMLInputElement>(null);
	const [logoUrl, setLogoUrl] = useState<string>("");

	const symbol = CURRENCY_SYMBOLS[currency] || "$";

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				toast.error("Logo file must be under 2MB.");
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) {
					setLogoUrl(event.target.result as string);
					toast.success("Logo uploaded successfully.");
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const removeLogo = () => {
		setLogoUrl("");
		if (logoInputRef.current) {
			logoInputRef.current.value = "";
		}
	};

	const addItem = () => {
		const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
		setItems([...items, { id: newId, description: "New Service / Product Item", quantity: 1, rate: 100, taxRate: 10 }]);
	};

	const removeItem = (id: number) => {
		if (items.length <= 1) {
			toast.error("Invoice must contain at least one line item.");
			return;
		}
		setItems(items.filter((item) => item.id !== id));
	};

	const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
		setItems(
			items.map((item) => {
				if (item.id === id) {
					return { ...item, [field]: value };
				}
				return item;
			})
		);
	};

	const calculations = useMemo(() => {
		let subtotal = 0;
		let taxTotal = 0;

		items.forEach((item) => {
			const qty = typeof item.quantity === "string" ? parseFloat(item.quantity) || 0 : item.quantity;
			const rate = typeof item.rate === "string" ? parseFloat(item.rate) || 0 : item.rate;
			const itemTotal = qty * rate;
			subtotal += itemTotal;

			if (taxEnabled) {
				const tax = typeof item.taxRate === "string" ? parseFloat(item.taxRate) || 0 : item.taxRate;
				taxTotal += (itemTotal * tax) / 100;
			}
		});

		const flatDiscount = parseFloat(discount) || 0;
		const grandTotal = Math.max(0, subtotal + taxTotal - flatDiscount);

		return {
			subtotal: subtotal.toFixed(2),
			taxTotal: taxTotal.toFixed(2),
			discount: flatDiscount.toFixed(2),
			grandTotal: grandTotal.toFixed(2),
		};
	}, [items, discount, taxEnabled]);

	const handlePrint = () => {
		window.print();
	};

	const handleReset = () => {
		setItems([
			{ id: 1, description: "Consulting & Strategy Sprint", quantity: 1, rate: 1500, taxRate: 10 },
		]);
		setDiscount("0");
		setLogoUrl("");
		toast.info("Invoice builder reset to defaults.");
	};

	const exportJsonTemplate = () => {
		const state = {
			businessName,
			businessAddress,
			businessEmail,
			businessPhone,
			taxId,
			clientName,
			clientAddress,
			clientEmail,
			invoiceNumber,
			invoiceDate,
			dueDate,
			currency,
			discount,
			taxEnabled,
			items,
			paymentTerms,
			bankDetails,
		};
		const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}-template.json`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Exported ${link.download}`);
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
							#invoice-paper-zone, #invoice-paper-zone * {
								visibility: visible;
							}
							#invoice-paper-zone {
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

			{/* Main Editor Header Bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
				<div className="flex items-center gap-2">
					<Button size="sm" onClick={handlePrint} className="gap-2 font-semibold shadow-sm">
						<Printer className="h-4 w-4" /> Print / Save as PDF
					</Button>
					<Button variant="outline" size="sm" onClick={exportJsonTemplate} className="gap-1.5 text-xs">
						<Download className="h-3.5 w-3.5" /> Save JSON Template
					</Button>
				</div>
				<Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs text-muted-foreground">
					<RotateCcw className="h-3.5 w-3.5" /> Reset Form
				</Button>
			</div>

			<ToolGrid>
				{/* Configuration Panel */}
				<ToolGridMain>
					{/* Business Details */}
					<ToolPanel className="no-print">
						<ToolSectionTitle
							title="Issuer & Business Profile"
							description="Your organization or freelance billing identity."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Business / Company Name">
								<Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
							</ToolField>
							<ToolField label="Tax ID / GSTIN / EIN">
								<Input value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="e.g. EIN or GSTIN" />
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Email Address">
								<Input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} />
							</ToolField>
							<ToolField label="Phone Number">
								<Input value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} />
							</ToolField>
						</div>

						<div className="mt-4">
							<ToolField label="Physical / Billing Address">
								<Textarea
									rows={2}
									value={businessAddress}
									onChange={(e) => setBusinessAddress(e.target.value)}
									className="resize-y"
								/>
							</ToolField>
						</div>

						<div className="mt-4 flex items-center gap-3">
							<input
								ref={logoInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleLogoUpload}
							/>
							<Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="gap-1.5 text-xs">
								<Upload className="h-3.5 w-3.5" /> {logoUrl ? "Change Logo" : "Upload Business Logo"}
							</Button>
							{logoUrl && (
								<Button variant="ghost" size="sm" onClick={removeLogo} className="text-xs text-destructive">
									Remove Logo
								</Button>
							)}
						</div>
					</ToolPanel>

					{/* Client Details */}
					<ToolPanel className="mt-6 no-print">
						<ToolSectionTitle
							title="Bill To (Client)"
							description="Customer information and destination address."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Client Name / Organization">
								<Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
							</ToolField>
							<ToolField label="Client Email">
								<Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
							</ToolField>
						</div>
						<div className="mt-4">
							<ToolField label="Client Billing Address">
								<Textarea
									rows={2}
									value={clientAddress}
									onChange={(e) => setClientAddress(e.target.value)}
									className="resize-y"
								/>
							</ToolField>
						</div>
					</ToolPanel>

					{/* Invoice Meta & Line Items */}
					<ToolPanel className="mt-6 no-print">
						<ToolSectionTitle
							title="Invoice Metadata & Currency"
							description="Set document numbers, issue dates, and terms."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
							<ToolField label="Invoice Number">
								<Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="font-mono" />
							</ToolField>
							<ToolField label="Currency">
								<Select value={currency} onValueChange={(val: CurrencyCode) => setCurrency(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Currency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">$ USD (US Dollar)</SelectItem>
										<SelectItem value="EUR">€ EUR (Euro)</SelectItem>
										<SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
										<SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
										<SelectItem value="CAD">C$ CAD (Canadian Dollar)</SelectItem>
										<SelectItem value="AUD">A$ AUD (Australian Dollar)</SelectItem>
										<SelectItem value="SGD">S$ SGD (Singapore Dollar)</SelectItem>
										<SelectItem value="JPY">¥ JPY (Japanese Yen)</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>
							<ToolField label="Issue Date">
								<Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
							</ToolField>
							<ToolField label="Payment Due Date">
								<Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
							</ToolField>
						</div>

						{/* Line Items Editor */}
						<div className="mt-6 pt-5 border-t border-border">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-sm font-semibold text-foreground">Line Items</h3>
								<Button size="sm" variant="outline" onClick={addItem} className="gap-1 text-xs font-semibold">
									<Plus className="h-3.5 w-3.5" /> Add Line Item
								</Button>
							</div>

							<div className="space-y-3">
								{items.map((item, idx) => {
									const qty = typeof item.quantity === "string" ? parseFloat(item.quantity) || 0 : item.quantity;
									const rate = typeof item.rate === "string" ? parseFloat(item.rate) || 0 : item.rate;
									const total = qty * rate;

									return (
										<div key={item.id} className="p-3 rounded-xl bg-muted/30 border border-border/50 grid grid-cols-12 gap-2 items-center">
											<div className="col-span-12 sm:col-span-5">
												<Input
													value={item.description}
													onChange={(e) => updateItem(item.id, "description", e.target.value)}
													placeholder="Description"
													className="text-xs"
												/>
											</div>
											<div className="col-span-4 sm:col-span-2">
												<Input
													type="number"
													value={item.quantity}
													onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
													placeholder="Qty"
													className="text-xs font-mono"
												/>
											</div>
											<div className="col-span-4 sm:col-span-2">
												<Input
													type="number"
													value={item.rate}
													onChange={(e) => updateItem(item.id, "rate", e.target.value)}
													placeholder="Rate"
													className="text-xs font-mono"
												/>
											</div>
											{taxEnabled && (
												<div className="col-span-3 sm:col-span-1">
													<Input
														type="number"
														value={item.taxRate}
														onChange={(e) => updateItem(item.id, "taxRate", e.target.value)}
														placeholder="Tax %"
														className="text-xs font-mono"
													/>
												</div>
											)}
											<div className="col-span-9 sm:col-span-1 text-right text-xs font-mono font-bold">
												{symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
											</div>
											<div className="col-span-3 sm:col-span-1 text-right">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeItem(item.id)}
													className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Taxes & Discounts */}
						<div className="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
								<div className="space-y-0.5">
									<Label htmlFor="tax-switch" className="text-sm font-semibold cursor-pointer">
										Include Sales Tax / GST
									</Label>
									<p className="text-xs text-muted-foreground">Calculate tax per line item.</p>
								</div>
								<Switch id="tax-switch" checked={taxEnabled} onCheckedChange={setTaxEnabled} />
							</div>

							<ToolField label={`Flat Discount (${symbol})`}>
								<Input
									type="number"
									value={discount}
									onChange={(e) => setDiscount(e.target.value)}
									className="font-mono"
								/>
							</ToolField>
						</div>

						{/* Payment Notes & Banking */}
						<div className="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
							<ToolField label="Payment Terms & Notes">
								<Textarea
									rows={3}
									value={paymentTerms}
									onChange={(e) => setPaymentTerms(e.target.value)}
									className="text-xs resize-y"
								/>
							</ToolField>
							<ToolField label="Wire / Bank Transfer Coordinates">
								<Textarea
									rows={3}
									value={bankDetails}
									onChange={(e) => setBankDetails(e.target.value)}
									className="text-xs font-mono resize-y"
								/>
							</ToolField>
						</div>
					</ToolPanel>

					{/* Live Rendered Paper Invoice Sheet */}
					<ToolPanel className="mt-8">
						<div className="flex items-center justify-between mb-4 no-print">
							<ToolSectionTitle
								title="Print-Ready Preview"
								description="High-resolution, vector-crisp bill layout rendered in real time."
							/>
							<Button size="sm" onClick={handlePrint} className="gap-1.5 font-semibold text-xs">
								<Printer className="h-3.5 w-3.5" /> Print / Save PDF
							</Button>
						</div>

						{/* Real Paper Document Container */}
						<div
							id="invoice-paper-zone"
							className="p-8 sm:p-12 rounded-xl bg-white text-neutral-900 border-2 border-neutral-200 shadow-xl font-sans text-xs leading-relaxed"
						>
							{/* Invoice Top Header */}
							<div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-neutral-900 pb-8">
								<div>
									{logoUrl ? (
										<img src={logoUrl} alt="Business Logo" className="h-16 w-auto object-contain mb-3" />
									) : (
										<div className="h-12 w-12 rounded-xl bg-neutral-900 text-white font-bold flex items-center justify-center text-xl mb-3">
											{businessName.charAt(0) || "B"}
										</div>
									)}
									<h2 className="text-xl font-bold text-neutral-950 uppercase tracking-tight">
										{businessName || "Your Company Name"}
									</h2>
									<p className="whitespace-pre-line text-neutral-600 mt-1 text-[11px]">{businessAddress}</p>
									<p className="text-neutral-600 text-[11px] mt-1">
										{businessEmail} {businessPhone && `• ${businessPhone}`}
									</p>
									{taxId && <p className="font-mono text-neutral-700 text-[10px] mt-1">Tax ID: {taxId}</p>}
								</div>

								<div className="text-left sm:text-right space-y-1 sm:min-w-[200px]">
									<h1 className="text-3xl font-extrabold uppercase tracking-widest text-neutral-950">
										INVOICE
									</h1>
									<p className="font-mono font-bold text-sm text-neutral-900">#{invoiceNumber}</p>
									<div className="pt-2 text-[11px] space-y-1">
										<p className="text-neutral-500">
											Invoice Date: <strong className="text-neutral-900 font-sans">{invoiceDate}</strong>
										</p>
										<p className="text-neutral-500">
											Due Date: <strong className="text-neutral-900 font-sans">{dueDate}</strong>
										</p>
									</div>
								</div>
							</div>

							{/* Bill To Info */}
							<div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
										Billed To:
									</p>
									<h4 className="text-sm font-bold text-neutral-950">{clientName || "Client Name"}</h4>
									<p className="whitespace-pre-line text-neutral-600 text-[11px] mt-1">{clientAddress}</p>
									{clientEmail && <p className="text-neutral-600 text-[11px] mt-0.5">{clientEmail}</p>}
								</div>
							</div>

							{/* Table of Items */}
							<div className="border border-neutral-300 rounded-lg overflow-hidden my-6">
								<table className="w-full text-left border-collapse">
									<thead>
										<tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase tracking-wider">
											<th className="py-2.5 px-4">Description</th>
											<th className="py-2.5 px-4 text-center">Qty</th>
											<th className="py-2.5 px-4 text-right">Unit Rate</th>
											{taxEnabled && <th className="py-2.5 px-4 text-right">Tax</th>}
											<th className="py-2.5 px-4 text-right">Amount</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-200">
										{items.map((item) => {
											const qty = typeof item.quantity === "string" ? parseFloat(item.quantity) || 0 : item.quantity;
											const rate = typeof item.rate === "string" ? parseFloat(item.rate) || 0 : item.rate;
											const total = qty * rate;

											return (
												<tr key={item.id} className="text-neutral-800 text-[11px]">
													<td className="py-3 px-4 font-medium">{item.description}</td>
													<td className="py-3 px-4 text-center font-mono">{qty}</td>
													<td className="py-3 px-4 text-right font-mono">
														{symbol}
														{rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
													</td>
													{taxEnabled && (
														<td className="py-3 px-4 text-right font-mono text-neutral-500">
															{item.taxRate}%
														</td>
													)}
													<td className="py-3 px-4 text-right font-mono font-bold text-neutral-950">
														{symbol}
														{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							{/* Summary Breakdown */}
							<div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-6">
								<div className="sm:max-w-xs space-y-3">
									{paymentTerms && (
										<div>
											<p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
												Terms & Instructions:
											</p>
											<p className="text-[11px] text-neutral-600 mt-0.5">{paymentTerms}</p>
										</div>
									)}
									{bankDetails && (
										<div>
											<p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
												Bank Transfer Details:
											</p>
											<p className="text-[10px] font-mono text-neutral-700 whitespace-pre-line mt-0.5">
												{bankDetails}
											</p>
										</div>
									)}
								</div>

								<div className="w-full sm:w-64 space-y-2 text-[11px]">
									<div className="flex justify-between py-1 border-b border-neutral-200">
										<span className="text-neutral-500">Subtotal</span>
										<span className="font-mono font-semibold">
											{symbol}
											{parseFloat(calculations.subtotal).toLocaleString(undefined, {
												minimumFractionDigits: 2,
											})}
										</span>
									</div>
									{taxEnabled && (
										<div className="flex justify-between py-1 border-b border-neutral-200">
											<span className="text-neutral-500">Estimated Tax</span>
											<span className="font-mono font-semibold">
												{symbol}
												{parseFloat(calculations.taxTotal).toLocaleString(undefined, {
													minimumFractionDigits: 2,
												})}
											</span>
										</div>
									)}
									{parseFloat(calculations.discount) > 0 && (
										<div className="flex justify-between py-1 border-b border-neutral-200 text-emerald-700">
											<span>Discount</span>
											<span className="font-mono font-semibold">
												-{symbol}
												{parseFloat(calculations.discount).toLocaleString(undefined, {
													minimumFractionDigits: 2,
												})}
											</span>
										</div>
									)}
									<div className="flex justify-between py-2.5 border-t-2 border-neutral-900 text-sm font-bold text-neutral-950">
										<span>Total Due</span>
										<span className="font-mono text-base">
											{symbol}
											{parseFloat(calculations.grandTotal).toLocaleString(undefined, {
												minimumFractionDigits: 2,
											})}
										</span>
									</div>
								</div>
							</div>
						</div>
					</ToolPanel>
				</ToolGridMain>

				{/* Sidebar Metrics & Security */}
				<ToolGridSide>
					<ToolPanel className="no-print">
						<ToolSectionTitle
							title="Invoice Summary"
							description="Quick financial overview of this draft."
						/>
						<div className="space-y-3 mt-4 text-sm">
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Line Items</span>
								<span className="font-mono font-bold">{items.length}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="font-mono font-semibold">
									{symbol}{parseFloat(calculations.subtotal).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Tax Total</span>
								<span className="font-mono font-semibold">
									{symbol}{parseFloat(calculations.taxTotal).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between py-2">
								<span className="text-muted-foreground">Grand Total</span>
								<span className="font-mono font-bold text-emerald-500 text-base">
									{symbol}{parseFloat(calculations.grandTotal).toLocaleString()}
								</span>
							</div>
						</div>
					</ToolPanel>

					<ToolPanel className="mt-6 no-print">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<ShieldCheck className="h-4 w-4 text-emerald-500" />
								Zero Cloud Exposure
							</h3>
							<p>
								Commercial SaaS billing platforms track your client revenue, customer identities, and payment banking details for cross-sell advertising and underwriting.
							</p>
							<p>
								SopKit builds your invoices strictly inside your client browser. You can export a portable <code className="bg-muted px-1 py-0.5 rounded font-mono">.json</code> template directly to your disk for rapid re-use without ever trusting a third-party server.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
