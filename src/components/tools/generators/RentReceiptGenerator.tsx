"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Printer, RotateCcw, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight, IndianRupee, FileText } from "lucide-react";

type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "AED";
type Frequency = "monthly" | "quarterly" | "half_yearly" | "annual";
type PaymentMode = "online" | "cheque" | "cash";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
	INR: "₹",
	USD: "$",
	EUR: "€",
	GBP: "£",
	CAD: "C$",
	AUD: "A$",
	AED: "AED ",
};

// Convert number to words in English (with Indian lakh/crore support when currency is INR)
function numberToWords(num: number, isIndian: boolean = true): string {
	const val = Math.floor(Math.abs(num));
	if (val === 0) return "Zero";

	const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
		"Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
	const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

	const convertThreeDigit = (n: number): string => {
		let str = "";
		if (n >= 100) {
			str += units[Math.floor(n / 100)] + " Hundred ";
			n %= 100;
		}
		if (n > 19) {
			str += tens[Math.floor(n / 10)] + " " + units[n % 10];
		} else if (n > 0) {
			str += units[n];
		}
		return str.trim();
	};

	if (isIndian) {
		let remaining = val;
		let words = "";

		if (remaining >= 10000000) {
			words += convertThreeDigit(Math.floor(remaining / 10000000)) + " Crore ";
			remaining %= 10000000;
		}
		if (remaining >= 100000) {
			words += convertThreeDigit(Math.floor(remaining / 100000)) + " Lakh ";
			remaining %= 100000;
		}
		if (remaining >= 1000) {
			words += convertThreeDigit(Math.floor(remaining / 1000)) + " Thousand ";
			remaining %= 1000;
		}
		if (remaining > 0) {
			words += convertThreeDigit(remaining);
		}
		return words.trim() + " Only";
	} else {
		// Western scale
		const scales = ["", "Thousand", "Million", "Billion"];
		let remaining = val;
		let parts: string[] = [];
		let scaleIdx = 0;

		while (remaining > 0) {
			const chunk = remaining % 1000;
			if (chunk !== 0) {
				const chunkStr = convertThreeDigit(chunk);
				parts.unshift(`${chunkStr} ${scales[scaleIdx]}`.trim());
			}
			remaining = Math.floor(remaining / 1000);
			scaleIdx++;
		}
		return parts.join(" ").trim() + " Only";
	}
}

interface Receipt {
	id: number;
	period: string;
	amount: number;
	amountWords: string;
	date: string;
}

export default function RentReceiptGenerator() {
	const [tenantName, setTenantName] = useState<string>("Alex Morgan");
	const [landlordName, setLandlordName] = useState<string>("David Wilson");
	const [monthlyRent, setMonthlyRent] = useState<string>("20000");
	const [currency, setCurrency] = useState<CurrencyCode>("INR");
	const [propertyAddress, setPropertyAddress] = useState<string>("Flat 402, Greenfield Residences, Sector 45");
	const [cityState, setCityState] = useState<string>("Gurugram, Haryana");
	const [landlordPan, setLandlordPan] = useState<string>("ABCDE1234F");
	const [paymentMode, setPaymentMode] = useState<PaymentMode>("online");
	const [transactionRef, setTransactionRef] = useState<string>("");

	// Dates and Frequency
	const [startDate, setStartDate] = useState<string>("2025-04-01");
	const [endDate, setEndDate] = useState<string>("2026-03-31");
	const [frequency, setFrequency] = useState<Frequency>("monthly");

	// Preview pager
	const [previewIndex, setPreviewIndex] = useState<number>(0);

	const isINR = currency === "INR";
	const symbol = CURRENCY_SYMBOLS[currency] || "₹";

	// Generate list of receipts
	const receiptsList = useMemo<Receipt[]>(() => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const rent = parseFloat(monthlyRent) || 0;

		if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end || rent <= 0) {
			return [];
		}

		const list: Receipt[] = [];
		let current = new Date(start);
		let count = 1;

		while (current <= end) {
			let periodText = "";
			let amount = rent;

			if (frequency === "monthly") {
				const month = current.toLocaleString("default", { month: "long" });
				const year = current.getFullYear();
				periodText = `${month} ${year}`;

				const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
				list.push({
					id: count++,
					period: periodText,
					amount,
					amountWords: numberToWords(amount, isINR),
					date: lastDayOfMonth.toISOString().split("T")[0],
				});
				current.setMonth(current.getMonth() + 1);
			} else if (frequency === "quarterly") {
				const monthStart = current.toLocaleString("default", { month: "short" });
				const yearStart = current.getFullYear();

				current.setMonth(current.getMonth() + 3);
				const tempDate = new Date(current);
				tempDate.setDate(0);

				const monthEnd = tempDate.toLocaleString("default", { month: "short" });
				const yearEnd = tempDate.getFullYear();

				periodText = `${monthStart} ${yearStart} to ${monthEnd} ${yearEnd}`;
				amount = rent * 3;

				list.push({
					id: count++,
					period: periodText,
					amount,
					amountWords: numberToWords(amount, isINR),
					date: tempDate.toISOString().split("T")[0],
				});
			} else if (frequency === "half_yearly") {
				const monthStart = current.toLocaleString("default", { month: "short" });
				const yearStart = current.getFullYear();

				current.setMonth(current.getMonth() + 6);
				const tempDate = new Date(current);
				tempDate.setDate(0);

				const monthEnd = tempDate.toLocaleString("default", { month: "short" });
				const yearEnd = tempDate.getFullYear();

				periodText = `${monthStart} ${yearStart} to ${monthEnd} ${yearEnd}`;
				amount = rent * 6;

				list.push({
					id: count++,
					period: periodText,
					amount,
					amountWords: numberToWords(amount, isINR),
					date: tempDate.toISOString().split("T")[0],
				});
			} else {
				// Annual
				const startYear = current.getFullYear();
				current.setFullYear(current.getFullYear() + 1);
				const tempDate = new Date(current);
				tempDate.setDate(0);

				periodText = `FY ${startYear}-${(startYear + 1).toString().slice(-2)}`;
				amount = rent * 12;

				list.push({
					id: count++,
					period: periodText,
					amount,
					amountWords: numberToWords(amount, isINR),
					date: tempDate.toISOString().split("T")[0],
				});
			}
		}

		return list;
	}, [startDate, endDate, monthlyRent, frequency, isINR]);

	const totalAnnualRent = useMemo(() => {
		return receiptsList.reduce((acc, curr) => acc + curr.amount, 0);
	}, [receiptsList]);

	const showPanWarning = isINR && totalAnnualRent > 100000 && !landlordPan.trim();

	const handlePrint = useCallback(() => {
		if (receiptsList.length === 0) {
			toast.error("Please provide valid dates and rent amount first.");
			return;
		}
		window.print();
	}, [receiptsList]);

	const handleReset = () => {
		setTenantName("");
		setLandlordName("");
		setMonthlyRent("");
		setPropertyAddress("");
		setCityState("");
		setLandlordPan("");
		setTransactionRef("");
		toast.info("Form reset");
	};

	const currentReceipt = receiptsList[previewIndex] || receiptsList[0];

	return (
		<ToolShell>
			{/* Print Stylesheet */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
						@media print {
							body * {
								visibility: hidden;
							}
							#print-receipts-container, #print-receipts-container * {
								visibility: visible;
							}
							#print-receipts-container {
								position: absolute;
								left: 0;
								top: 0;
								width: 100%;
								display: block !important;
							}
							.no-print {
								display: none !important;
							}
							.print-receipt-item {
								page-break-inside: avoid;
								margin-bottom: 24px;
								border: 2px solid #333 !important;
								padding: 24px !important;
								background: #fff !important;
								color: #000 !important;
								font-family: serif !important;
							}
						}
					`,
				}}
			/>

			{/* Main Editor UI */}
			<div className="no-print">
				<ToolGrid>
					{/* Left Configuration Form */}
					<ToolGridMain>
						<ToolPanel>
							<div className="flex items-center justify-between mb-4">
								<ToolSectionTitle
									title="Tenant & Property Details"
									description="Fill in your rental agreement details to generate compliant receipts."
								/>
								<Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-muted-foreground gap-1">
									<RotateCcw className="h-3.5 w-3.5" /> Reset
								</Button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<ToolField label="Tenant Full Name">
									<Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="e.g. John Doe" />
								</ToolField>
								<ToolField label="Landlord Full Name">
									<Input value={landlordName} onChange={(e) => setLandlordName(e.target.value)} placeholder="e.g. Jane Smith" />
								</ToolField>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
								<ToolField label="Currency">
									<Select value={currency} onValueChange={(val: CurrencyCode) => setCurrency(val)}>
										<SelectTrigger>
											<SelectValue placeholder="Currency" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="INR">₹ INR (India HRA)</SelectItem>
											<SelectItem value="USD">$ USD (US)</SelectItem>
											<SelectItem value="EUR">€ EUR (Europe)</SelectItem>
											<SelectItem value="GBP">£ GBP (UK)</SelectItem>
											<SelectItem value="CAD">C$ CAD (Canada)</SelectItem>
											<SelectItem value="AUD">A$ AUD (Australia)</SelectItem>
											<SelectItem value="AED">AED (UAE)</SelectItem>
										</SelectContent>
									</Select>
								</ToolField>
								<ToolField label={`Monthly Rent (${symbol})`}>
									<Input
										type="number"
										value={monthlyRent}
										onChange={(e) => setMonthlyRent(e.target.value)}
										placeholder="e.g. 20000"
										className="font-mono"
									/>
								</ToolField>
								<ToolField label="Landlord PAN / Tax ID">
									<Input
										value={landlordPan}
										onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
										placeholder="e.g. ABCDE1234F"
										className="font-mono"
									/>
								</ToolField>
							</div>

							{showPanWarning && (
								<div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2">
									<AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
									<span>
										<strong>HRA Compliance Notice:</strong> Under Indian Income Tax Section 10(13A), Landlord PAN is mandatory when annual rent exceeds ₹1,00,000 (currently {symbol}{totalAnnualRent.toLocaleString()}).
									</span>
								</div>
							)}

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<ToolField label="Rented Property Address">
									<Input
										value={propertyAddress}
										onChange={(e) => setPropertyAddress(e.target.value)}
										placeholder="e.g. Flat No, Wing, Society Name"
									/>
								</ToolField>
								<ToolField label="City, State & Postal Code">
									<Input
										value={cityState}
										onChange={(e) => setCityState(e.target.value)}
										placeholder="e.g. Mumbai, Maharashtra"
									/>
								</ToolField>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
								<ToolField label="Start Date">
									<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
								</ToolField>
								<ToolField label="End Date">
									<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
								</ToolField>
								<ToolField label="Frequency">
									<Select value={frequency} onValueChange={(val: Frequency) => setFrequency(val)}>
										<SelectTrigger>
											<SelectValue placeholder="Frequency" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="monthly">Monthly (12 Receipts)</SelectItem>
											<SelectItem value="quarterly">Quarterly (4 Receipts)</SelectItem>
											<SelectItem value="half_yearly">Half-Yearly (2 Receipts)</SelectItem>
											<SelectItem value="annual">Annual (1 Receipt)</SelectItem>
										</SelectContent>
									</Select>
								</ToolField>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<ToolField label="Payment Method">
									<Select value={paymentMode} onValueChange={(val: PaymentMode) => setPaymentMode(val)}>
										<SelectTrigger>
											<SelectValue placeholder="Mode" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="online">Online / UPI / NetBanking</SelectItem>
											<SelectItem value="cheque">Cheque</SelectItem>
											<SelectItem value="cash">Cash (Affix Revenue Stamp)</SelectItem>
										</SelectContent>
									</Select>
								</ToolField>
								<ToolField label="Transaction Ref / Cheque No. (Optional)">
									<Input
										value={transactionRef}
										onChange={(e) => setTransactionRef(e.target.value)}
										placeholder="e.g. UPI Ref / Cheque 402910"
									/>
								</ToolField>
							</div>

							<div className="mt-6 flex flex-wrap gap-3">
								<Button size="lg" onClick={handlePrint} className="gap-2 font-semibold shadow-sm w-full sm:w-auto">
									<Printer className="h-4 w-4" /> Print / Download All ({receiptsList.length}) Receipts
								</Button>
							</div>
						</ToolPanel>

						{/* Interactive Live Document Preview */}
						{currentReceipt && (
							<ToolPanel className="mt-6">
								<div className="flex items-center justify-between mb-4">
									<ToolSectionTitle
										title="Live Document Preview"
										description={`Viewing receipt ${previewIndex + 1} of ${receiptsList.length}.`}
									/>
									<div className="flex items-center gap-1.5">
										<Button
											variant="outline"
											size="sm"
											disabled={previewIndex === 0}
											onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
											className="h-8 w-8 p-0"
										>
											<ChevronLeft className="h-4 w-4" />
										</Button>
										<span className="text-xs font-mono px-2">
											{previewIndex + 1} / {receiptsList.length}
										</span>
										<Button
											variant="outline"
											size="sm"
											disabled={previewIndex >= receiptsList.length - 1}
											onClick={() => setPreviewIndex((i) => Math.min(receiptsList.length - 1, i + 1))}
											className="h-8 w-8 p-0"
										>
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>

								{/* Styled Paper Preview */}
								<div className="p-6 sm:p-8 rounded-xl bg-white text-neutral-900 border-2 border-neutral-300 shadow-md font-serif text-sm leading-relaxed">
									<div className="border-b-2 border-neutral-800 pb-3 flex justify-between items-center">
										<div>
											<h3 className="text-lg font-bold uppercase tracking-wider text-neutral-900">
												Rent Receipt
											</h3>
											<p className="text-xs font-sans text-neutral-500">
												For Period: <strong className="text-neutral-800">{currentReceipt.period}</strong>
											</p>
										</div>
										<div className="text-right text-xs font-sans">
											<p className="font-mono font-bold">Receipt #{currentReceipt.id.toString().padStart(3, "0")}</p>
											<p className="text-neutral-500">Date: {currentReceipt.date}</p>
										</div>
									</div>

									<div className="my-5 space-y-3 text-neutral-800">
										<p>
											Received sum of{" "}
											<strong className="underline underline-offset-4 font-bold text-neutral-950">
												{symbol} {currentReceipt.amount.toLocaleString()}
											</strong>{" "}
											(Rupees / Amount in words: <em>{currentReceipt.amountWords}</em>) from tenant{" "}
											<strong className="underline underline-offset-4 text-neutral-950">
												{tenantName || "[Tenant Name]"}
											</strong>{" "}
											towards the rent of residential property situated at:
										</p>
										<p className="p-2.5 bg-neutral-50 rounded border border-neutral-200 font-sans text-xs">
											<strong>Address:</strong> {propertyAddress || "[Property Address]"},{" "}
											{cityState || "[City, State]"}
										</p>
										<p className="text-xs text-neutral-600">
											Paid via <strong>{paymentMode.toUpperCase()}</strong>
											{transactionRef && ` (Ref: ${transactionRef})`}.
										</p>
									</div>

									<div className="mt-8 pt-4 border-t border-neutral-300 flex justify-between items-end">
										<div className="text-xs space-y-1">
											<p>
												<strong>Landlord:</strong> {landlordName || "[Landlord Name]"}
											</p>
											{landlordPan && (
												<p className="font-mono">
													<strong>PAN / Tax ID:</strong> {landlordPan}
												</p>
											)}
										</div>

										<div className="text-center">
											{paymentMode === "cash" && currentReceipt.amount > 5000 && isINR ? (
												<div className="w-20 h-20 border-2 border-dashed border-neutral-400 rounded flex flex-col items-center justify-center text-[10px] text-neutral-400 mb-1 mx-auto bg-neutral-50">
													<span>Affix</span>
													<span>₹1 Revenue</span>
													<span>Stamp</span>
												</div>
											) : (
												<div className="h-12 w-32 border-b border-neutral-400 mb-1"></div>
											)}
											<p className="text-[11px] text-neutral-500">Landlord's Signature</p>
										</div>
									</div>
								</div>
							</ToolPanel>
						)}
					</ToolGridMain>

					{/* Sidebar Summary & Rules */}
					<ToolGridSide>
						<ToolPanel>
							<ToolSectionTitle
								title="Summary & HRA Limits"
								description="Calculated values for your tax exemption filing."
							/>
							<div className="space-y-3 mt-4 text-sm">
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Total Receipts</span>
									<span className="font-mono font-bold text-primary">{receiptsList.length}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Monthly Rent</span>
									<span className="font-mono font-semibold">
										{symbol} {parseFloat(monthlyRent || "0").toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Annual Total</span>
									<span className="font-mono font-bold text-emerald-500">
										{symbol} {totalAnnualRent.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between py-2">
									<span className="text-muted-foreground">Landlord PAN Needed</span>
									<span className="font-mono font-semibold">
										{isINR && totalAnnualRent > 100000 ? "Mandatory (>₹1 Lakh)" : "Optional"}
									</span>
								</div>
							</div>
						</ToolPanel>

						<ToolPanel className="mt-6">
							<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
								<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
									<ShieldCheck className="h-4 w-4 text-emerald-500" />
									100% Private Client-Side PDF
								</h3>
								<p>
									No sensitive financial information—such as your landlord's Permanent Account Number (PAN), your residential address, or rental transaction records—is ever sent over the network or saved in an external database.
								</p>
								<p>
									Receipts are rendered into print layout purely through CSS print media queries. Click <strong>Print / Download</strong> and choose "Save as PDF" in your browser's print dialog to archive your receipts offline.
								</p>
							</div>
						</ToolPanel>
					</ToolGridSide>
				</ToolGrid>
			</div>

			{/* Full Print Container for Batch Printing (Hidden from screen view, visible only in print) */}
			<div id="print-receipts-container" className="hidden">
				{receiptsList.map((rec) => (
					<div key={rec.id} className="print-receipt-item">
						<div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: "8px", marginBottom: "16px" }}>
							<div>
								<h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>Rent Receipt</h2>
								<p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>Period: <strong>{rec.period}</strong></p>
							</div>
							<div style={{ textAlign: "right", fontSize: "12px" }}>
								<p style={{ margin: 0, fontWeight: "bold", fontFamily: "monospace" }}>Receipt #{rec.id.toString().padStart(3, "0")}</p>
								<p style={{ margin: "4px 0 0 0" }}>Date: {rec.date}</p>
							</div>
						</div>

						<div style={{ fontSize: "14px", lineHeight: "1.6", margin: "16px 0" }}>
							<p>
								Received sum of <strong>{symbol} {rec.amount.toLocaleString()}</strong> ({rec.amountWords}) from tenant <strong>{tenantName}</strong> towards rent of residential property at:
							</p>
							<p style={{ padding: "8px", background: "#f5f5f5", border: "1px solid #ccc", fontSize: "12px", margin: "10px 0" }}>
								<strong>Address:</strong> {propertyAddress}, {cityState}
							</p>
							<p style={{ fontSize: "12px", color: "#555" }}>
								Payment Mode: <strong>{paymentMode.toUpperCase()}</strong>{transactionRef ? ` (Ref: ${transactionRef})` : ""}.
							</p>
						</div>

						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #ddd" }}>
							<div style={{ fontSize: "12px" }}>
								<p style={{ margin: "2px 0" }}><strong>Landlord:</strong> {landlordName}</p>
								{landlordPan && <p style={{ margin: "2px 0", fontFamily: "monospace" }}><strong>PAN / Tax ID:</strong> {landlordPan}</p>}
							</div>

							<div style={{ textAlign: "center" }}>
								{paymentMode === "cash" && rec.amount > 5000 && isINR ? (
									<div style={{ width: "70px", height: "70px", border: "1px dashed #777", display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#666", marginBottom: "4px" }}>
										<span>Affix</span>
										<span>₹1 Revenue</span>
										<span>Stamp</span>
									</div>
								) : (
									<div style={{ height: "40px", width: "120px", borderBottom: "1px solid #000", marginBottom: "4px" }}></div>
								)}
								<p style={{ fontSize: "10px", margin: 0, color: "#666" }}>Landlord Signature</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</ToolShell>
	);
}
