import Downloader from '@/components/tools/Downloader';
import { Pin } from 'lucide-react';

export const metadata = {
  title: 'Pinterest Video Downloader | Save Images & GIFs',
  description: 'Download Pinterest videos, images, and GIFs in high quality. Free online Pinterest Saver. Supports story pins.',
  keywords: 'pinterest downloader, pinterest video saver, save pinterest image, pinterest gif downloader, pin saver',
  openGraph: {
    title: 'Pinterest Downloader | Save Videos & Images',
    description: 'Save content from Pinterest boards to your device.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/pinterest-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Pinterest Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download videos and images from Pinterest.",
  "featureList": ["Video Support", "Image Support", "GIF Support"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 animate-gradient-text tracking-tight">
          Pinterest Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download videos, images, and GIFs from Pinterest. 
          Save ideas for later.
        </p>
      </div>

      <Downloader 
        platformName="Pinterest"
        icon={<Pin className="w-5 h-5" />}
        placeholder="Paste Pin Link..."
        colorClasses="from-red-500 to-red-700"
        buttonColor="bg-red-600 hover:bg-red-700"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>Features</h2>
        <p>
          Pinterest is a visual discovery engine. Often you find a video or image you want to keep offline. 
          Use our tool to save it in its original quality.
        </p>
      </div>
    </div>
  );
}
