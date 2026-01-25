import Downloader from '@/components/tools/Downloader';
import { UserCircle } from 'lucide-react';

export const metadata = {
  title: 'Instagram DP Viewer | Full Size Profile Picture',
  description: 'View and download Instagram profile pictures in full size (1080p). Zoom in on any Insta DP for free. No login needed.',
  keywords: 'insta dp viewer, instagram profile picture viewer, ig dp full size, zoom instagram profile picture, instagram avatar downloader',
  openGraph: {
    title: 'Instagram DP Viewer | Full Size Zoom',
    description: 'View anyone\'s Instagram profile picture in full HD resolution.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/instagram-dp-viewer',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Instagram DP Viewer",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to view and download Instagram profile pictures in full resolution.",
  "featureList": ["Full Size View", "No Login Required", "HD Quality"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-400 animate-gradient-text tracking-tight">
          Instagram DP Viewer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See any Instagram profile picture in full size. 
          Just enter the username or profile URL.
        </p>
      </div>

      <Downloader 
        platformName="Instagram Profile"
        icon={<UserCircle className="w-5 h-5" />}
        placeholder="Enter Username or Profile Link..."
        colorClasses="from-pink-500 to-rose-400"
        buttonColor="bg-pink-600 hover:bg-pink-700"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>Why use a DP Viewer?</h2>
        <p>
          Instagram prevents users from zooming in or saving profile pictures directly within the app. 
          Our tool bypasses this limitation, allowing you to see the full-resolution image that was originally uploaded.
        </p>
      </div>
    </div>
  );
}
