export type SeoDifficulty = "low" | "medium" | "high" | "extreme";
export type MonetizationSafety = "safe" | "caution" | "risky";

// Long-tail "SEO opportunity" pages.
//
// An entry survives here only when it delivers something the parent tool
// does not offer by default: an exam-specific photo or signature preset, a
// distinct QR payload type, a distinct unit, or a specific academic
// calculator tab. Each entry's prose is written for its own preset values
// and must not be a keyword-swapped copy of a sibling.
//
// `standalone: true` entries are rendered at /<slug> by
// src/app/(intent)/[slug]/page.tsx and listed in the sitemap.
// `standalone: false` entries share a slug with a real registry tool; the
// real tool page renders them through ToolLayout (SeoOpportunityContent)
// and they never get a route of their own.
//
// Retired entries (numeric KB permutations, provider API-key clones, GPA
// synonym pages, "-online"/"-free" twins) are 301-redirected to their parent
// tool via src/seo/redirects/opportunities.json. Do not re-add them here.

export type SeoOpportunity = {
	slug: string;
	route: string;
	parentToolSlug: string;
	parentToolRoute: string;
	title: string;
	h1: string;
	keyword: string;
	difficulty: SeoDifficulty;
	intent: string;
	searchIntent: string;
	category: string;
	categoryHub: string;
	priority: 1 | 2 | 3 | 4;
	standalone: boolean;
	monetizationSafety: MonetizationSafety;
	metaDescription: string;
	intro: string;
	steps: string[];
	useCases: string[];
	commonProblems: string[];
	faqs: { question: string; answer: string }[];
	relatedSlugs: string[];
	recommendedCTA: string;
	canonicalStrategy: string;
	toolPreset?:
		| {
				type: "exam-image";
				examName: string;
				width: number;
				height: number;
				minKb: number;
				maxKb: number;
				showSignatureOption?: boolean;
				unit?: "px" | "cm" | "inch";
		  }
		| { type: "attendance" }
		| { type: "grades"; defaultTab: "sgpa" | "cgpa" | "cgpa-pct" | "req-marks" }
		| { type: "api-key"; provider: string }
		| { type: "qr"; sample: string }
		| { type: "seo-check"; mode: "open-graph" | "meta-tags" }
		| { type: "pdf-compress" }
		| { type: "pdf-to-image" }
		| { type: "pdf-unlock" }
		| { type: "pdf-protect" }
		| { type: "pdf-repair" }
		| { type: "pdf-delete-pages" }
		| { type: "pdf-merge" }
		| { type: "word-to-pdf" }
		| { type: "image-to-pdf" }
		| { type: "text-remove-dupes" }
		| { type: "text-word-counter" }
		| { type: "text-lorem-ipsum" }
		| { type: "text-case-converter" };
	monetization: {
		adsAllowed: boolean;
		affiliateAllowed: boolean;
		serviceCTA: boolean;
		proUpsell: string;
		affiliateSlot?: "design" | "developer" | "seo" | "hosting";
	};
};

export const seoOpportunities: SeoOpportunity[] = [
	{
		slug: "compress-image-to-20kb",
		route: "/compress-image-to-20kb",
		parentToolSlug: "image-compressor",
		parentToolRoute: "/image-compressor",
		title: "Compress Image to 20KB Online - Free Photo Compressor",
		h1: "Compress Image to 20KB Online",
		keyword: "compress image to 20kb",
		difficulty: "low",
		intent: "Users need a photo that lands between 5KB and 20KB for a strict upload field.",
		searchIntent: "Exact 20KB photo compression.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Compress JPG, PNG, or WebP images to 20KB online for exam forms, job applications, and government forms. Free, fast, and no signup.",
		intro: "This preset starts at 350 x 350 pixels with a 5KB minimum and 20KB maximum. The compressor lowers JPEG quality step by step until the output lands inside that band, so you do not have to guess a quality slider yourself.",
		steps: ["Upload the photo. JPG, PNG, and WebP inputs are accepted; the output is always JPEG.", "Leave the 350 x 350 pixel preset and the 5KB-20KB band in place, or change the pixel size if your portal asks for a different frame.", "Run the compression and read the reported output size next to the preview.", "Zoom into the preview and confirm the face is still sharp before you download."],
		useCases: ["Portal fields that reject anything over 20KB", "Thumbnail-sized profile photos on recruitment sites", "A second, smaller copy of a photo already prepared at 50KB"],
		commonProblems: ["A PNG with transparency gets flattened to a white background on conversion to JPEG.", "A photo with a busy background needs much stronger compression than a plain-background photo to reach 20KB, which costs sharpness.", "If the portal also sets a 5KB minimum, a tiny source image can come out below it; start from a larger original."],
		faqs: [
			{ question: "Why does the output come out as JPEG when I uploaded a PNG?", answer: "JPEG is the only format where quality can be reduced finely enough to land between 5KB and 20KB. PNG is lossless and usually cannot get that small." },
			{ question: "Can I keep a different pixel size and still target 20KB?", answer: "Yes. The 350 x 350 value is only the starting preset. Change width and height to what your form lists and the KB band stays at 5KB-20KB." },
			{ question: "What if the result is still above 20KB?", answer: "Reduce the pixel dimensions first, then compress again. At 350 x 350 a plain-background photo reaches 20KB easily; large or detailed images may not." },
		],
		relatedSlugs: ["compress-image-to-10kb", "compress-image-to-30kb", "compress-image-to-50kb", "ssc-photo-resizer", "upsc-photo-resizer"],
		recommendedCTA: "Compress 100 photos at once with SopKit Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "20KB Limit", width: 350, height: 350, minKb: 5, maxKb: 20, showSignatureOption: false },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch compress multiple images with SopKit Pro.", affiliateSlot: "design" },
	},
	{
		slug: "compress-image-to-50kb",
		route: "/compress-image-to-50kb",
		parentToolSlug: "image-compressor",
		parentToolRoute: "/image-compressor",
		title: "Compress Image to 50KB Online - Free Form Photo Compressor",
		h1: "Compress Image to 50KB Online",
		keyword: "compress image to 50kb",
		difficulty: "low",
		intent: "Users need a portrait photo that lands between 10KB and 50KB for a form upload.",
		searchIntent: "Compress a photo under 50KB.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: true,
		monetizationSafety: "safe",
		metaDescription: "Compress JPG, PNG, or WebP images to 50KB online for SSC, railway, bank exam, job, and government form uploads. Free and private.",
		intro: "This preset frames the photo at 350 x 450 pixels (portrait) and targets a 10KB-50KB output. Unlike the general image compressor, which asks you for a quality value, this page fixes the KB band and resizes to the portrait frame first, so the result is ready for a form field without a second pass.",
		steps: ["Upload a recent, front-facing photo. JPG, PNG, and WebP are accepted.", "Keep the 350 x 450 pixel frame unless your form lists another size; the crop is portrait, so landscape photos are trimmed at the sides.", "Keep the 10KB-50KB band and run the compression. The tool lowers JPEG quality until the file is inside the band.", "Check the reported size and the preview, then download the JPEG and upload it to the form."],
		useCases: ["Form photo fields with a 50KB ceiling", "Recruitment portals that also enforce a minimum size, here 10KB", "Preparing a photo once and reusing it across several applications with the same limit"],
		commonProblems: ["A landscape photo is cropped to the 350 x 450 portrait frame; centre the face before uploading if the crop cuts it off.", "Dark or textured backgrounds hold more detail and compress less, so they may need a lower quality setting to reach 50KB.", "A file that lands under 10KB can be rejected by portals that enforce a minimum; use a larger or sharper original."],
		faqs: [
			{ question: "What does this page do that the image compressor does not?", answer: "It fixes the output band at 10KB-50KB and resizes to a 350 x 450 pixel portrait frame first. The general compressor only changes quality and leaves dimensions alone." },
			{ question: "Can I change the 350 x 450 size?", answer: "Yes. Edit the width and height fields if your form lists different pixel dimensions. The 50KB maximum stays in place." },
			{ question: "Is a 50KB photo sharp enough to read a face?", answer: "At 350 x 450 pixels, 50KB allows moderate JPEG quality, which keeps facial features clear. Heavier backgrounds use up that budget faster." },
			{ question: "Does the photo leave my device?", answer: "No. Resizing and compression run in your browser; SopKit does not receive or store the original or the output." },
		],
		relatedSlugs: ["compress-image-to-20kb", "compress-image-to-100kb", "image-compressor", "ssc-photo-resizer", "railway-exam-photo-resizer"],
		recommendedCTA: "Batch compress all application images with SopKit Pro.",
		canonicalStrategy: "Standalone preset page canonicalized to itself and linked from the image compressor.",
		toolPreset: { type: "exam-image", examName: "50KB Limit", width: 350, height: 450, minKb: 10, maxKb: 50, showSignatureOption: false },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch compress multiple images with SopKit Pro.", affiliateSlot: "design" },
	},
	{
		slug: "ssc-photo-resizer",
		route: "/ssc-photo-resizer",
		parentToolSlug: "ssc-photo-resizer",
		parentToolRoute: "/ssc-photo-resizer",
		title: "SSC Photo Resizer - Resize Photo and Signature for SSC Forms",
		h1: "SSC Photo Resizer",
		keyword: "ssc photo resizer",
		difficulty: "low",
		intent: "SSC candidates need a photo in the 350 x 450 pixel, 20KB-50KB preset and a matching signature file.",
		searchIntent: "Prepare SSC form photo and signature uploads.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize SSC photos to 350x450 pixels and 20KB-50KB, and signatures to 10KB-20KB. Free browser-based SSC image resizer.",
		intro: "The SSC preset frames the photo at 350 x 450 pixels and targets 20KB-50KB. A signature mode is built in, so you can switch to the signature frame on the same page without changing tools.",
		steps: ["Upload a recent passport-style photo with a plain background.", "Stay in photo mode for the 350 x 450 pixel, 20KB-50KB preset, or switch to signature mode for the signature frame.", "Run the compression and compare the reported size against the band shown above the preview.", "Download the JPEG and upload it to the SSC portal; compare the preset against the current notification first."],
		useCases: ["SSC CGL, CHSL, and MTS application photos", "Signature files prepared on the same page in signature mode", "Re-checking an existing photo against the 20KB minimum"],
		commonProblems: ["A photo that is already small can fall below the 20KB minimum; upload a larger original.", "Signature files uploaded in photo mode get the portrait frame instead of the wide signature frame.", "A notification may add a date or name stamp requirement that this tool does not insert."],
		faqs: [
			{ question: "What preset does the SSC photo mode use?", answer: "350 x 450 pixels with an output band of 20KB-50KB. Both values can be edited if the current SSC notification lists something different." },
			{ question: "How do I prepare the signature on this page?", answer: "Switch to signature mode. It changes the frame and KB band to the signature preset, so the file is not forced into the portrait photo frame." },
			{ question: "Is the preset guaranteed to match this year's SSC form?", answer: "No. The preset reflects the common SSC values; the official notification for your exam is the authority, so compare before uploading." },
		],
		relatedSlugs: ["ssc-signature-resizer", "compress-image-to-50kb", "signature-resizer-under-20kb", "upsc-photo-resizer", "railway-exam-photo-resizer"],
		recommendedCTA: "Use SopKit Pro for batch SSC photo and signature preparation.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "SSC", width: 350, height: 450, minKb: 20, maxKb: 50, showSignatureOption: true },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch process SSC photos and signatures with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "ssc-signature-resizer",
		route: "/ssc-signature-resizer",
		parentToolSlug: "ssc-photo-resizer",
		parentToolRoute: "/ssc-photo-resizer",
		title: "SSC Signature Resizer - Compress Signature to 10KB-20KB",
		h1: "SSC Signature Resizer",
		keyword: "ssc signature resizer",
		difficulty: "low",
		intent: "SSC applicants need a signature file in a 350 x 200 pixel frame between 10KB and 20KB.",
		searchIntent: "Resize and compress SSC signature images.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: true,
		monetizationSafety: "safe",
		metaDescription: "Resize and compress SSC signatures to the common 10KB-20KB range online. Free, private, and no signup required.",
		intro: "This page opens directly in the SSC signature preset: a wide 350 x 200 pixel frame with a 10KB-20KB output band. The SSC photo resizer defaults to the portrait photo frame, so use this page when the signature is the only file you still need.",
		steps: ["Sign on plain white paper with dark ink and photograph or scan it straight on.", "Upload the image and crop so the ink fills most of the 350 x 200 frame; large white margins shrink the signature.", "Run the compression. The tool lowers JPEG quality until the file is between 10KB and 20KB.", "Download the JPEG and check that thin strokes are still visible at full size."],
		useCases: ["The signature field on SSC CGL, CHSL, and MTS forms", "Replacing a signature that was rejected for being over 20KB", "Producing a signature file that also clears the 10KB minimum"],
		commonProblems: ["Excess white space around the ink leaves the signature tiny inside the 350 x 200 frame.", "A clean, mostly white scan can compress below 10KB; raise the quality or use a slightly larger scan.", "Shadows from photographing a page turn into grey blotches that survive compression."],
		faqs: [
			{ question: "How is this different from the SSC photo resizer?", answer: "It starts in the signature preset (350 x 200 pixels, 10KB-20KB) instead of the 350 x 450 pixel photo preset, so there is no mode to switch." },
			{ question: "Why is there a 10KB minimum?", answer: "The preset mirrors a band with a floor as well as a ceiling. A signature that compresses below 10KB can be refused by portals that enforce the floor." },
			{ question: "Should the signature be a JPG or PNG?", answer: "The output is JPEG. If a form explicitly asks for another format, convert the downloaded JPEG afterwards." },
			{ question: "Does SopKit keep my signature?", answer: "No. Cropping and compression happen in your browser, and nothing is uploaded to SopKit." },
		],
		relatedSlugs: ["ssc-photo-resizer", "signature-resizer-under-20kb", "upsc-signature-resizer", "form-image-size-checker", "compress-image-to-20kb"],
		recommendedCTA: "Batch prepare SSC documents with SopKit Pro.",
		canonicalStrategy: "Standalone signature preset page canonicalized to itself.",
		toolPreset: { type: "exam-image", examName: "SSC Signature", width: 350, height: 200, minKb: 10, maxKb: 20, showSignatureOption: false },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch prepare SSC signatures with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "upsc-photo-resizer",
		route: "/upsc-photo-resizer",
		parentToolSlug: "upsc-photo-resizer",
		parentToolRoute: "/upsc-photo-resizer",
		title: "UPSC Photo Resizer - Resize Photo and Signature Online",
		h1: "UPSC Photo Resizer",
		keyword: "upsc photo resizer",
		difficulty: "low",
		intent: "UPSC applicants need a square 350 x 350 pixel photo between 20KB and 300KB, plus a signature file.",
		searchIntent: "UPSC form photo preparation.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize and compress UPSC photos and signatures online for IAS, IFS, and other UPSC application forms. Free and browser-based.",
		intro: "The UPSC preset is square: 350 x 350 pixels with a wide 20KB-300KB output band. Because the ceiling is generous, the tool keeps JPEG quality high and spends most of its effort on the square crop. Signature mode is available on the same page.",
		steps: ["Upload a front-facing photo with the head centred; the square crop trims the longer side.", "Stay in photo mode for the 350 x 350 pixel, 20KB-300KB preset, or switch to signature mode.", "Run the compression. With a 300KB ceiling most photos keep near-original quality.", "Download the JPEG and compare the preset against the current UPSC notification before uploading."],
		useCases: ["UPSC CSE and IFS application photos", "Signature files prepared in signature mode on the same page", "Converting a rectangular passport photo into the square frame"],
		commonProblems: ["The square crop can cut the chin or hair if the face is near an edge of the original.", "A very small original can come out under the 20KB floor.", "A notification may specify background colour or a date stamp that this tool does not add."],
		faqs: [
			{ question: "Why is the UPSC preset square?", answer: "The preset uses 350 x 350 pixels, so the crop is 1:1. Centre the face before uploading so the square does not cut it." },
			{ question: "Why is the 300KB ceiling so much higher than the SSC preset?", answer: "The two presets mirror different bands. With 300KB available at 350 x 350 pixels the tool rarely needs to lower quality at all." },
			{ question: "Can I do the signature here too?", answer: "Yes. Switch to signature mode on this page, or open the UPSC signature resizer, which starts in that mode." },
		],
		relatedSlugs: ["upsc-signature-resizer", "ssc-photo-resizer", "compress-image-to-50kb", "resize-image-in-cm", "form-image-size-checker"],
		recommendedCTA: "Batch prepare UPSC images with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "UPSC", width: 350, height: 350, minKb: 20, maxKb: 300, showSignatureOption: true },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch prepare UPSC photos and signatures with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "upsc-signature-resizer",
		route: "/upsc-signature-resizer",
		parentToolSlug: "upsc-photo-resizer",
		parentToolRoute: "/upsc-photo-resizer",
		title: "UPSC Signature Resizer Online - Free Signature Compressor",
		h1: "UPSC Signature Resizer",
		keyword: "upsc signature resizer",
		difficulty: "low",
		intent: "UPSC applicants need a signature in a 350 x 150 pixel frame between 20KB and 300KB.",
		searchIntent: "UPSC signature image preparation.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: true,
		monetizationSafety: "safe",
		metaDescription: "Resize and compress UPSC signature images online. Prepare a clean JPG signature file for UPSC forms without signup.",
		intro: "This page opens in the UPSC signature preset: a wide 350 x 150 pixel strip with a 20KB-300KB output band. The 20KB floor matters more than the ceiling here, because a clean white scan of a signature is naturally small.",
		steps: ["Sign in dark ink on white paper and photograph or scan it without shadows.", "Upload and crop tightly; the 350 x 150 frame is wide and short, so tall margins waste most of it.", "Run the compression and check the reported size sits between 20KB and 300KB.", "Download the JPEG and compare the preset against the current UPSC notification before uploading."],
		useCases: ["The signature field on UPSC CSE and IFS forms", "Replacing a signature that was refused for being under 20KB", "Trimming a full-page scan down to the signature strip"],
		commonProblems: ["A mostly white scan compresses below 20KB; keep quality high or scan at a larger size.", "A signature cropped tall and narrow leaves empty space on both sides of the 350 x 150 strip.", "Light-coloured ink fades further once the image is downscaled to 150 pixels tall."],
		faqs: [
			{ question: "Why does this preset have a 20KB minimum?", answer: "The band mirrors a floor as well as a ceiling. Signatures on white paper are small files, so the floor is the limit you are most likely to hit." },
			{ question: "How is this different from the SSC signature preset?", answer: "The frame is 350 x 150 pixels instead of 350 x 200, and the band is 20KB-300KB instead of 10KB-20KB." },
			{ question: "Can I use the UPSC photo resizer instead?", answer: "Yes, by switching it to signature mode. This page simply starts there." },
			{ question: "Is the signature uploaded anywhere?", answer: "No. The crop and compression run in your browser; SopKit never receives the file." },
		],
		relatedSlugs: ["upsc-photo-resizer", "signature-resizer-under-20kb", "ssc-signature-resizer", "resize-image-in-mm", "form-image-size-checker"],
		recommendedCTA: "Batch process UPSC document images with Pro.",
		canonicalStrategy: "Standalone signature preset page canonicalized to itself.",
		toolPreset: { type: "exam-image", examName: "UPSC Signature", width: 350, height: 150, minKb: 20, maxKb: 300, showSignatureOption: false },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch process signatures with SopKit Pro.", affiliateSlot: "design" },
	},
	{
		slug: "neet-photo-resizer",
		route: "/neet-photo-resizer",
		parentToolSlug: "neet-photo-resizer",
		parentToolRoute: "/neet-photo-resizer",
		title: "NEET Photo Resizer - Resize NEET Photo and Signature Online",
		h1: "NEET Photo Resizer",
		keyword: "neet photo resizer",
		difficulty: "low",
		intent: "NEET applicants need a 480 x 640 pixel photo between 10KB and 200KB and a signature file.",
		searchIntent: "NEET application image preparation.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize and compress NEET photo and signature images online for NTA application forms. Free, private, and no signup.",
		intro: "The NEET preset is the largest exam frame on SopKit: 480 x 640 pixels (a 3:4 portrait) with a 10KB-200KB band. The larger frame keeps more facial detail than the 350-pixel presets, and signature mode is available on the same page.",
		steps: ["Upload a recent portrait photo; the 3:4 frame trims landscape originals at the sides.", "Keep the 480 x 640 pixel, 10KB-200KB preset, or switch to signature mode for the signature file.", "Run the compression and read the output size next to the preview.", "Download the JPEG and check the preset against the current NTA information bulletin before uploading."],
		useCases: ["NEET UG application photo", "Signature file prepared in signature mode", "Upscaling a small passport photo into the 480 x 640 frame"],
		commonProblems: ["A low-resolution original upscaled to 480 x 640 looks soft; start from the largest copy you have.", "A square or landscape photo loses its sides in the 3:4 crop.", "The bulletin may require a specific background or a name and date on the photo, which this tool does not add."],
		faqs: [
			{ question: "What size does the NEET preset produce?", answer: "480 x 640 pixels, with the file compressed to between 10KB and 200KB. Both can be edited if the bulletin lists other values." },
			{ question: "Why is this frame bigger than the SSC or UPSC preset?", answer: "The preset mirrors a 480 x 640 requirement. The larger frame keeps more detail, so a sharp original matters more here." },
			{ question: "Can I prepare the signature on this page?", answer: "Yes. Switch to signature mode and the frame and KB band change to the signature preset." },
		],
		relatedSlugs: ["jee-photo-resizer", "cuet-photo-resizer", "compress-image-to-50kb", "signature-resizer-under-20kb", "resize-image-in-cm"],
		recommendedCTA: "Batch prepare NTA images with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "NEET", width: 480, height: 640, minKb: 10, maxKb: 200, showSignatureOption: true },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch prepare NEET photos with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "jee-photo-resizer",
		route: "/jee-photo-resizer",
		parentToolSlug: "jee-photo-resizer",
		parentToolRoute: "/jee-photo-resizer",
		title: "JEE Photo Resizer - Resize JEE Main Photo and Signature",
		h1: "JEE Photo Resizer",
		keyword: "jee photo resizer",
		difficulty: "low",
		intent: "JEE candidates need a 350 x 450 pixel photo between 10KB and 200KB and a signature file.",
		searchIntent: "JEE form photo preparation.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize JEE Main photo and signature images online for NTA application uploads. Free browser-based image tool, no signup.",
		intro: "The JEE preset uses a 350 x 450 pixel portrait frame with a 10KB-200KB band. It shares the frame with the SSC preset but has a far higher ceiling, so the tool can keep JPEG quality high instead of pushing the file toward 50KB.",
		steps: ["Upload a front-facing portrait photo; the 350 x 450 frame trims landscape originals.", "Keep the photo preset, or switch to signature mode on the same page for the signature file.", "Run the compression. With a 200KB ceiling most photos need little quality reduction.", "Download the JPEG and compare the preset against the current JEE Main bulletin before uploading."],
		useCases: ["JEE Main application photo", "Signature file prepared in signature mode", "Reusing an SSC-sized 350 x 450 photo at higher quality"],
		commonProblems: ["A photo where the face is small in the frame stays small after resizing; crop closer first.", "A tiny original can come out under the 10KB floor.", "Signature files uploaded in photo mode get the portrait frame instead of the signature frame."],
		faqs: [
			{ question: "What does the JEE preset produce?", answer: "A 350 x 450 pixel JPEG between 10KB and 200KB. Edit either value if the current bulletin lists something different." },
			{ question: "How is this different from the SSC preset with the same frame?", answer: "The ceiling is 200KB instead of 50KB, so the output keeps higher JPEG quality for the same pixel size." },
			{ question: "Does the page handle the signature too?", answer: "Yes. Switch to signature mode to get the signature frame and band." },
		],
		relatedSlugs: ["neet-photo-resizer", "cuet-photo-resizer", "compress-image-to-50kb", "resize-image-in-mm", "image-dpi-converter"],
		recommendedCTA: "Batch prepare exam photos with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "JEE", width: 350, height: 450, minKb: 10, maxKb: 200, showSignatureOption: true },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch prepare JEE photos with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "resize-image-in-cm",
		route: "/resize-image-in-cm",
		parentToolSlug: "image-resizer",
		parentToolRoute: "/image-resizer",
		title: "Resize Image in CM Online - Photo Size Converter",
		h1: "Resize Image in CM Online",
		keyword: "resize image in cm",
		difficulty: "low",
		intent: "Users need to enter a photo size in centimetres instead of pixels.",
		searchIntent: "Resize a photo by centimeter dimensions.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize images in centimeters online for passport photos, exam forms, job applications, and government portals. Free and no signup.",
		intro: "The general image resizer only takes pixel values. This page switches the unit to centimetres, so a form that says 3.5 cm x 4.5 cm can be typed in as written. The tool converts the centimetre size to pixels at the chosen DPI and applies a 10KB-100KB output band.",
		steps: ["Upload the photo.", "Enter the width and height in centimetres exactly as the form states them.", "Keep or adjust the 10KB-100KB band if the form also sets a file-size limit.", "Download the resized JPEG and check the pixel dimensions shown in the result."],
		useCases: ["Passport-style photo sizes stated in centimetres", "Application forms that list a physical size rather than pixels", "Converting a centimetre requirement into the pixel size a portal actually checks"],
		commonProblems: ["The same centimetre size gives different pixel sizes at different DPI values; a portal that checks pixels may need a specific DPI.", "A form may give both a centimetre size and a KB limit, and both must be met.", "Resizing fixes the dimensions but not the crop; a badly framed face stays badly framed."],
		faqs: [
			{ question: "How does a centimetre size become a pixel size?", answer: "Pixels = centimetres / 2.54 x DPI. At 300 DPI, 3.5 cm is about 413 pixels; at 96 DPI it is about 132 pixels. The result shows the pixel size it produced." },
			{ question: "Why does this page exist alongside the image resizer?", answer: "The image resizer accepts only pixel values. This preset starts in centimetre mode and adds a 10KB-100KB file-size band." },
			{ question: "Can I switch to millimetres?", answer: "Use the resize-in-mm page, which starts in that unit; the conversion works the same way." },
		],
		relatedSlugs: ["resize-image-in-mm", "image-dpi-converter", "compress-image-to-50kb", "passport-photo-maker", "ssc-photo-resizer"],
		recommendedCTA: "Batch resize form photos with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "CM Resize", width: 35, height: 45, minKb: 10, maxKb: 100, showSignatureOption: false, unit: "cm" },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch resize images with SopKit Pro.", affiliateSlot: "design" },
	},
	{
		slug: "resize-image-in-mm",
		route: "/resize-image-in-mm",
		parentToolSlug: "image-resizer",
		parentToolRoute: "/image-resizer",
		title: "Resize Image in MM Online - Photo Size Converter",
		h1: "Resize Image in MM Online",
		keyword: "resize image in mm",
		difficulty: "low",
		intent: "Users need to enter a photo size in millimetres instead of pixels.",
		searchIntent: "Resize a photo by millimeter dimensions.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Resize images in millimeters online for passport photos, exam forms, certificates, and application uploads. Free browser tool.",
		intro: "Some forms state photo size in millimetres, for example 35 mm x 45 mm. This page takes that value directly instead of making you convert to pixels, then applies a 10KB-100KB output band so the file is also small enough to upload.",
		steps: ["Upload the photo.", "Enter the width and height in millimetres as the form states them.", "Keep or adjust the 10KB-100KB band if the form also limits file size.", "Download the resized JPEG and note the pixel dimensions reported with it."],
		useCases: ["35 mm x 45 mm photo requirements", "Certificate and ID uploads specified in millimetres", "Checking what pixel size a millimetre requirement turns into at a given DPI"],
		commonProblems: ["Millimetre sizes depend on DPI once converted to pixels; a portal that checks pixels may expect a specific DPI.", "A millimetre size and a KB limit are separate checks, and the file must pass both.", "Resizing does not re-centre the face; crop before resizing if the framing is off."],
		faqs: [
			{ question: "How are millimetres converted to pixels?", answer: "Pixels = millimetres / 25.4 x DPI. At 300 DPI, 35 mm is about 413 pixels. The result shows the pixel size produced." },
			{ question: "Is this the same as the centimetre page?", answer: "The conversion is the same; only the unit you type differs. Use whichever matches the wording on your form." },
			{ question: "Does the file-size band apply here too?", answer: "Yes. The output is compressed to between 10KB and 100KB after resizing; edit the band if your form lists another limit." },
		],
		relatedSlugs: ["resize-image-in-cm", "image-dpi-converter", "compress-image-to-20kb", "upsc-photo-resizer", "form-image-size-checker"],
		recommendedCTA: "Batch resize images with SopKit Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "MM Resize", width: 35, height: 45, minKb: 10, maxKb: 100, showSignatureOption: false, unit: "cm" },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: false, proUpsell: "Batch resize form photos with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "image-dpi-converter",
		route: "/image-dpi-converter",
		parentToolSlug: "image-dpi-converter",
		parentToolRoute: "/image-dpi-converter",
		title: "Image DPI Converter Online - Convert Photo to 300 DPI",
		h1: "Image DPI Converter Online",
		keyword: "image dpi converter",
		difficulty: "low",
		intent: "Users need a photo whose DPI and physical size match a print or form requirement.",
		searchIntent: "Convert or inspect image DPI.",
		category: "Exam Image Tools",
		categoryHub: "/exam-image-tools",
		priority: 1,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Convert image DPI online and prepare photos for 300 DPI print or form requirements. Free browser-based DPI and resize tool.",
		intro: "This preset prepares a 350 x 450 pixel photo for a stated DPI and a 10KB-200KB file size. DPI is metadata that tells a printer how many pixels fit in an inch; changing it does not add detail, so the page also lets you set the pixel size that a given physical size needs.",
		steps: ["Upload the photo.", "Choose the target DPI, or enter the physical size you need and let the tool work out the pixel size.", "Check the output pixel dimensions shown in the preview.", "Download the JPEG; the file sits inside the 10KB-200KB band."],
		useCases: ["Print shops or forms that ask for a 300 DPI photo", "Working out the pixel size for a physical size at a given DPI", "Attaching a DPI value to a photo that was exported without one"],
		commonProblems: ["Raising the DPI value on a small photo does not make it sharper; only more pixels do.", "A requirement that states both a physical size and a pixel size fixes the DPI for you, and they must agree.", "Many web portals ignore DPI and only check pixels and KB, so the pixel size is what matters there."],
		faqs: [
			{ question: "Does converting to 300 DPI improve quality?", answer: "No. DPI only tells a printer how densely to print the pixels you already have. To gain detail you need a larger original." },
			{ question: "How do pixels, DPI, and physical size relate?", answer: "Pixels = inches x DPI. A 3.5 cm wide photo (1.38 inches) needs about 413 pixels at 300 DPI." },
			{ question: "What file size does the preset produce?", answer: "A JPEG between 10KB and 200KB at 350 x 450 pixels by default; both the frame and the band can be edited." },
		],
		relatedSlugs: ["resize-image-in-cm", "resize-image-in-mm", "compress-image-to-50kb", "passport-photo-maker", "form-image-size-checker"],
		recommendedCTA: "Use Pro for batch DPI and size conversion.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "exam-image", examName: "300 DPI Photo", width: 350, height: 450, minKb: 10, maxKb: 200, showSignatureOption: false },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: true, proUpsell: "Batch convert image DPI with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "75-attendance-calculator",
		route: "/75-attendance-calculator",
		parentToolSlug: "75-attendance-calculator",
		parentToolRoute: "/75-attendance-calculator",
		title: "75 Attendance Calculator - How Many Classes Can I Miss?",
		h1: "75 Attendance Calculator",
		keyword: "75 attendance calculator",
		difficulty: "low",
		intent: "Students need to know attendance shortage or safe bunk count.",
		searchIntent: "Attendance percentage and classes-to-attend calculator.",
		category: "Student Calculators",
		categoryHub: "/student-calculators",
		priority: 2,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Calculate your 75% attendance, how many classes you can miss, or how many classes you must attend to recover. Free student calculator.",
		intro: "Enter attended and total classes to see whether you are above 75%, how many upcoming classes you can skip while staying above it, or how many consecutive classes you must attend to climb back.",
		steps: ["Enter the number of classes you attended.", "Enter the total number of classes conducted so far.", "Keep the target at 75%, or change it to your institution's rule.", "Read the safe-to-skip count if you are above target, or the classes-to-attend count if you are below."],
		useCases: ["Checking a shortage before an attendance cutoff", "Deciding whether one more absence is safe", "Planning how many classes to attend to recover from a shortfall"],
		commonProblems: ["Lectures and practicals are sometimes counted separately, so run the calculation per subject if your college does.", "Rounding rules differ: 74.6% may or may not count as 75% depending on the department.", "The recovery count assumes classes keep being held; holidays or cancelled sessions change it."],
		faqs: [
			{ question: "How is the attendance percentage worked out?", answer: "Attended classes divided by total classes conducted, multiplied by 100." },
			{ question: "How does it compute classes I can still miss?", answer: "It finds the largest number of additional absences for which (attended) / (total + absences) stays at or above the target." },
			{ question: "How does it compute classes I must attend?", answer: "It finds the smallest number of consecutive attended classes for which (attended + n) / (total + n) reaches the target." },
		],
		relatedSlugs: ["attendance-shortage-calculator", "sgpa-calculator", "cgpa-calculator", "required-marks-calculator", "cgpa-to-percentage-calculator"],
		recommendedCTA: "Save ad-free calculator presets with SopKit Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "attendance" },
		monetization: { adsAllowed: true, affiliateAllowed: false, serviceCTA: false, proUpsell: "Save calculator presets with SopKit Pro." },
	},
	{
		slug: "sgpa-calculator",
		route: "/sgpa-calculator",
		parentToolSlug: "sgpa-calculator",
		parentToolRoute: "/sgpa-calculator",
		title: "SGPA Calculator - Semester Grade Point Average Online",
		h1: "SGPA Calculator",
		keyword: "sgpa calculator",
		difficulty: "medium",
		intent: "Students calculate a semester grade average from credits and grade points.",
		searchIntent: "Academic grade calculation.",
		category: "Student Calculators",
		categoryHub: "/student-calculators",
		priority: 2,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Calculate SGPA from course credits and grade points. Free semester grade point average calculator for engineering and college students.",
		intro: "This page opens the academic grades calculator on the SGPA tab. Enter each subject's credits and grade points and it returns the credit-weighted average for the semester.",
		steps: ["Add one row per subject in the semester.", "Enter the credits for each subject.", "Enter the grade points earned in each subject.", "Read the SGPA: the sum of credits x grade points divided by the total credits."],
		useCases: ["Checking a semester result before the official grade card arrives", "Seeing how a single low grade moves the semester average", "Feeding semester values into the CGPA tab afterwards"],
		commonProblems: ["Grade-point scales differ between universities (10-point, 4-point, letter bands), so enter the points your institution assigns.", "Zero-credit or audit subjects should be left out, or they distort the weighting.", "Official transcripts may round differently from the calculator's displayed value."],
		faqs: [
			{ question: "What formula does the SGPA tab use?", answer: "SGPA = sum of (credits x grade points) across subjects divided by the sum of credits." },
			{ question: "Can I add more subjects?", answer: "Yes. Add or remove rows as needed; blank rows are ignored." },
			{ question: "Does it convert SGPA to CGPA?", answer: "Not on this tab. Switch to the CGPA tab, or open the CGPA calculator, and enter each semester's SGPA there." },
		],
		relatedSlugs: ["cgpa-calculator", "cgpa-to-percentage-calculator", "required-marks-calculator", "75-attendance-calculator"],
		recommendedCTA: "Save grade calculator presets with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "grades", defaultTab: "sgpa" },
		monetization: { adsAllowed: true, affiliateAllowed: false, serviceCTA: false, proUpsell: "Save semester grade presets with Pro." },
	},
	{
		slug: "cgpa-calculator",
		route: "/cgpa-calculator",
		parentToolSlug: "cgpa-calculator",
		parentToolRoute: "/cgpa-calculator",
		title: "CGPA Calculator - Calculate CGPA from Semester SGPA",
		h1: "CGPA Calculator",
		keyword: "cgpa calculator",
		difficulty: "medium",
		intent: "Students calculate a cumulative CGPA from semester SGPA values.",
		searchIntent: "Academic cumulative grade calculation.",
		category: "Student Calculators",
		categoryHub: "/student-calculators",
		priority: 2,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Calculate CGPA from semester SGPA values online. Free cumulative grade point average calculator for students.",
		intro: "This page opens the academic grades calculator on the CGPA tab. Enter one SGPA per completed semester and it returns the average across the semesters you filled in.",
		steps: ["Enter the SGPA for each completed semester.", "Add rows for further semesters as you need them.", "Leave future or blank semesters empty; they are ignored.", "Read the CGPA shown below the inputs."],
		useCases: ["Checking placement or scholarship eligibility that is stated as a minimum CGPA", "Estimating the CGPA after a projected semester result", "Combining SGPA values computed on the SGPA tab"],
		commonProblems: ["Some universities weight each semester by its credits; this tab averages SGPA values equally, so results can differ from an official credit-weighted CGPA.", "Entering rounded SGPA values compounds rounding in the final CGPA.", "A repeated or improved semester should be entered once, with the final SGPA."],
		faqs: [
			{ question: "How does the CGPA tab calculate the result?", answer: "It averages the SGPA values you entered. Blank or zero rows are skipped." },
			{ question: "My university uses credit-weighted CGPA. Will this match?", answer: "Only when every semester carries the same credits. Otherwise use the official formula for reporting and treat this as an estimate." },
			{ question: "How do I turn CGPA into a percentage?", answer: "Switch to the CGPA to percentage tab, which multiplies by a conversion factor you choose." },
		],
		relatedSlugs: ["sgpa-calculator", "cgpa-to-percentage-calculator", "required-marks-calculator", "75-attendance-calculator"],
		recommendedCTA: "Save academic calculator presets with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "grades", defaultTab: "cgpa" },
		monetization: { adsAllowed: true, affiliateAllowed: false, serviceCTA: false, proUpsell: "Save academic presets with Pro." },
	},
	{
		slug: "cgpa-to-percentage-calculator",
		route: "/cgpa-to-percentage-calculator",
		parentToolSlug: "cgpa-to-percentage-calculator",
		parentToolRoute: "/cgpa-to-percentage-calculator",
		title: "CGPA to Percentage Calculator - Convert CGPA Online",
		h1: "CGPA to Percentage Calculator",
		keyword: "cgpa to percentage calculator",
		difficulty: "medium",
		intent: "Students need a percentage estimate from a CGPA for forms and eligibility criteria.",
		searchIntent: "Convert CGPA to percentage.",
		category: "Student Calculators",
		categoryHub: "/student-calculators",
		priority: 2,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Convert CGPA to percentage online using common 9.5x, 10x, or custom university factors. Free student grade converter.",
		intro: "This page opens the academic grades calculator on the CGPA to percentage tab. Enter a CGPA, pick a multiplication factor such as 9.5 or 10, or type your university's own factor, and read the percentage.",
		steps: ["Enter your CGPA.", "Choose the 9.5x or 10x factor, or enter a custom factor from your university's rulebook.", "Read the percentage result.", "For official forms, quote the figure your university's published formula gives, even if it differs."],
		useCases: ["Forms that ask for a percentage when your transcript only shows CGPA", "Checking a percentage-based eligibility cutoff", "Comparing results from the 9.5x and 10x conventions"],
		commonProblems: ["Universities publish different factors, and some use a formula with an offset rather than a plain multiplier.", "A cutoff of, say, 60% can be met under one factor and missed under another.", "Rounding the CGPA before converting shifts the percentage."],
		faqs: [
			{ question: "Which factor should I use?", answer: "The one your university publishes. 9.5x and 10x are the two most common conventions and are offered as presets; a custom field covers everything else." },
			{ question: "Is the percentage official?", answer: "No. It is an estimate using the factor you chose. Official documents follow the institution's own rule." },
			{ question: "Can it convert the other way, percentage to CGPA?", answer: "Divide the percentage by the same factor. The tab is built for CGPA to percentage, so do the reverse by hand." },
		],
		relatedSlugs: ["cgpa-calculator", "sgpa-calculator", "required-marks-calculator", "75-attendance-calculator"],
		recommendedCTA: "Save common university formulas with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "grades", defaultTab: "cgpa-pct" },
		monetization: { adsAllowed: true, affiliateAllowed: false, serviceCTA: false, proUpsell: "Save conversion presets with Pro." },
	},
	{
		slug: "required-marks-calculator",
		route: "/required-marks-calculator",
		parentToolSlug: "required-marks-calculator",
		parentToolRoute: "/required-marks-calculator",
		title: "Required Marks Calculator - Final Exam Marks Needed",
		h1: "Required Marks Calculator",
		keyword: "required marks calculator",
		difficulty: "low",
		intent: "Students need the marks required in a final exam to reach a target overall percentage.",
		searchIntent: "Calculate marks needed in final exam.",
		category: "Student Calculators",
		categoryHub: "/student-calculators",
		priority: 2,
		standalone: false,
		monetizationSafety: "safe",
		metaDescription: "Calculate how many marks you need in a final exam to reach your target percentage or grade. Free required marks calculator.",
		intro: "This page opens the academic grades calculator on the required marks tab. Enter your internal marks, the internal and exam maximums, and a target percentage; it returns the marks you need in the final exam.",
		steps: ["Enter the internal marks you have already scored.", "Enter the maximum for internals and the maximum for the final exam.", "Set the target overall percentage (the pass mark, or a grade boundary).", "Read the marks needed in the final exam, or the message that the target is out of reach."],
		useCases: ["Working out the pass mark needed after weak internals", "Setting a study target for a specific grade boundary", "Checking whether a grade is still mathematically possible"],
		commonProblems: ["Universities may weight internals and finals differently from a plain sum; enter the maximums as they count toward the total.", "Practical or project marks are only included if you fold them into the internal inputs.", "Grace marks and moderation are not modelled."],
		faqs: [
			{ question: "What does the required marks tab calculate?", answer: "Required = target% x (internal max + exam max) minus internal marks scored. If that exceeds the exam maximum, the target is unreachable." },
			{ question: "Can I use it for the pass mark?", answer: "Yes. Enter the pass percentage as the target." },
			{ question: "What if my course weights the final exam more heavily?", answer: "Enter the maximums in the weighted form your course uses, for example 30 for internals and 70 for the exam, so the formula reflects the weighting." },
		],
		relatedSlugs: ["sgpa-calculator", "cgpa-calculator", "75-attendance-calculator"],
		recommendedCTA: "Save grade targets with Pro.",
		canonicalStrategy: "Registry tool page; this entry only supplies the on-page guidance.",
		toolPreset: { type: "grades", defaultTab: "req-marks" },
		monetization: { adsAllowed: true, affiliateAllowed: false, serviceCTA: false, proUpsell: "Save target marks presets with Pro." },
	},
	{
		slug: "qr-code-for-wifi",
		route: "/qr-code-for-wifi",
		parentToolSlug: "qr-code-generator",
		parentToolRoute: "/qr-code-generator",
		title: "QR Code for WiFi Password - Free WiFi QR Generator",
		h1: "QR Code for WiFi Password",
		keyword: "qr code for wifi",
		difficulty: "low",
		intent: "People want guests to join a WiFi network by scanning instead of typing the password.",
		searchIntent: "Generate WiFi QR details.",
		category: "Small Business QR Tools",
		categoryHub: "/qr-tools",
		priority: 4,
		standalone: true,
		monetizationSafety: "safe",
		metaDescription: "Create a WiFi QR code for guests to scan and join your network. Useful for cafes, offices, rentals, and homes. Free and no signup.",
		intro: "A WiFi QR code is not a link. It encodes a WIFI: payload (security type, network name, password) that phone cameras recognise and offer to join. This page pre-fills that payload format so you only replace the network name and password; the general QR generator starts with a plain URL instead.",
		steps: ["Replace Guest-WiFi in the pre-filled text with your exact network name (SSID), keeping the capitalisation.", "Replace guest-password with the password, and change T:WPA if the network uses a different security type.", "Generate the QR code and download the PNG or SVG.", "Scan it with both an iPhone and an Android phone before printing."],
		useCases: ["A guest WiFi card at a cafe counter or hotel room", "An office visitor network sign", "A rental or homestay welcome sheet"],
		commonProblems: ["The SSID is case-sensitive, and a typo produces a code that scans but never connects.", "A semicolon in the password must be escaped with a backslash or the payload breaks.", "Printing the main network's password on a public card exposes it; use a guest network."],
		faqs: [
			{ question: "What text does a WiFi QR code contain?", answer: "The format is WIFI:T:<security>;S:<network name>;P:<password>;; where T is WPA, WEP, or nopass. The page pre-fills this so you can edit the values in place." },
			{ question: "Will the code work on iPhone and Android?", answer: "Both platforms recognise the WIFI: payload from the built-in camera app and prompt to join the network." },
			{ question: "How is this different from the regular QR generator?", answer: "Only the starting payload. The regular generator starts with a URL; this page starts with the WIFI: format so you do not have to type it from memory." },
			{ question: "Does SopKit see my WiFi password?", answer: "No. The QR image is rendered in your browser and the text is never sent to SopKit." },
		],
		relatedSlugs: ["qr-code-for-upi-payment", "qr-code-generator", "qr-code-generator-business", "qr-code-reader"],
		recommendedCTA: "Need branded guest WiFi cards? Hire us.",
		canonicalStrategy: "Standalone WiFi payload page canonicalized to itself.",
		toolPreset: { type: "qr", sample: "WIFI:T:WPA;S:Guest-WiFi;P:guest-password;;" },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: true, proUpsell: "Create branded QR packs with Pro.", affiliateSlot: "design" },
	},
	{
		slug: "qr-code-for-upi-payment",
		route: "/qr-code-for-upi-payment",
		parentToolSlug: "qr-code-generator",
		parentToolRoute: "/qr-code-generator",
		title: "QR Code for UPI Payment - Free UPI QR Generator",
		h1: "QR Code for UPI Payment",
		keyword: "qr code for upi payment",
		difficulty: "low",
		intent: "Small businesses and individuals need a scannable UPI payment QR without a payment provider's app.",
		searchIntent: "Generate QR code for UPI payment link.",
		category: "Small Business QR Tools",
		categoryHub: "/qr-tools",
		priority: 4,
		standalone: true,
		monetizationSafety: "safe",
		metaDescription: "Create a QR code for a UPI payment link for shops, stalls, invoices, and small business payments. Free and no signup.",
		intro: "A UPI QR code encodes a upi://pay link with your UPI ID (VPA) and payee name. This page pre-fills that link format, so you replace name@upi and the payee name and generate; the general QR generator starts from a web URL instead.",
		steps: ["Replace name@upi in the pre-filled link with your UPI ID and Business with your payee name.", "Optionally add &am=<amount> for a fixed amount, or leave it out so the payer enters one.", "Generate the QR code and download the PNG or SVG.", "Scan it with a UPI app and confirm the payee name and ID shown before printing."],
		useCases: ["A counter-top payment card for a shop or stall", "A fixed-amount QR on an invoice", "A payment QR at an event table without a provider's hardware"],
		commonProblems: ["A typo in the UPI ID sends money to the wrong account or fails; verify by scanning first.", "A missing pn= (payee name) parameter makes some apps show a blank payee.", "A QR printed too small is hard to scan at a counter; test the printed size, not only the screen."],
		faqs: [
			{ question: "What does the UPI payload look like?", answer: "upi://pay?pa=<UPI ID>&pn=<payee name>, with optional &am=<amount> and &cu=INR. The page pre-fills the required part." },
			{ question: "Does SopKit handle the payment?", answer: "No. The QR code only carries the link; the transaction happens in the payer's UPI app with your bank." },
			{ question: "Can I fix the amount?", answer: "Yes. Append &am=<amount> to the link before generating. Leave it out for an open amount." },
			{ question: "How is this different from the regular QR generator?", answer: "Only the pre-filled upi://pay payload. The regular generator starts from a web URL." },
		],
		relatedSlugs: ["qr-code-for-wifi", "qr-code-generator", "qr-code-generator-business", "qr-code-reader"],
		recommendedCTA: "Need a payment-ready landing page? Hire us.",
		canonicalStrategy: "Standalone UPI payload page canonicalized to itself.",
		toolPreset: { type: "qr", sample: "upi://pay?pa=name@upi&pn=Business" },
		monetization: { adsAllowed: true, affiliateAllowed: true, serviceCTA: true, proUpsell: "Create branded payment QR packs with Pro.", affiliateSlot: "design" },
	},
];

export const seoOpportunityMap = new Map(
	seoOpportunities.filter((item): item is SeoOpportunity => item != null).map((item) => [item.slug, item]),
);
export const seoOpportunityRouteMap = new Map(
	seoOpportunities.filter((item): item is SeoOpportunity => item != null).map((item) => [item.route, item]),
);

export function getSeoOpportunityBySlug(slug: string) {
	return seoOpportunityMap.get(slug);
}

export function getSeoOpportunityByRoute(route: string) {
	return seoOpportunityRouteMap.get(route);
}

export function getStandaloneSeoOpportunities() {
	return seoOpportunities.filter((item) => item.standalone);
}

export function getSeoOpportunitiesByCategory(category: string) {
	return seoOpportunities.filter((item) => item.category === category);
}

export function getRelatedSeoOpportunities(item: SeoOpportunity, limit = 8) {
	const related = item.relatedSlugs
		.map((slug) => seoOpportunityMap.get(slug))
		.filter((relatedItem): relatedItem is SeoOpportunity => Boolean(relatedItem));

	const sameCategory = seoOpportunities.filter(
		(candidate) =>
			candidate.category === item.category &&
			candidate.slug !== item.slug &&
			!related.some((existing) => existing.slug === candidate.slug),
	);

	return [...related, ...sameCategory].slice(0, limit);
}
