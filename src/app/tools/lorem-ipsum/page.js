import LoremGenerator from '@/components/tools/LoremGenerator';

export const metadata = {
  title: 'Lorem Ipsum Generator | Dummy Text Generator',
  description: 'Generate standard Lorem Ipsum placeholder text for your designs. Select paragraphs, sentences, or words. Free online dummy text tool.',
  keywords: 'lorem ipsum generator, dummy text, placeholder text, lipsum, text generator, web design tools',
  openGraph: {
    title: 'Lorem Ipsum Generator | Dummy Text Tool',
    description: 'Generate Ipsum text perfectly formatted for your layout needs.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/lorem-ipsum',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Lorem Ipsum Generator",
  "applicationCategory": "DesignTool",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A utility to generate Lorem Ipsum placeholder text for web design and publishing.",
  "featureList": ["Paragraph Generation", "Sentence Generation", "Word Count Control"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-slate-800 dark:from-gray-200 dark:to-slate-400 animate-gradient-text tracking-tight">
          Lorem Ipsum Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create standard placeholder text for your layouts. 
          Essential for designers and developers.
        </p>
      </div>

      <LoremGenerator />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>What is Lorem Ipsum?</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
          when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>
    </div>
  );
}
