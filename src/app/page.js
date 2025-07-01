import { Search } from "@/components/search/SearchBox";
import Link from "next/link";
import Tools from "./Tools";
import { ArrowRight, Sparkles, Code2, Zap, Shield, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tracker from "@/components/Tracker";

// Enhanced metadata for homepage
export const metadata = {
  title: 'SopKit - Professional Web Development Tools & Utilities',
  description: 'Discover SopKit\'s powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities including JSON formatters, converters, validators, and more.',
  keywords: 'web development tools, developer utilities, JSON formatter, HTML to JSX, markdown converter, encoding tools, free developer tools, online tools, programming utilities',
  openGraph: {
    title: 'SopKit - Professional Web Development Tools & Utilities',
    description: 'Discover SopKit\'s powerful suite of free, open-source web development tools. Boost your productivity with modern development utilities.',
    images: ['/og.png'],
    type: 'website',
    url: 'https://sopkit.github.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SopKit - Professional Web Development Tools & Utilities',
    description: 'Discover SopKit\'s powerful suite of free, open-source web development tools.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: 'https://sopkit.github.io',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Hero Section with better semantic markup */}
      <section className="py-32 px-4 relative overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-gradient"></div>
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="flex justify-center mb-12 transform hover:scale-105 transition-transform duration-300">
            <img
              src="https://github.com/sopkit.png"
              alt="SopKit - Your Web Development Toolkit"
              width={160}
              height={160}
              className="rounded-2xl shadow-2xl ring-4 ring-primary/10"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <header>
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient-text">
              Developer Tools,
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
              Powerful, free, and open-source development tools to streamline your workflow and boost productivity. 
              Used by over 100,000+ developers worldwide.
            </p>
          </header>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="#searchfield" aria-label="Explore our development tools">
              <Button size="lg" className="gap-3 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90">
                Explore Tools <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="https://github.com/SopKit/suggest/issues/new" aria-label="Suggest a new tool">
              <Button variant="outline" size="lg" className="gap-3 text-lg px-8 py-6 hover:bg-secondary/10 transition-all duration-300">
                Suggest a Tool <Sparkles className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with better accessibility */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50" role="region" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-12 sr-only">Why Choose SopKit</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Code2 className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">100% free and open source. Contribute, customize, and make it your own. Join our community of developers.</p>
            </article>
            <article className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Zap className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Built with performance in mind. Get instant results with no delays. Optimized for speed and efficiency.</p>
            </article>
            <article className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Sparkles className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Modern Tools</h3>
              <p className="text-muted-foreground">Cutting-edge tools designed for modern web development workflows. Always up-to-date with the latest standards.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 px-4" role="region" aria-labelledby="trust-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="trust-heading" className="text-3xl font-bold text-center mb-12">Trusted by Developers Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-2">100,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-2">150+</h3>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div>
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-2">99.9%</h3>
              <p className="text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section 
        className="py-24 px-4 bg-gradient-to-t from-secondary/5 to-background" 
        role="search" 
        aria-labelledby="search-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="search-heading" className="text-4xl font-bold text-center mb-6">Find the Perfect Tool</h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Search through our collection of 25+ developer tools and utilities
          </p>
          <div id="searchfield" className="w-full transform hover:scale-[1.01] transition-transform duration-300">
            <Search />
          </div>
        </div>
      </section>

      {/* Enhanced Popular Tools Section */}
      <section 
        className="py-24 px-4 bg-gradient-to-b from-background to-secondary/5" 
        role="region" 
        aria-labelledby="tools-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 id="tools-heading" className="text-4xl font-bold">Popular Tools</h2>
            <Link href="/tools" aria-label="View all tools">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <Tools />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          </div>
        </div>
      </section>
      
      <Tracker/>
    </div>
  );
}
