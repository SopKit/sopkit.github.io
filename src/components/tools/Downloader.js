"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Video, CheckCircle, AlertCircle, PlayCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COBALT_INSTANCES } from '@/utils/cobalt-instances';

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
  const [customInstance, setCustomInstance] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const fetchFromInstance = async (instanceUrl, videoUrl) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${instanceUrl}/api/json`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoUrl }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.text || 'Unknown Error');
      
      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    let successData = null;

    // 1. Try Custom Instance if provided
    if (customInstance) {
      try {
        successData = await fetchFromInstance(customInstance, url);
      } catch (e) {
        console.warn(`Custom instance failed:`, e);
      }
    }

    // 2. Try Public Instances (if custom failed or not provided)
    if (!successData) {
      for (const instance of COBALT_INSTANCES) {
        try {
          successData = await fetchFromInstance(instance, url);
          if (successData) break; // Stop if success
        } catch (e) {
          console.warn(`Instance ${instance} failed:`, e);
        }
      }
    }

    setLoading(false);

    if (successData) {
      setResult({
        title: successData.filename || `${platformName} Download`,
        thumbnail: successData.picker?.[0]?.thumb || "https://placehold.co/600x400/png?text=Preview",
        url: successData.url || successData.picker?.[0]?.url,
        type: successData.status
      });
    } else {
      setError("Unable to download. All public servers might be busy. Please try again or provide a custom Cobalt server URL.");
      setShowSettings(true);
    }
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

         {/* Settings Toggle */}
         <div className="absolute top-2 right-2 z-20">
            <Button 
               variant="ghost" 
               size="icon" 
               className="h-6 w-6 opacity-50 hover:opacity-100"
               onClick={() => setShowSettings(!showSettings)}
            >
               <Settings className="w-4 h-4" />
            </Button>
         </div>
      </div>

      {/* Settings Panel (Custom Instance) */}
      <AnimatePresence>
         {showSettings && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
            >
               <div className="glass-card p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-6">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                     <div className="flex-1 space-y-2">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                           Custom Server Configuration
                        </p>
                        <p className="text-xs text-muted-foreground">
                           If public servers are busy, you can use your own Cobalt instance URL.
                        </p>
                        <Input 
                           value={customInstance}
                           onChange={(e) => setCustomInstance(e.target.value)}
                           placeholder="https://my-cobalt-instance.com"
                           className="h-9 text-sm bg-background/50"
                        />
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
         <div className="p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-center text-sm">
            {error}
         </div>
      )}

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
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white/90" />
                   </div>
                </div>

                {/* Details & Links */}
                <div className="flex-1 space-y-4">
                   <h3 className="font-semibold text-lg line-clamp-2">{result.title}</h3>
                   
                   <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-green-700 dark:text-green-400">Ready to Download</span>
                         <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <Button 
                         asChild 
                         className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                         <a href={result.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-4 h-4" /> Download Now
                         </a>
                      </Button>
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                         If download doesn&apos;t start, right click and &quot;Save Link As&quot;
                      </p>
                   </div>
                </div>
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
