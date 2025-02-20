import { Search } from "./SearchBox";
import Link from "next/link";
import Tools from "./Tools";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img
              src="https://github.com/sopkit.png"
              alt="SopKit - Your Web Development Toolkit"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Developer Tools,
            <br />
            Reimagined
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto mb-8">
            Powerful, free, and open-source development tools to streamline your workflow and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#searchfield">
              <Button size="lg" className="gap-2">
                Explore Tools <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com/SopKit/suggest/issues/new">
              <Button variant="outline" size="lg" className="gap-2">
                Suggest a Tool <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Code2 className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">100% free and open source. Contribute, customize, and make it your own.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Zap className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Built with performance in mind. Get instant results with no delays.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Sparkles className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Modern Tools</h3>
              <p className="text-muted-foreground">Cutting-edge tools designed for modern web development workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Find the Perfect Tool</h2>
          <div id="searchfield" className="w-full">
            <Search />
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Popular Tools</h2>
          <Tools />
        </div>
      </section>
    </div>
  );
}
