import Link from "next/link";
import { ArrowRight, FileText, Code2, Hash, Piano, ListTodo, Mic2, FileCode2, FileConvert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconJarLogoIcon } from "@radix-ui/react-icons";

export default function Tools() {
  const tools = [
    {
      name: "Markdown to HTML",
      description: "Transform your markdown into clean, semantic HTML with our powerful converter. Used by 10k+ developers.",
      icon: FileText,
      link: "/markdown-to-html",
      stats: "99.9% accuracy"
    },
    {
      name: "Encoding Tools",
      description: "Comprehensive suite of encoding/decoding tools for developers. Trusted by top tech companies.",
      icon: Hash,
      link: "/encoding",
      stats: "50M+ conversions"
    },
    {
      name: "Web Tools",
      description: "Essential utilities for modern web development. Boost your productivity instantly.",
      icon: Code2,
      link: "/web-tools",
      stats: "Used daily by 25k+"
    },
    {
      name: "HTML to Markdown",
      description: "Convert HTML to clean markdown effortlessly. Perfect for content migration and docs.",
      icon: FileCode2,
      link: "/html-to-markdown",
      stats: "4.9/5 rating"
    },
    {
      name: "HTML to JSX",
      description: "Instantly transform HTML into React-ready JSX components. Save hours of manual conversion.",
      icon: Code2,
      link: "/html-to-jsx",
      stats: "30k+ conversions/day"
    },
    {
      name: "Play Piano",
      description: "Take a creative break with our web-based piano. Perfect for music lovers and developers alike.",
      icon: Piano,
      link: "/play-piano",
      stats: "100k+ melodies played"
    },
    {
      name: "Daily Todo App",
      description: "Stay organized with our minimalist todo app. Boost your productivity with smart task management.",
      icon: ListTodo,
      link: "/daily-todo-app",
      stats: "15k+ active users"
    },
    {
      name: "Audio Recorder",
      description: "Professional-grade audio recording with pause and download functionality. Perfect for podcasters.",
      icon: Mic2,
      link: "/audio-recorder",
      stats: "1M+ recordings"
    },
    {
      name: "File Converter",
      description: "Convert any file format instantly. Support for images, audio, video, and documents.",
      icon: FileConvert,
      link: "/file-converter",
      stats: "5M+ files converted"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link
            href={tool.link}
            key={tool.name}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <IconJarLogoIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded-full">
                  {tool.stats}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                {tool.name}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>
              <div className="flex items-center text-primary font-medium">
                Try Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}
