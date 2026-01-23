import Downloader from '@/components/tools/Downloader';
import { Linkedin } from 'lucide-react';

export const metadata = {
  title: 'LinkedIn Video Downloader | Save LinkedIn Posts',
  description: 'Download LinkedIn videos in MP4 format. Free online LinkedIn Video Saver. Save professional content for offline viewing.',
  keywords: 'linkedin video downloader, linkedin video saver, save linkedin post, linkedin learning downloader',
  openGraph: {
    title: 'LinkedIn Downloader | Save Professional Videos',
    description: 'Download videos from LinkedIn posts and articles.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/linkedin-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit LinkedIn Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download videos from LinkedIn.",
  "featureList": ["MP4 Support", "HD Quality", "Professional Content"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900 animate-gradient-text tracking-tight">
          LinkedIn Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Save professional videos and training clips from LinkedIn. 
          Keep your learning resources offline.
        </p>
      </div>

      <Downloader 
        platformName="LinkedIn"
        icon={<Linkedin className="w-5 h-5" />}
        placeholder="Paste LinkedIn Post Link..."
        colorClasses="from-blue-700 to-blue-900"
        buttonColor="bg-blue-700 hover:bg-blue-800"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>About LinkedIn Downloader</h2>
        <p>
          LinkedIn hosts valuable educational and professional video content. 
          Our tool helps you archive these videos for personal reference or offline viewing.
        </p>
      </div>
    </div>
  );
}
