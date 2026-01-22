"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Download, Play, Pause } from "lucide-react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="glass-card p-12 rounded-full aspect-square flex flex-col items-center justify-center gap-8 border-4 border-primary/10 relative overflow-hidden">
        {/* Animated Rings when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping pointer-events-none"></div>
            <div className="absolute inset-4 border-4 border-primary/10 rounded-full animate-ping delay-75 pointer-events-none"></div>
          </>
        )}

        <div className="text-6xl font-mono font-bold font-variant-numeric tabular-nums tracking-wider text-primary">
          {formatTime(recordingTime)}
        </div>

        <div className="flex gap-4 z-10">
          {!isRecording ? (
            <Button 
               size="lg" 
               className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-transform hover:scale-105"
               onClick={startRecording}
            >
              <Mic className="w-8 h-8 text-white" />
            </Button>
          ) : (
            <Button 
               size="lg" 
               className="rounded-full w-20 h-20 bg-slate-800 hover:bg-slate-900 shadow-lg transition-transform hover:scale-105"
               onClick={stopRecording}
            >
              <Square className="w-8 h-8 fill-current text-white" />
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground font-medium animate-pulse">
          {isRecording ? 'Recording...' : 'Tap to Record'}
        </p>
      </div>

      {audioURL && (
        <div className="glass-card p-6 rounded-xl space-y-4 animate-fade-in-up">
          <audio controls src={audioURL} className="w-full" />
          <div className="flex justify-center">
             <a href={audioURL} download={`recording-${new Date().toISOString()}.webm`}>
                <Button variant="outline" className="gap-2">
                   <Download className="w-4 h-4" /> Download WebM
                </Button>
             </a>
          </div>
        </div>
      )}
    </div>
  );
}
