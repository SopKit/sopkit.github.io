"use client";

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([uuidv4()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: Math.min(count, 50) }, () => uuidv4());
    setUuids(newUuids);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Count (Max 50):
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-20 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-center"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={generate}
              className="flex-1 md:flex-none gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="w-4 h-4" /> Generate
            </Button>
            <Button 
              onClick={copyToClipboard}
              variant="secondary"
              className="flex-1 md:flex-none gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <motion.div 
          layout
          className="bg-muted/50 rounded-xl p-4 md:p-6 font-mono text-sm md:text-base break-all border border-border/50 max-h-[500px] overflow-y-auto"
        >
          {uuids.map((id, index) => (
            <motion.div 
              key={`${id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="py-1 border-b border-border/10 last:border-0"
            >
              {id}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">What is a UUID?</h3>
          <p className="text-muted-foreground text-sm">
            A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. 
            The term Globally Unique Identifier (GUID) is also used, typically in Microsoft software.
          </p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Version 4 (Random)</h3>
          <p className="text-muted-foreground text-sm">
             This generator creates Version 4 UUIDs, which are generated using random numbers. 
             The probability of a collision (generating the same UUID twice) is vanishingly small.
          </p>
        </div>
      </div>
    </div>
  );
}
