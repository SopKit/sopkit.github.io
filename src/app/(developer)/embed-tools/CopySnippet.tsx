"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopySnippet({ snippet }: { snippet: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(snippet);
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = snippet;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
			aria-label="Copy embed code"
		>
			{copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
			{copied ? "Copied" : "Copy"}
		</button>
	);
}
