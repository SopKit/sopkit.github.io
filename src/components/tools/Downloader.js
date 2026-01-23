"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Video, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Downloader({ 
  platformName, 
  icon, 
  placeholder, 
  colorClasses = "from-blue-500 to-cyan-500", 
  buttonColor = "bg-primary" 
}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // For now, we simulate a successful "API" response for demonstration
      // In a real app, this would be the result from a backend
      setResult({
        title: `${platformName} Video Result`,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60", // Generic Placeholder
        duration: "0:45",
        formats: [
          { type: 'MP4', quality: '1080p', size: '12.5 MB' },
          { type: 'MP4', quality: '720p', size: '8.2 MB' },
          { type: 'MP3', quality: '320kbps', size: '2.1 MB' },
        ]
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Input Section */}
      <div className={`glass-card p-2 md:p-4 rounded-2xl border-2 border-primary/10 relative overflow-hidden`}>
         <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses} opacity-5`}></div>
         
         <form onSubmit={handleDownload} className="relative z-10 flex flex-col md:flex-row gap-3 p-2">
            <div className="flex-1 relative">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {icon}
               </div>
               <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={placeholder}
                  className="pl-10 h-12 text-base rounded-xl bg-background border-transparent focus:border-primary/50"
               />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !url}
              className={`h-12 px-8 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 ${buttonColor}`}
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Download'}
            </Button>
         </form>
      </div>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl overflow-hidden"
          >
             <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full md:w-1/3 aspect-video bg-black/10 rounded-xl relative overflow-hidden group">
                   <img src={result.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white/90" />
                   </div>
                   <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {result.duration}
                   </span>
                </div>

                {/* Details & Links */}
                <div className="flex-1 space-y-4">
                   <h3 className="font-semibold text-lg line-clamp-2">{result.title}</h3>
                   <div className="space-y-2">
                      {result.formats.map((fmt, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
                           <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${fmt.type === 'MP3' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {fmt.type}
                              </span>
                              <span className="font-medium text-sm">{fmt.quality}</span>
                              <span className="text-xs text-muted-foreground">({fmt.size})</span>
                           </div>
                           <Button size="sm" variant="ghost" className="gap-2 text-primary hover:text-primary">
                              <Download className="w-4 h-4" /> Download
                           </Button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             
             {/* Disclaimer for static demo */}
             <div className="mt-6 p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                   <strong>Note:</strong> Is the requested content private? If so, we cannot download it. 
                   Ensure the video URL is public.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-6 text-center text-muted-foreground">
         <div className="p-4 rounded-xl bg-secondary/5">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <h4 className="font-medium text-foreground mb-1">Free & Fast</h4>
            <p className="text-sm">Unlimited downloads without any fees.</p>
         </div>
         <div className="p-4 rounded-xl bg-secondary/5">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <h4 className="font-medium text-foreground mb-1">Secure</h4>
            <p className="text-sm">No software installation required.</p>
         </div>
         <div className="p-4 rounded-xl bg-secondary/5">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <h4 className="font-medium text-foreground mb-1">High Quality</h4>
            <p className="text-sm">Get the best available resolution.</p>
         </div>
      </div>
    </div>
  );
}
