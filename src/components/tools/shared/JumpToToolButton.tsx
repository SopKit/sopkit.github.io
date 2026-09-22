"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

export function JumpToToolButton() {
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			const workspaceEl = document.getElementById("tool-workspace");
			if (!workspaceEl) return;
			const rect = workspaceEl.getBoundingClientRect();
			// Show button if workspace is scrolled well above viewport
			setVisible(rect.bottom < 0);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!visible) return null;

	return (
		<button
			type="button"
			onClick={() => {
				const workspaceEl = document.getElementById("tool-workspace");
				if (workspaceEl) {
					workspaceEl.scrollIntoView({ behavior: "smooth", block: "start" });
				} else {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}}
			className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-foreground text-background text-xs font-semibold shadow-xl hover:opacity-90 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
			aria-label="Jump back to interactive tool"
		>
			<ArrowUp className="h-3.5 w-3.5" />
			<span>Jump to Tool</span>
		</button>
	);
}
