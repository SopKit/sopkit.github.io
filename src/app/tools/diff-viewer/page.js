import DiffViewer from '@/components/tools/DiffViewer';

export const metadata = {
  title: 'Text Diff Viewer | Online Text Compare Tool',
  description: 'Compare two text files or snippets and highlight differences line by line. Free online text difference checker for developers.',
  keywords: 'diff viewer, text compare, difference checker, compare text online, diff tool, code compare',
  openGraph: {
    title: 'Text Diff Viewer | Compare Text Differences',
    description: 'Instantly view differences between two text blocks.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/diff-viewer',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Diff Viewer",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to compare two text inputs and highlight additions and deletions.",
  "featureList": ["Line-by-line Comparison", "Visual Highlighting", "Side-by-side Input"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 animate-gradient-text tracking-tight">
          Text Diff Viewer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare two blocks of text or code and spot the differences instantly.
        </p>
      </div>

      <DiffViewer />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About Diff Viewer</h2>
        <p>
          A diff viewer is essential for tracking changes in code or text versions. 
          Green lines indicate additions, while red lines highlight removals.
        </p>
      </div>
    </div>
  );
}
