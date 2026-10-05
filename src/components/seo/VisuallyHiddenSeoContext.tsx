import React from "react";

export interface VisuallyHiddenSeoContextProps {
	toolName: string;
	description: string;
	category?: string;
	executionType?: "client" | "external" | "hybrid" | "server";
	features?: string[];
	supportedFormats?: string[];
	steps?: { name: string; text: string }[];
}

/**
 * VisuallyHiddenSeoContext
 *
 * Provides legitimate semantic context, workflow instructions, and accessibility
 * descriptions for screen readers and no-JS crawler discovery using Tailwind's `sr-only`.
 *
 * Rules:
 * - No keyword stuffing or unnatural synonym lists.
 * - Represents strictly truthful information that matches the visible page experience.
 * - Does NOT use display:none or visibility:hidden.
 */
export function VisuallyHiddenSeoContext({
	toolName,
	description,
	category,
	executionType = "client",
	features = [],
	supportedFormats = [],
	steps = [],
}: VisuallyHiddenSeoContextProps) {
	const isLocal = executionType === "client";
	const cleanCategory = category ? category.replace(/-tools$/, "").replace(/-/g, " ") : "utility";

	return (
		<section
			className="sr-only"
			aria-label={`Accessibility and semantic context for ${toolName}`}
		>
			<h2>About {toolName}</h2>
			<p>{description}</p>
			
			<h3>Category and Purpose</h3>
			<p>
				{toolName} is a focused {cleanCategory} utility designed for browser-based workflows without mandatory account registration.
			</p>

			<h3>Privacy and Data Processing Model</h3>
			<p>
				{isLocal
					? "Local Browser Execution: All processing and calculations run directly on your device using client-side JavaScript, WebAssembly, or Canvas APIs. Your files, documents, and inputs remain in your browser session and are not transmitted to or stored on SopKit servers."
					: "External Processing Notice: This tool coordinates with external APIs to produce the requested output. Inputs submitted are processed to return your result. Check the tool notice before entering confidential credentials."}
			</p>

			{supportedFormats.length > 0 && (
				<div>
					<h3>Supported Formats</h3>
					<p>Supported input and output formats include: {supportedFormats.join(", ")}.</p>
				</div>
			)}

			{features.length > 0 && (
				<div>
					<h3>Key Capabilities</h3>
					<ul>
						{features.slice(0, 6).map((feature, idx) => (
							<li key={idx}>{feature}</li>
						))}
					</ul>
				</div>
			)}

			{steps.length > 0 && (
				<div>
					<h3>Step-by-Step Procedure</h3>
					<ol>
						{steps.map((step, idx) => (
							<li key={idx}>
								<strong>{step.name}:</strong> {step.text}
							</li>
						))}
					</ol>
				</div>
			)}
		</section>
	);
}

export default VisuallyHiddenSeoContext;
