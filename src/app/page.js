import { Search } from "@/components/search/SearchBox";
import Tools from "./Tools";
import Tracker from "@/components/Tracker";

// Enhanced metadata for homepage
export const metadata = {
  title: 'SopKit - Free Developer Tools & Social Media Downloaders',
  description: 'A comprehensive suite of free developer utilities and social media downloaders. Format JSON, convert files, download videos from YouTube/Instagram/TikTok, and more.',
  keywords: ['web development tools', 'social media downloader', 'youtube downloader', 'json formatter', 'developer utilities', 'free online tools', 'sopkit'],
  alternates: {
    canonical: 'https://sopkit.github.io',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Header / Search Section */}
        <div className="w-full max-w-3xl text-center space-y-8 mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            SopKit
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Essential developer tools, efficient and free.
          </p>
          
          <div className="w-full transform hover:scale-[1.01] transition-transform duration-200">
            <Search />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="w-full max-w-7xl">
            <Tools />
        </div>
      </main>
      
      <Tracker/>
    </div>
  );
}
