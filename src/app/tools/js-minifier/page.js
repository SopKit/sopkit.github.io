import JsMinifier from '@/components/tools/JsMinifier';

export const metadata = {
  title: 'JavaScript Minifier | Compress JS Online',
  description: 'Free online JavaScript Minifier. Remove whitespace, comments, and optimize your JS code for faster page loads.',
  keywords: 'javascript minifier, js compressor, uglify js, minify js, online code cleaner, developer tools',
  openGraph: {
    title: 'JavaScript Minifier | Compress JS Online',
    description: 'Compress your JavaScript code instantly. Free, lightweight, and browser-based.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/js-minifier',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit JS Minifier",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to minify JavaScript code by removing unnecessary whitespace and comments.",
  "featureList": ["JS Compression", "Whitespace Removal", "Comment Removal"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 animate-gradient-text tracking-tight">
          JS Minifier
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Lightweight JavaScript compression to reduce file size.
          Paste your code and minify it instantly.
        </p>
      </div>

      <JsMinifier />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About JavaScript Minification</h2>
        <p>
          Minifying JavaScript is the process of removing all unnecessary characters from source code without changing its functionality. 
          This includes the removal of whitespace, comments, and block delimiters, which are useful for readability but not for execution.
        </p>
      </div>
    </div>
  );
}
