"use client";

import * as React from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, Zap, Code2, CheckCircle2, AlertCircle } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

interface Snippet {
  lang: string;
  name: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    lang: "typescript",
    name: "TypeScript Generics & Guard",
    code: `export async function fetchRecord<T extends { id: string }>(url: string): Promise<T | null> {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error(\`Failed to fetch: \${res.status}\`);
  const data = (await res.json()) as T;
  return data?.id ? data : null;
}`,
  },
  {
    lang: "javascript",
    name: "Async Retry & Exponential Backoff",
    code: `async function retryOperation(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return retryOperation(fn, retries - 1, delay * 2);
  }
}`,
  },
  {
    lang: "python",
    name: "Python Decorator & Cache",
    code: `def memoize(func):
    cache = {}
    def wrapper(*args, **kwargs):
        key = (args, tuple(sorted(kwargs.items())))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper`,
  },
  {
    lang: "rust",
    name: "Rust Result & Pattern Match",
    code: `fn process_token(token: &str) -> Result<ParsedClaims, AuthError> {
    if token.is_empty() {
        return Err(AuthError::EmptyToken);
    }
    let parts: Vec<&str> = token.split('.').collect();
    match parts.as_slice() {
        [header, payload, sig] => Ok(ParsedClaims::from_parts(header, payload, sig)?),
        _ => Err(AuthError::InvalidSegments),
    }
}`,
  },
  {
    lang: "sql",
    name: "SQL Window Functions & Aggregation",
    code: `SELECT user_id, org_id, amount,
       ROW_NUMBER() OVER (PARTITION BY org_id ORDER BY amount DESC) as rank,
       SUM(amount) OVER (PARTITION BY org_id) as total_org_spend
FROM billing_transactions
WHERE status = 'succeeded' AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY org_id, rank;`,
  },
];

export default function DevSpeedChallenge() {
  const [selectedSnippetIdx, setSelectedSnippetIdx] = React.useState(0);
  const [timeLimit, setTimeLimit] = React.useState<30 | 60 | 120>(60);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const [inputVal, setInputVal] = React.useState("");
  const [gameState, setGameState] = React.useState<"idle" | "running" | "finished">("idle");
  const [timeLeft, setTimeLeft] = React.useState<number>(timeLimit);
  const [mistakes, setMistakes] = React.useState(0);
  const [wpmHistory, setWpmHistory] = React.useState<number[]>([]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const targetCode = SNIPPETS[selectedSnippetIdx].code;

  // Sound feedback
  const playKeySound = React.useCallback(
    (isError: boolean) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = isError ? "square" : "sine";
        osc.frequency.setValueAtTime(isError ? 140 : 480, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch {
        // AudioContext not allowed before user interaction
      }
    },
    [soundEnabled]
  );

  // Timer tick
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "running" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Restart function
  const restart = (snippetIdx = selectedSnippetIdx, limit = timeLimit) => {
    setSelectedSnippetIdx(snippetIdx);
    setTimeLimit(limit);
    setTimeLeft(limit);
    setInputVal("");
    setMistakes(0);
    setGameState("idle");
    setWpmHistory([]);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (gameState === "idle" && val.length > 0) {
      setGameState("running");
    }

    if (gameState === "finished") return;

    // Check if current typed char is mistake
    const lastCharIdx = val.length - 1;
    if (lastCharIdx >= 0) {
      const isMismatch = val[lastCharIdx] !== targetCode[lastCharIdx];
      if (isMismatch) {
        setMistakes((m) => m + 1);
        playKeySound(true);
      } else {
        playKeySound(false);
      }
    }

    setInputVal(val);

    // If completed snippet
    if (val.length >= targetCode.length) {
      setGameState("finished");
    }
  };

  // Metrics
  const elapsedSec = Math.max(1, timeLimit - timeLeft);
  const correctChars = inputVal.split("").filter((c, i) => c === targetCode[i]).length;
  const grossWPM = Math.round((inputVal.length / 5) / (elapsedSec / 60));
  const netWPM = Math.max(0, Math.round((correctChars / 5) / (elapsedSec / 60)));
  const accuracy = inputVal.length > 0 ? Math.round((correctChars / inputVal.length) * 100) : 100;
  const cpm = Math.round(correctChars / (elapsedSec / 60));

  // Determine Developer Title
  const getDevTier = (wpm: number) => {
    if (wpm >= 90) return { title: "10x Principal Architect", color: "text-amber-400", badge: "Legendary" };
    if (wpm >= 70) return { title: "Staff Systems Engineer", color: "text-emerald-400", badge: "Master" };
    if (wpm >= 50) return { title: "Senior Software Engineer", color: "text-blue-400", badge: "Pro" };
    if (wpm >= 35) return { title: "Full Stack Engineer", color: "text-indigo-400", badge: "Proficient" };
    return { title: "Junior Dev in Training", color: "text-zinc-400", badge: "Apprentice" };
  };

  const devTier = getDevTier(netWPM);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-xl mb-6 shadow-sm">
        {/* Language selector */}
        <div className="flex flex-wrap items-center gap-2">
          {SNIPPETS.map((snip, idx) => (
            <button
              key={snip.lang}
              onClick={() => restart(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSnippetIdx === idx
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {snip.lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Time and sound controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/50 text-xs">
            {([30, 60, 120] as const).map((secs) => (
              <button
                key={secs}
                onClick={() => restart(selectedSnippetIdx, secs)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  timeLimit === secs ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {secs}s
              </button>
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </button>

          <button
            onClick={() => restart()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Net Speed
          </div>
          <div className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            {gameState === "idle" ? 0 : netWPM} <span className="text-xs font-normal text-muted-foreground">WPM</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{cpm} CPM</div>
        </div>

        <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Accuracy
          </div>
          <div className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            {accuracy}%
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{mistakes} mistakes</div>
        </div>

        <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Time Left
          </div>
          <div className={`text-3xl font-extrabold tracking-tight mt-1 ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
            {timeLeft}s
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Limit: {timeLimit}s</div>
        </div>

        <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-purple-500" />
            Developer Rank
          </div>
          <div className={`text-sm font-bold mt-2 truncate ${devTier.color}`}>
            {devTier.title}
          </div>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {devTier.badge}
          </span>
        </div>
      </div>

      {/* Code Display & Typing Area */}
      <div
        className="relative rounded-2xl border border-border/80 bg-zinc-950 p-6 font-mono text-sm leading-relaxed overflow-hidden shadow-2xl transition-all min-h-[300px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Hidden active input */}
        <textarea
          ref={inputRef}
          value={inputVal}
          onChange={handleInput}
          disabled={gameState === "finished"}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />

        {/* Code snippet display */}
        <div className="select-none tracking-wide text-[15px] leading-7">
          {targetCode.split("").map((char, index) => {
            const isTyped = index < inputVal.length;
            const isCurrent = index === inputVal.length;
            const isCorrect = isTyped && inputVal[index] === char;
            const isMismatch = isTyped && inputVal[index] !== char;

            let charClass = "text-zinc-500";
            if (isCorrect) charClass = "text-emerald-400 font-medium";
            if (isMismatch) charClass = "text-red-400 bg-red-950/80 rounded underline decoration-red-500";

            return (
              <span key={index} className="relative inline">
                {isCurrent && gameState !== "finished" && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-primary animate-pulse z-10" />
                )}
                <span className={charClass}>{char}</span>
              </span>
            );
          })}
        </div>

        {/* Idle Overlay Prompt */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary-foreground font-sans text-xs font-semibold tracking-wider uppercase animate-bounce">
              <Code2 className="w-4 h-4" /> Start Typing to Begin Benchmark
            </div>
            <p className="text-zinc-400 font-sans text-xs">Tab indentation, symbols, and brackets are all scored.</p>
          </div>
        )}
      </div>

      {/* Finished Result Modal */}
      {gameState === "finished" && (
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-card/90 to-card/50 border border-border shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h3 className="text-2xl font-black text-foreground">Challenge Complete!</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You achieved <strong className="text-foreground">{netWPM} WPM</strong> with <strong className="text-emerald-500">{accuracy}% accuracy</strong> in {SNIPPETS[selectedSnippetIdx].name}.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Certified Rank:</span>
                <span className={`text-sm font-bold ${devTier.color}`}>{devTier.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PillButton
                onClick={() => {
                  const shareText = `🚀 I clocked ${netWPM} WPM with ${accuracy}% accuracy on SopKit DevSpeed typing benchmark! Can you beat my score? https://sopkit.space/dev-speed/`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText);
                    alert("Score summary copied to clipboard! Share it with your developer friends.");
                  }
                }}
                variant="outline"
                className="gap-2"
              >
                Share Result
              </PillButton>
              <PillButton onClick={() => restart()} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Try Another Snippet
              </PillButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
