/**
 * Privacy hub grouping for src/app/(privacy-tools)/privacy-tools/page.tsx.
 *
 * Kept in a pure data module (no component imports) so tests can verify
 * coverage without rendering a client component: every tool in the
 * `privacy-tools` registry category must appear in exactly one group,
 * and every grouped id must resolve to a real registry tool. The groups
 * are derived from the tool ids/names only — no tool is renamed or
 * invented.
 */
export interface PrivacyHubGroup {
	heading: string;
	blurb: string;
	toolIds: string[];
}

export const PRIVACY_HUB_GROUPS: PrivacyHubGroup[] = [
	{
		heading: "Detect & check",
		blurb: "Spot AI-written content, risky links and weak site security.",
		toolIds: [
			"ai-text-detector",
			"ai-image-detector",
			"phishing-url-checker",
			"domain-reputation-checker",
			"security-headers-checker",
			"ssl-certificate-checker",
			"data-breach-checker",
			"password-strength-checker",
		],
	},
	{
		heading: "Email safety & deliverability",
		blurb: "Validate addresses, inspect headers and test spam scores.",
		toolIds: [
			"email-validator",
			"email-deliverability-checker",
			"email-header-analyzer",
			"email-subject-line-tester",
			"email-preview-generator",
			"spam-word-checker",
			"spam-score-checker",
		],
	},
	{
		heading: "Compliance & policies",
		blurb: "Consent banners, policy audits and breach paperwork.",
		toolIds: [
			"pii-scrubber",
			"cookie-consent-generator",
			"consent-management-generator",
			"gdpr-compliance-checker",
			"privacy-policy-auditor",
			"data-retention-policy-generator",
			"breach-notification-generator",
			"data-anonymization-report-generator",
		],
	},
];
