"use client";

import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode"; // Requires bun add jwt-decode
import { Button } from "@/components/ui/button";
import { AlertCircle, FileJson, Lock } from "lucide-react";

export default function JwtParser() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  const parseToken = () => {
    setError(null);
    setHeader(null);
    setPayload(null);
    
    if (!token.trim()) return;

    try {
      const decodedPayload = jwtDecode(token);
      const decodedHeader = jwtDecode(token, { header: true });
      
      setPayload(decodedPayload);
      setHeader(decodedHeader);
    } catch (err) {
      setError("Invalid JWT Token format. Please check your token.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
        <label className="block text-sm font-medium text-foreground/80 mb-2">
           Paste JWT Token (Bearer optional)
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full h-32 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
        />
        
        <div className="flex justify-end">
          <Button onClick={parseToken} className="gap-2 bg-primary">
            <Lock className="w-4 h-4" /> Decode Token
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
      </div>

      {(header || payload) && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Header */}
          <div className="glass-card p-6 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
               <FileJson className="w-5 h-5" />
               <h3 className="font-semibold">Header</h3>
            </div>
            <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto text-xs md:text-sm font-mono text-foreground/90">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>
          
          {/* Payload */}
          <div className="glass-card p-6 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4 text-pink-400">
               <FileJson className="w-5 h-5" />
               <h3 className="font-semibold">Payload</h3>
            </div>
            <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto text-xs md:text-sm font-mono text-foreground/90">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
