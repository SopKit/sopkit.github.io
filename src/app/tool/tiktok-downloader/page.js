import Downloader from '@/components/tools/Downloader';
import { Music2 } from 'lucide-react'; // Placeholder for TikTok

export const metadata = {
  title: 'TikTok Downloader | No Watermark Video Saver',
  description: 'Download TikTok videos without watermark in HD. Free online TikTok video saver. Works on Android, iPhone, and PC.',
  keywords: 'tiktok downloader, tiktok logo remover, tiktok no watermark, save tiktok video, musically downloader',
  openGraph: {
    title: 'TikTok Downloader | No Watermark',
    description: 'Save TikTok videos without the annoying watermark.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/tiktok-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit TikTok Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download TikTok videos without watermark.",
  "featureList": ["No Watermark", "HD Quality", "Fast Download"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-gradient-text tracking-tight">
          TikTok Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download TikTok videos without watermark. 
          Save your favorite trend videos in HD.
        </p>
      </div>

      <Downloader 
        platformName="TikTok"
        icon={<Music2 className="w-5 h-5" />}
        placeholder="Paste TikTok Video Link..."
        colorClasses="from-cyan-400 to-pink-500"
        buttonColor="bg-black hover:bg-zinc-800"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>Features</h2>
        <ul>
            <li><strong>No Watermark:</strong> Remove the TikTok logo automatically.</li>
            <li><strong>MP4 Format:</strong> Save in standard video format.</li>
            <li><strong>Unlimited:</strong> Download as many videos as you want.</li>
        </ul>
      </div>
    </div>
  );
}
