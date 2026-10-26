/**
 * Health hub grouping for src/app/(health)/health/page.tsx.
 *
 * Kept in a pure data module (no component imports) so tests can verify
 * coverage without rendering a client component: every tool in the
 * `health` registry category must appear in exactly one group, and
 * every grouped id must resolve to a real registry tool. The group is
 * derived from the tool ids/names only — no tool is renamed or
 * invented. All five tools are calculators, so one group is the
 * honest grouping; splitting them into singleton groups would be
 * padding, not structure.
 */
export interface HealthHubGroup {
	heading: string;
	blurb: string;
	toolIds: string[];
}

export const HEALTH_HUB_GROUPS: HealthHubGroup[] = [
	{
		heading: "Health calculators",
		blurb: "Estimate metabolic rate, calorie needs, macros and body composition.",
		toolIds: [
			"bmr-calculator",
			"tdee-calculator",
			"macro-calculator",
			"ideal-body-weight-calculator",
			"body-fat-calculator",
		],
	},
];
