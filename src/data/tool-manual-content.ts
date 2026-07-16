export interface ManualToolContent {
	whatItIs: string;
	features: string[];
	howToUse: {
		name: string;
		steps: { name: string; text: string }[];
	};
	faqs: { question: string; answer: string }[];
	seoDescription: string;
}

export const MANUAL_TOOL_CONTENT: Record<string, ManualToolContent> = {};
