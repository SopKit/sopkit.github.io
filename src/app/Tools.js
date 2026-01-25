import Link from "next/link";
import { 
  ArrowRight, FileText, Code2, Hash, Piano, ListTodo, 
  Mic2, FileCode2, ArrowRightLeft, Box, Upload, 
  Clock, Calendar, Image as LucideImage, Scissors, 
  Database, FileJson, Lock, Type, Youtube, Share2, 
  Facebook, Camera, Twitter, UserCircle, Pin, Linkedin, CloudRain, Music2
} from "lucide-react";
import toolsData from '@/data/tools.json';

const iconMap = {
  "FileText": FileText,
  "Code2": Code2,
  "Hash": Hash,
  "Piano": Piano,
  "ListTodo": ListTodo,
  "Mic2": Mic2,
  "FileCode2": FileCode2,
  "ArrowRightLeft": ArrowRightLeft,
  "Box": Box,
  "Upload": Upload,
  "Clock": Clock,
  "Calendar": Calendar,
  "Image": LucideImage,
  "Scissors": Scissors,
  "Database": Database,
  "FileJson": FileJson,
  "Lock": Lock,
  "Type": Type,
  "Youtube": Youtube,
  "Share2": Share2,
  "Facebook": Facebook,
  "Camera": Camera,
  "Twitter": Twitter,
  "UserCircle": UserCircle,
  "Pin": Pin,
  "Linkedin": Linkedin,
  "CloudRain": CloudRain,
  "Music2": Music2
};

export default function Tools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {toolsData.map((tool) => {
        // Fallback icon if not found in map
        const Icon = iconMap[tool.icon] || Box;
        
        return (
          <Link
            href={tool.link}
            key={tool.name}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                   <Icon className="w-6 h-6 text-primary" />
                </div>
                {tool.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                {tool.name}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{tool.description}</p>
              <div className="flex items-center text-primary font-medium text-sm mt-auto">
                Try Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}
