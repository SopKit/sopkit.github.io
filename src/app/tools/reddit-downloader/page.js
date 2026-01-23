import Downloader from '@/components/tools/Downloader';
import { Share2 } from 'lucide-react'; // Using Share2 as generic placeholder for Reddit-like structure

export const metadata = {
  title: 'Reddit Video Downloader | Save Reddit Videos & GIFs',
  description: 'Download Reddit videos with sound and GIFs instantly. Free online Reddit Saver. Works for all subreddits.',
  keywords: 'reddit downloader, reddit video saver, save reddit video, reddit to mp4, reddit gif downloader, redditsave alternative',
  openGraph: {
    title: 'Reddit Video Downloader | Save Reddit Content',
    description: 'Download videos and GIFs from Reddit with audio support.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/reddit-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Reddit Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download videos and GIFs from Reddit.",
  "featureList": ["Audio Support", "GIF Support", "HD Quality"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 animate-gradient-text tracking-tight">
          Reddit Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Save Reddit videos with audio and GIFs directly to your device. 
          Supports all subreddits.
        </p>
      </div>

      <Downloader 
        platformName="Reddit"
        icon={<Share2 className="w-5 h-5" />}
        placeholder="Paste Reddit Post Link..."
        colorClasses="from-orange-500 to-red-500"
        buttonColor="bg-orange-600 hover:bg-orange-700"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>Features</h2>
        <ul>
          <li><strong>Videos with Audio:</strong> Unlike other tools, we merge audio and video tracks.</li>
          <li><strong>GIFs:</strong> Download Reddit GIFs in their original quality.</li>
          <li><strong>Fast & Free:</strong> No limits on the number of downloads.</li>
        </ul>
      </div>
    </div>
  );
}
