"use client";

import React, { useState } from 'react';
import cronstrue from 'cronstrue';
import { Button } from "@/components/ui/button";
import { Clock, Info } from "lucide-react";

export default function CronParser() {
  const [cron, setCron] = useState('* * * * *');
  const [description, setDescription] = useState('Every minute');
  const [error, setError] = useState(null);

  const parseCron = (value) => {
    setCron(value);
    try {
      const desc = cronstrue.toString(value);
      setDescription(desc);
      setError(null);
    } catch (err) {
      setDescription(null);
      setError("Invalid cron expression");
    }
  };

  const commonSchedules = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every week', value: '0 0 * * 0' },
    { label: 'Every month', value: '0 0 1 * *' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 rounded-2xl space-y-8">
        <div className="space-y-2">
           <label className="text-sm font-medium">Cron Expression</label>
           <input
             type="text"
             value={cron}
             onChange={(e) => parseCron(e.target.value)}
             className="w-full p-4 text-xl md:text-2xl font-mono text-center bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
             placeholder="* * * * *"
           />
        </div>

        <div className="min-h-[100px] flex items-center justify-center p-6 bg-primary/5 rounded-xl border border-primary/10">
           {error ? (
             <span className="text-destructive font-semibold flex items-center gap-2">
                <Info className="w-5 h-5" /> {error}
             </span>
           ) : (
             <span className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-gradient-text text-center">
                &quot;{description}&quot;
             </span>
           )}
        </div>

        <div className="space-y-3">
           <p className="text-sm font-medium text-muted-foreground">Common Examples:</p>
           <div className="flex flex-wrap gap-2">
             {commonSchedules.map((item) => (
               <Button
                 key={item.label}
                 variant="outline"
                 size="sm"
                 onClick={() => parseCron(item.value)}
                 className="bg-background/50 hover:bg-background"
               >
                 {item.label}
               </Button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
