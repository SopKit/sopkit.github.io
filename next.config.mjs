/** @type {import('next').NextConfig} */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsPath = path.join(__dirname, "src", "constants", "tools.json");
const toolsData = JSON.parse(fs.readFileSync(toolsPath, "utf8"));

const nextConfig = {
	// TypeScript configuration
	typescript: {
		ignoreBuildErrors: true,
	},

	// Advanced image optimization
	images: {
		unoptimized: true,
	},

	// Performance optimizations
	experimental: {
		optimizeCss: false,
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-avatar",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-label",
			"@radix-ui/react-progress",
			"@radix-ui/react-radio-group",
			"@radix-ui/react-select",
			"@radix-ui/react-separator",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-switch",
			"@radix-ui/react-tabs",
			"@radix-ui/react-tooltip",
			"@stackframe/stack",
			"sonner",
			"next-themes",
		],
		webVitalsAttribution: ["CLS", "LCP", "INP", "FCP", "TTFB"],
	},

	// Bundle dependencies for pages router
	bundlePagesRouterDependencies: true,

	// Output configuration for static export (GitHub Pages)
	output: "export",

	// Compression and security
	compress: true,
	poweredByHeader: false,
	generateEtags: false,

	// SEO and crawling optimizations
	trailingSlash: true,

	// Turbopack configuration (empty to silence Next.js 16 warning)
	turbopack: {},

	// Webpack optimizations
	webpack: (config, { dev, isServer }) => {
		// Production optimizations
		if (!dev) {
			config.optimization.sideEffects = true;
			config.optimization.usedExports = true;
		}

		// Bundle analysis in development
		if (dev) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
			};
		}

		// Fix for Stack framework cookie dependency issue
		config.externals = config.externals || [];
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				cookie: false,
				crypto: false,
				stream: false,
				util: false,
			};
		}

		return config;
	},
};

export default nextConfig;
