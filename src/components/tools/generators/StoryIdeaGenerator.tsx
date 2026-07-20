"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CHARACTERS = [
  "a detective", "a baker", "an astronaut", "a librarian", "a pirate",
  "a scientist", "a knight", "a wizard", "a journalist", "a chef",
  "a musician", "a gardener", "a time traveler", "a robot", "a ghost",
];

const SETTINGS = [
  "an abandoned mansion", "a space station", "a small coastal town", "a medieval castle",
  "a futuristic city", "a dense forest", "an underground bunker", "a floating island",
  "a haunted library", "a desert oasis", "an underwater kingdom", "a traveling circus",
];

const CONFLICTS = [
  "must solve a mysterious disappearance", "discovers a hidden conspiracy",
  "has to escape before time runs out", "finds a dangerous artifact",
  "must protect a secret", "is being hunted", "uncovers a betrayal",
  "must win a high-stakes competition", "has to make an impossible choice",
  "is trapped with an unknown enemy",
];

const THEMES = [
  "redemption", "identity", "sacrifice", "discovery", "justice",
  "transformation", "survival", "love", "ambition", "freedom",
];

const GENRES = ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller", "Adventure", "Horror", "Comedy"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function StoryIdeaGenerator() {
  const [genre, setGenre] = useState("Fantasy");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const character = pick(CHARACTERS);
    const setting = pick(SETTINGS);
    const conflict = pick(CONFLICTS);
    const theme = pick(THEMES);
    const story = `[${genre}] ${character} in ${setting} ${conflict}. Theme: ${theme}.`;
    setPrompt(story);
    setHistory(prev => [story, ...prev].slice(0, 10));
  }, [genre]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Story Idea Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)} className={`px-3 py-1 text-xs rounded-full border ${genre === g ? "bg-primary text-primary-foreground" : ""}`}>{g}</button>
          ))}
        </div>
        <Button onClick={generate}>Generate Story Idea</Button>
        {prompt && (
          <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
            <p className="text-sm leading-relaxed">{prompt}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(prompt); toast.success("Copied!"); }}>Copy</Button>
              <Button variant="outline" size="sm" onClick={generate}>Regenerate</Button>
            </div>
          </div>
        )}
        {history.length > 1 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Generated Ideas ({history.length})</p>
            {history.slice(1).map((h, i) => (
              <div key={i} className="text-xs text-muted-foreground p-2 border-b border-border/30">{h}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
