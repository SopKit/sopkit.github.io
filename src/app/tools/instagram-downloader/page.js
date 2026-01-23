import Downloader from '@/components/tools/Downloader';
import { Camera } from 'lucide-react'; // Placeholder for Instagram

export const metadata = {
  title: 'Instagram Downloader | Save Reels, Stories, Photos',
  description: 'Download Instagram Reels, Videos, Photos, and Stories. Free online Insta Saver in high quality (1080p).',
  keywords: 'instagram downloader, insta reel saver, instagram story downloader, save instagram photo, igram alternative',
  openGraph: {
    title: 'Instagram Downloader | Reels & Stories',
    description: 'Save content from Instagram: Reels, Stories, and Photos.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/instagram-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Instagram Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A comprehensive tool to download content from Instagram.",
  "featureList": ["Reels Support", "Story Saver", "Photo Downloader"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-500 animate-gradient-text tracking-tight">
          Instagram Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Save Instagram Reels, Videos, Stories, and Photos in full quality. 
          Your all-in-one Insta saver.
        </p>
      </div>

      <Downloader 
        platformName="Instagram"
        icon={<Camera className="w-5 h-5" />}
        placeholder="Paste Instagram Reel or Post Link..."
        colorClasses="from-purple-500 to-orange-500"
        buttonColor="bg-gradient-to-r from-purple-600 to-orange-600 hover:opacity-90"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>Supported Formats</h2>
        <ul>
            <li><strong>Reels:</strong> Download short videos with audio.</li>
            <li><strong>Photos:</strong> Save individual posts or carousels.</li>
            <li><strong>Stories:</strong> Save stories before they disappear (24h).</li>
        </ul>
      </div>
    </div>
  );
}
