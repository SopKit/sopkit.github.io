"use client";

import { CodeBlock as AstryxCodeBlock } from "@astryxdesign/core/CodeBlock";
import { toast } from "sonner";

interface CodeBlockProps {
	code: string;
	language?: string;
	className?: string;
}

/** Astryx CodeBlock (tokenized highlighting, language label, copy button). */
const CodeBlock = ({ code, language = "html", className }: CodeBlockProps) => (
	<AstryxCodeBlock
		code={code}
		language={language}
		hasLanguageLabel
		hasCopyButton
		onCopy={() => toast.success("Code copied to clipboard!")}
		className={className}
	/>
);

export default CodeBlock;
