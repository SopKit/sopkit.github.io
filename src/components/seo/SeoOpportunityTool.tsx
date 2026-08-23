"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import ApiKeyTester from "@/components/tools/developer/ApiKeyTester";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import AttendanceCalculator from "@/components/tools/calculators/AttendanceCalculator";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import QrGeneratorPremium from "@/components/tools/utilities/QrGeneratorPremium";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";
import MetaTagGenerator from "@/components/tools/built-ins/MetaTagGenerator";
import type { SeoOpportunity } from "@/data/seo-opportunities";

// Dynamic components to avoid bundling issues and optimize performance
const PDFCompressor = dynamic(() => import("@/components/tools/pdf/PDFCompressor"), { ssr: false });
const PDFToImage = dynamic(() => import("@/components/tools/pdf/PDFToImage"), { ssr: false });
const PDFUnlock = dynamic(() => import("@/components/tools/pdf/PDFUnlock"), { ssr: false });
const PDFProtect = dynamic(() => import("@/components/tools/pdf/PDFProtect"), { ssr: false });
const PDFRepair = dynamic(() => import("@/components/tools/pdf/PDFRepair"), { ssr: false });
const PDFPageDelete = dynamic(() => import("@/components/tools/pdf/PDFPageDelete"), { ssr: false });
const PDFMerger = dynamic(() => import("@/components/tools/pdf/PDFMerger"), { ssr: false });
const WordToPDF = dynamic(() => import("@/components/tools/pdf/WordToPDF"), { ssr: false });
const ImageToPDF = dynamic(() => import("@/components/tools/pdf/ImageToPDF"), { ssr: false });

const RemoveDuplicatesTool = dynamic(() => import("@/components/tools/text/RemoveDuplicatesTool"), { ssr: false });
const WordCounterTool = dynamic(() => import("@/components/tools/text/WordCounterTool"), { ssr: false });
const LoremIpsumTool = dynamic(() => import("@/components/tools/text/LoremIpsumTool"), { ssr: false });
const CaseConverter = dynamic(() => import("@/components/tools/text/CaseConverter"), { ssr: false });

// Inner renderer so the exported component can contain all `ssr: false`
// dynamic imports within a single local <Suspense> boundary. Without it, the
// BAILOUT_TO_CLIENT_SIDE_RENDERING thrown while prerendering escapes to the
// root and wipes out every page's server-rendered HTML.
function SeoOpportunityToolInner({
	opportunity,
}: {
	opportunity: SeoOpportunity;
}) {
	const preset = opportunity.toolPreset;

	if (preset.type === "exam-image") {
		return (
			<ExamPhotoResizer
				examName={preset.examName}
				presetWidth={preset.width}
				presetHeight={preset.height}
				presetUnit={preset.unit || "px"}
				presetMinKb={preset.minKb}
				presetMaxKb={preset.maxKb}
				showSignatureOption={preset.showSignatureOption ?? true}
				disclaimer="Always verify the latest official upload requirements before submitting a form."
			/>
		);
	}

	if (preset.type === "attendance") {
		return <AttendanceCalculator />;
	}

	if (preset.type === "grades") {
		return <AcademicGradesCalculator defaultTab={preset.defaultTab} />;
	}

	if (preset.type === "api-key") {
		return <ApiKeyTester toolName={preset.provider} />;
	}

	if (preset.type === "qr") {
		return <QrGeneratorPremium initialText={preset.sample} />;
	}

	if (preset.type === "seo-check" && preset.mode === "open-graph") {
		return <BuiltInSafeHttp toolId="open-graph-checker" />;
	}

	if (preset.type === "pdf-compress") {
		return <PDFCompressor />;
	}

	if (preset.type === "pdf-to-image") {
		return <PDFToImage />;
	}

	if (preset.type === "pdf-unlock") {
		return <PDFUnlock />;
	}

	if (preset.type === "pdf-protect") {
		return <PDFProtect />;
	}

	if (preset.type === "pdf-repair") {
		return <PDFRepair />;
	}

	if (preset.type === "pdf-delete-pages") {
		return <PDFPageDelete />;
	}

	if (preset.type === "pdf-merge") {
		return <PDFMerger />;
	}

	if (preset.type === "word-to-pdf") {
		return <WordToPDF />;
	}

	if (preset.type === "image-to-pdf") {
		return <ImageToPDF />;
	}

	if (preset.type === "text-remove-dupes") {
		return <RemoveDuplicatesTool />;
	}

	if (preset.type === "text-word-counter") {
		return <WordCounterTool />;
	}

	if (preset.type === "text-lorem-ipsum") {
		return <LoremIpsumTool />;
	}

	if (preset.type === "text-case-converter") {
		return <CaseConverter />;
	}

	return <MetaTagGenerator />;
}

export default function SeoOpportunityTool({
	opportunity,
}: {
	opportunity: SeoOpportunity;
}) {
	return (
		<Suspense
			fallback={
				<div className="min-h-[400px] w-full animate-pulse rounded-2xl bg-muted/30" />
			}
		>
			<SeoOpportunityToolInner opportunity={opportunity} />
		</Suspense>
	);
}
