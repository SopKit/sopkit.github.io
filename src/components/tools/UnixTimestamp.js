"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

export default function UnixTimestamp() {
  const [now, setNow] = useState(Date.now());
  const [inputEpoch, setInputEpoch] = useState('');
  const [outputDate, setOutputDate] = useState('');
  
  const [inputDate, setInputDate] = useState('');
  const [outputEpoch, setOutputEpoch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertEpoch = () => {
    if (!inputEpoch) return;
    try {
      // Auto-detect seconds vs milliseconds
      let ts = parseInt(inputEpoch);
      if (inputEpoch.length <= 10) ts *= 1000; 
      
      const date = new Date(ts);
      setOutputDate(date.toUTCString() + ' | ' + date.toLocaleString());
    } catch (e) {
      setOutputDate('Invalid Timestamp');
    }
  };

  const convertDate = () => {
    if (!inputDate) return;
    try {
      const date = new Date(inputDate);
      setOutputEpoch(Math.floor(date.getTime() / 1000).toString());
    } catch (e) {
      setOutputEpoch('Invalid Date');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 rounded-2xl text-center space-y-2 border-primary/20 bg-primary/5">
         <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Unix Epoch</h2>
         <div className="text-5xl md:text-6xl font-mono font-bold text-primary animate-pulse">
            {Math.floor(now / 1000)}
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Epoch to Date */}
         <div className="glass-card p-6 rounded-xl space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
               <Clock className="w-4 h-4" /> Timestamp to Human Date
            </h3>
            <div className="flex gap-2">
               <input
                 type="number"
                 value={inputEpoch}
                 onChange={(e) => setInputEpoch(e.target.value)}
                 placeholder="1678886400"
                 className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
               />
               <Button onClick={convertEpoch} size="sm">Convert</Button>
            </div>
            {outputDate && (
               <div className="p-3 bg-secondary/30 rounded-lg text-sm font-mono break-all">
                  {outputDate}
               </div>
            )}
         </div>

         {/* Date to Epoch */}
         <div className="glass-card p-6 rounded-xl space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
               <Clock className="w-4 h-4" /> Human Date to Timestamp
            </h3>
            <div className="flex gap-2">
               <input
                 type="datetime-local"
                 value={inputDate}
                 onChange={(e) => setInputDate(e.target.value)}
                 className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
               />
               <Button onClick={convertDate} size="sm">Convert</Button>
            </div>
            {outputEpoch && (
               <div className="p-3 bg-secondary/30 rounded-lg text-sm font-mono flex justify-between items-center">
                  {outputEpoch}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
