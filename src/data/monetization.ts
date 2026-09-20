import type { MonetizationSafety } from "./seo-opportunities";

export const monetizationRules = {
	riskySlugs: [
		"youtube-video-downloader",
		"youtube-shorts-downloader",
		"tiktok-downloader",
		"tiktok-saver-no-watermark",
		"instagram-downloader",
		"instagram-reel-downloader",
		"instagram-reels-downloader",
		"facebook-video-downloader",
		"facebook-story-downloader",
		"mp4-to-mp3",
		"online-video-downloader",
		"universal-video-downloader",
		"free-mp3-extractor",
		"video-downloader",
		"reddit-video-downloader",
		"twitter-video-downloader",
		// Credential & sensitive security tools: protect from ad scripts and session replay
		"password-generator",
		"api-key-tester",
		"jwt-debugger",
		"jwt-decoder",
		"token-generator",
		"hash-generator",
		"bcrypt-generator",
		"bcrypt-hash-generator",
		"private-key-generator",
		"aes-encryption",
		"rsa-key-generator",
		"secret-key-generator",
		"credit-card-validator",
	],
	riskyCategories: [
		"downloaders",
		"youtube",
		"social",
		"video",
		"youtube-redirects",
		"credentials",
		"passwords",
		"tokens",
		"security",
		"encryption",
	],
	noAdsOnRiskyPages: true,
};

export type MonetizationDecision = {
	safety: MonetizationSafety;
	adsAllowed: boolean;
	indexable: boolean;
	affiliateAllowed: boolean;
	serviceCTA: boolean;
	reason: string;
};

export function getMonetizationDecision({
	slug = "",
	category = "",
	overrideSafety,
}: {
	slug?: string;
	category?: string;
	overrideSafety?: MonetizationSafety;
}): MonetizationDecision {
	const normalizedSlug = slug.toLowerCase();
	const normalizedCategory = category.toLowerCase();
	const isDownloaderLike = /downloader|media-saver|clip-saver|thumbnail-downloader|story-downloader|reel-downloader/i.test(normalizedSlug);
	const isCredentialSensitive = /api-key-tester|password|credential|token|secret-key|private-key|jwt/i.test(normalizedSlug);
	const isDeceptiveGenerator = /fake-chat-generator/i.test(normalizedSlug);
	const isRiskySlug =
		monetizationRules.riskySlugs.some((item) => normalizedSlug.includes(item)) ||
		isDownloaderLike ||
		isCredentialSensitive ||
		isDeceptiveGenerator;
	const isRiskyCategory =
		monetizationRules.riskyCategories.some((item) => normalizedCategory.includes(item)) ||
		normalizedCategory === "youtube";
	const safety = overrideSafety || (isRiskySlug || isRiskyCategory ? "risky" : "safe");

	if (safety === "risky") {
		return {
			safety,
			adsAllowed: false,
			indexable: false,
			affiliateAllowed: false,
			serviceCTA: false,
			reason: "Ads and indexing disabled on downloader, copyright-sensitive, deceptive, or account-risk pages.",
		};
	}

	if (safety === "caution") {
		return {
			safety,
			adsAllowed: false,
			indexable: false,
			affiliateAllowed: true,
			serviceCTA: false,
			reason: "Ads disabled by caution policy; contextual recommendations only.",
		};
	}

	return {
		safety,
		adsAllowed: true,
		indexable: true,
		affiliateAllowed: true,
		serviceCTA: true,
		reason: "Safe utility page suitable for tasteful in-flow ads and contextual CTAs.",
	};
}

export const affiliateRecommendations = {
	design: {
		label: "Design workflow",
		title: "Need templates or menu designs?",
		description: "Use this slot for a design affiliate such as Canva templates, kept contextual to QR and image pages.",
	},
	developer: {
		label: "Developer workflow",
		title: "Building an API-backed app?",
		description: "Use this slot for hosting, monitoring, or developer API affiliate offers relevant to the current tester.",
	},
	seo: {
		label: "SEO workflow",
		title: "Auditing a live website?",
		description: "Use this slot for hosting, indexing, analytics, or SEO monitoring recommendations.",
	},
	hosting: {
		label: "Hosting workflow",
		title: "Need faster hosting?",
		description: "Use this slot for hosting credits or performance-focused infrastructure recommendations.",
	},
} as const;
