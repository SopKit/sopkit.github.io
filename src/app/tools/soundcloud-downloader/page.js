import Downloader from '@/components/tools/Downloader';
import { CloudRain } from 'lucide-react'; // Placeholder for Soundcloud

export const metadata = {
  title: 'SoundCloud Downloader | Convert to MP3',
  description: 'Download SoundCloud tracks and songs as MP3. Free online SoundCloud to MP3 converter. High quality audio (320kbps).',
  keywords: 'soundcloud downloader, soundcloud to mp3, save soundcloud song, soundcloudripper, audio downloader',
  openGraph: {
    title: 'SoundCloud Downloader | Save Music as MP3',
    description: 'Convert and download SoundCloud tracks to MP3 format.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/soundcloud-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit SoundCloud Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download audio tracks from SoundCloud.",
  "featureList": ["MP3 Conversion", "320kbps Quality", "Playlist Support"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400 animate-gradient-text tracking-tight">
          SoundCloud Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert and save SoundCloud music to MP3. 
          Enjoy your favorite indie tracks offline.
        </p>
      </div>

      <Downloader 
        platformName="SoundCloud"
        icon={<CloudRain className="w-5 h-5" />}
        placeholder="Paste SoundCloud Track Link..."
        colorClasses="from-orange-500 to-orange-400"
        buttonColor="bg-orange-500 hover:bg-orange-600"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>About SoundCloud Downloader</h2>
        <p>
          SoundCloud is the world&apos;s largest open audio platform. 
          While some artists enable direct downloads, many do not. 
          Our tool allows you to save any public track as an MP3 file.
        </p>
      </div>
    </div>
  );
}
