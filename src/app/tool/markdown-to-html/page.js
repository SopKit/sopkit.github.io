import MarkdownEditor from '@/components/tools/MarkdownEditor';

export const metadata = {
  title: 'Markdown to HTML Converter | Live Preview',
  description: 'Convert Markdown to HMTL instantly with live preview. Copy clean HTML code for your projects. Free markdown editor online.',
  keywords: 'markdown to html, markdown converter, markdown editor, online markdown tool, html generator',
  openGraph: {
    title: 'Markdown to HTML Converter | Live Preview',
    description: 'Transform Markdown into clean HTML instantly.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/markdown-to-html',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Markdown Converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to convert Markdown text to HTML with real-time preview.",
  "featureList": ["Live Preview", "Instant Conversion", "Clean HTML Output"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 animate-gradient-text tracking-tight">
          Markdown to HTML
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Write in Markdown and get clean, semantic HTML instantly.
        </p>
      </div>

      <MarkdownEditor />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About Markdown</h2>
        <p>
          Markdown is a lightweight markup language for creating formatted text using a plain-text editor. 
          It is widely used for blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files.
        </p>
      </div>
    </div>
  );
}
