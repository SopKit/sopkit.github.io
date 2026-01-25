import ImageToBase64 from '@/components/tools/ImageToBase64';

export const metadata = {
  title: 'Image to Base64 Converter | Encode Images Online',
  description: 'Convert images to Base64 strings instantly. Support for PNG, JPG, GIF, and SVG. Free online image encoder for developers.',
  keywords: 'image to base64, base64 converter, image encoder, base64 image, data uri generator, online image tool',
  openGraph: {
    title: 'Image to Base64 Converter | Online Encoder',
    description: 'Convert images (PNG, JPG, SVG) to Base64 Data URI strings instantly.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/image-to-base64',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Image to Base64",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to convert image files into Base64 encoded strings for embedding in HTML or CSS.",
  "featureList": ["Image Upload", "Instant Conversion", "Clipboard Copy"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 animate-gradient-text tracking-tight">
          Image to Base64
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert your images into Base64 Data URIs. 
          Useful for embedding small images directly into HTML or CSS.
        </p>
      </div>

      <ImageToBase64 />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About Base64 Image Encoding</h2>
        <p>
          Base64 encoding represents binary data in an ASCII string format by translating it into a radix-64 representation. 
          Embedding images as Base64 strings can reduce the number of HTTP requests, but it increases the file size by roughly 33%. 
          It is best used for small icons or logos.
        </p>
      </div>
    </div>
  );
}
