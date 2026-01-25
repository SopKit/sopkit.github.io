import UuidGenerator from '@/components/tools/UuidGenerator';

export const metadata = {
  title: 'UUID Generator | Online UUID/GUID v4 Generator',
  description: 'Generate random UUIDs (v4) instantly. Free online bulk UUID generator tool for developers. No ads, secure, and fast.',
  keywords: 'uuid generator, guid generator, free uuid tool, bulk uuid generator, v4 uuid, random guid, developer tools',
  openGraph: {
    title: 'UUID Generator | Online UUID/GUID v4 Generator',
    description: 'Generate random UUIDs (v4) instantly. Free online bulk UUID generator tool for developers.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/uuid-generator',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit UUID Generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "A free utility to generate Version 4 UUIDs (Universally Unique Identifiers) instantly.",
  "featureList": ["Single UUID Generation", "Bulk UUID Generation", "Copy to Clipboard", "v4 Standard"]
};

export default function Page() {
  return (
    <div className="container-safe py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-gradient-text tracking-tight">
          UUID Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Generate secure, random Version 4 UUIDs instantly. 
          Perfect for database keys, unique IDs, and testing data.
        </p>
      </div>

      <UuidGenerator />

      <div className="mt-16 prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl">
        <h2>About UUIDs</h2>
        <p>
          A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify some object or entity on the Internet. 
          Depending on the specific mechanisms used, a UUID is either guaranteed to be different or is, at least, 
          extremely likely to be different from any other UUID generated until 3400 A.D.
        </p>
        
        <h3>Why use Version 4?</h3>
        <p>
          Version 4 UUIDs are generated using random or pseudo-random numbers. 
          Unlike other versions (like v1 which uses MAC address and timestamp), v4 doesn&apos;t reveal any information 
          about the host that generated it and provides a very high degree of uniqueness.
        </p>

        <h3>Format</h3>
        <p>
          A UUID is written as a sequence of 32 hexadecimal digits, broken into groups:
          <code>8-4-4-4-12</code>. 
          Example: <code>123e4567-e89b-12d3-a456-426614174000</code>
        </p>
      </div>
    </div>
  );
}
