import CssMinifier from '@/components/tools/CssMinifier';

export const metadata = {
  title: 'CSS Minifier & Beautifier | Optimize CSS Online',
  description: 'Free online CSS Minifier and Compressor. Reduce file size for faster loading speeds. Also supports confusing CSS beautification.',
  keywords: 'css minifier, css compressor, optimize css, minify css, css beautifier, css cleaner, web development tools',
  openGraph: {
    title: 'CSS Minifier & Beautifier | Optimize CSS Online',
    description: 'Compress your CSS files instantly to improve website load times. Free, fast, and runs entirely in your browser.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/css-minifier',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit CSS Minifier",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to minify CSS code to reduce file size and improve website performance.",
  "featureList": ["CSS Compression", "Whitespace Removal", "Comment Removal", "Beautification Mode"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 animate-gradient-text tracking-tight">
          CSS Minifier
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compress your CSS code to reduce file size and speed up your website. 
          Alternatively, beautify messy CSS for better readability.
        </p>
      </div>

      <CssMinifier />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>Why Minify CSS?</h2>
        <p>
          Minification represents the practice of removing unnecessary characters from code to reduce its size, 
          which improves load times. This includes removing:
        </p>
        <ul>
            <li>Whitespace (spaces, tabs, newlines)</li>
            <li>Comments</li>
            <li>Block delimiters which are not required</li>
        </ul>
        <p>
          Minified CSS is valid code that can be parsed by browsers without any issues, but it is very difficult 
          for humans to read. That&apos;s why we also provide a &quot;Beautify&quot; option!
        </p>
      </div>
    </div>
  );
}
