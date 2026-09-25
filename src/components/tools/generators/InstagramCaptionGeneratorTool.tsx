"use client";

import React, { useState, useId } from "react";
import {
  ToolShell,
  ToolGrid,
  ToolGridMain,
  ToolGridSide,
  ToolPanel,
  ToolSectionTitle,
  ToolField,
  ToolModeTabs,
  DS,
} from "@/components/tools/shared/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Hash,
  Smile,
  Instagram,
  Flame,
  Coffee,
  Briefcase,
  Compass,
  Dumbbell,
  Palette,
  Shuffle,
} from "lucide-react";

interface CaptionOption {
  id: string;
  badge: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

const NICHES = [
  { id: "lifestyle", label: "Lifestyle & Daily", icon: Coffee },
  { id: "travel", label: "Travel & Adventure", icon: Compass },
  { id: "fitness", label: "Fitness & Wellness", icon: Dumbbell },
  { id: "business", label: "Business & Career", icon: Briefcase },
  { id: "fashion", label: "Fashion & Aesthetics", icon: Palette },
  { id: "viral", label: "Creator & Viral", icon: Flame },
];

const TONES = [
  { id: "viral", label: "Viral Hook" },
  { id: "relatable", label: "Relatable" },
  { id: "story", label: "Storytelling" },
  { id: "minimal", label: "Minimalist" },
  { id: "promo", label: "Promotional" },
];

const CTAS = [
  "Drop your thoughts below 👇",
  "Save this post so you don't lose it 📌",
  "Tag someone who needs to see this ❤️",
  "Link in bio to learn more 🔗",
  "Share this to your story if you agree ✨",
];

const NICHE_HASHTAGS: Record<string, string[]> = {
  lifestyle: [
    "#dailyroutine", "#lifestylegoals", "#mindfulliving", "#morningvibes",
    "#simplepleasures", "#staypresent", "#contentcreator", "#aestheticlife",
  ],
  travel: [
    "#wanderlust", "#traveldiaries", "#exploretheworld", "#travelgram",
    "#passportready", "#bucketlisttravel", "#hiddenplaces", "#adventureawaits",
  ],
  fitness: [
    "#fitnesstransformation", "#workoutmotivation", "#healthylifestyle",
    "#consistencyiskey", "#mindsetshift", "#trainhard", "#wellnessjourney",
  ],
  business: [
    "#entrepreneurship", "#productivityhacks", "#buildinpublic", "#careeradvice",
    "#founderlife", "#creatoreconomy", "#growthmindset", "#remotework",
  ],
  fashion: [
    "#outfitoftheday", "#aestheticfeed", "#streetstyle", "#minimalistfashion",
    "#vintagevibes", "#styleinspiration", "#fashiongram", "#curatedfeed",
  ],
  viral: [
    "#instagramreels", "#trendingnow", "#reelsviral", "#explorepage",
    "#contentstrategy", "#socialmediatips", "#creatorlife", "#relatablecontent",
  ],
};

export default function InstagramCaptionGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [vibe, setVibe] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("lifestyle");
  const [selectedTone, setSelectedTone] = useState("viral");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [hashtagCount, setHashtagCount] = useState<number>(6);
  const [captions, setCaptions] = useState<CaptionOption[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topicId = useId();
  const vibeId = useId();

  const generateCaptions = () => {
    const rawTopic = topic.trim() || "finding focus in daily life";
    const rawVibe = vibe.trim() || "intentional and grounded";
    const availableTags = NICHE_HASHTAGS[selectedNiche] || NICHE_HASHTAGS.lifestyle;
    const selectedTags = availableTags.slice(0, hashtagCount);

    const generated: CaptionOption[] = [
      {
        id: "hook-master",
        badge: "Viral Hook",
        hook: includeEmojis
          ? `🚨 Stop scrolling for 10 seconds: Let's talk about ${rawTopic}.`
          : `Stop scrolling for 10 seconds: Let's talk about ${rawTopic}.`,
        body: `Most people overcomplicate it, but the reality is much simpler.\n\nWhen you approach it with a ${rawVibe} perspective, everything changes.\n\n1. Start before you feel completely ready.\n2. Prioritize consistency over sporadic perfection.\n3. Protect your focus from daily noise.`,
        cta: CTAS[0],
        hashtags: selectedTags,
      },
      {
        id: "relatable-story",
        badge: "Relatable & Honest",
        hook: includeEmojis
          ? `Real talk: Nobody has ${rawTopic} completely figured out. ☕`
          : `Real talk: Nobody has ${rawTopic} completely figured out.`,
        body: `We see the highlight reels and assume everyone is gliding through without friction.\n\nBehind closed doors, it's just showing up every single day with a ${rawVibe} mindset—even when motivation is nowhere to be found.\n\nBe kind to yourself while building your craft.`,
        cta: CTAS[1],
        hashtags: selectedTags,
      },
      {
        id: "minimal-clean",
        badge: "Minimalist & Clean",
        hook: includeEmojis
          ? `Less noise. More ${rawTopic}. ✨`
          : `Less noise. More ${rawTopic}.`,
        body: `Keeping it simple today.\n\nVibe: ${rawVibe}.\nState of mind: Unshakable.`,
        cta: CTAS[4],
        hashtags: selectedTags.slice(0, 4),
      },
      {
        id: "actionable-guide",
        badge: "Actionable Takeaways",
        hook: includeEmojis
          ? `3 lessons I wish I knew earlier about ${rawTopic}: 👇`
          : `3 lessons I wish I knew earlier about ${rawTopic}:`,
        body: `• Lesson 1: Tiny daily repetitions compound faster than intense sprints.\n• Lesson 2: Your environment dictates 80% of your output.\n• Lesson 3: Stay ${rawVibe} when unexpected challenges appear.\n\nWhich of these hits closest to home right now?`,
        cta: CTAS[2],
        hashtags: selectedTags,
      },
      {
        id: "conversation-starter",
        badge: "Community Question",
        hook: includeEmojis
          ? `Genuine question for anyone navigating ${rawTopic} right now... 🤔`
          : `Genuine question for anyone navigating ${rawTopic} right now...`,
        body: `What has been your biggest win—or biggest obstacle—this week?\n\nI've been leaning heavily into a ${rawVibe} approach, and it's shifted how I handle day-to-day decisions.\n\nDrop your honest thoughts below, reading every response!`,
        cta: CTAS[0],
        hashtags: selectedTags,
      },
    ];

    setCaptions(generated);
    toast.success("Generated 5 custom Instagram captions!");
  };

  const getFullCaptionText = (cap: CaptionOption) => {
    const parts = [cap.hook, "", cap.body, "", cap.cta];
    if (cap.hashtags.length > 0) {
      parts.push("", cap.hashtags.join(" "));
    }
    return parts.join("\n");
  };

  const copyCaption = (cap: CaptionOption) => {
    const full = getFullCaptionText(cap);
    navigator.clipboard.writeText(full);
    setCopiedId(cap.id);
    toast.success("Caption copied with hashtags!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyTextOnly = (cap: CaptionOption) => {
    const textOnly = `${cap.hook}\n\n${cap.body}\n\n${cap.cta}`;
    navigator.clipboard.writeText(textOnly);
    setCopiedId(`${cap.id}-text`);
    toast.success("Caption text copied (no hashtags)!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ToolShell>
      <ToolGrid>
        {/* Left: Input & Customization Controls */}
        <ToolGridSide>
          <ToolPanel className="space-y-5">
            <ToolSectionTitle
              title="Caption Parameters"
              subtitle="Select niche, mood, and parameters for customized captions"
            />

            {/* Topic Input */}
            <ToolField
              label="Topic or Scene"
              htmlFor={topicId}
              hint="e.g. morning coffee & deep work, new product reveal, gym PR"
            >
              <Input
                id={topicId}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is this post about?"
                className="h-10"
              />
            </ToolField>

            {/* Vibe / Emotion */}
            <ToolField
              label="Desired Vibe or Tone"
              htmlFor={vibeId}
              hint="e.g. intentional, energetic, reflective, hilarious"
            >
              <Input
                id={vibeId}
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="Describe the energy"
                className="h-10"
              />
            </ToolField>

            {/* Niche Pills */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Content Category</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {NICHES.map((n) => {
                  const Icon = n.icon;
                  const isSelected = selectedNiche === n.id;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedNiche(n.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors text-left ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card/60 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Caption Style</Label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedTone === t.id
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Smile className="h-3.5 w-3.5 text-primary" /> Include Emojis
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeEmojis(!includeEmojis)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    includeEmojis ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition duration-200 ease-in-out ${
                      includeEmojis ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary" /> Hashtag Density
                </span>
                <div className="flex items-center gap-1">
                  {[0, 4, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setHashtagCount(count)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        hashtagCount === count
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-muted/30 text-muted-foreground border-border/40"
                      }`}
                    >
                      {count === 0 ? "Off" : `${count}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={generateCaptions}
              size="lg"
              className="w-full gap-2 rounded-xl font-bold shadow-md shadow-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              Generate 5 Captions
            </Button>
          </ToolPanel>
        </ToolGridSide>

        {/* Right: Results Display */}
        <ToolGridMain>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Generated Captions</h3>
                <p className="text-xs text-muted-foreground">
                  Ready-to-post variations with Instagram line breaks, CTAs, and hashtags
                </p>
              </div>
              {captions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateCaptions}
                  className="gap-1.5 text-xs rounded-xl"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Shuffle
                </Button>
              )}
            </div>

            {captions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/20 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <Instagram className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Craft scroll-stopping Instagram copy
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  Enter your topic, choose your aesthetic niche, and tap generate to get 5
                  algorithm-optimized caption variations.
                </p>
                <Button
                  onClick={generateCaptions}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs font-semibold"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  Try Sample Caption
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {captions.map((cap) => {
                  const fullText = getFullCaptionText(cap);
                  const charCount = fullText.length;
                  const isCopiedFull = copiedId === cap.id;
                  const isCopiedText = copiedId === `${cap.id}-text`;

                  return (
                    <div
                      key={cap.id}
                      className="group rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                        <span className="rounded-full bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wide">
                          {cap.badge}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                          <span>{charCount} / 2,200 chars</span>
                          {cap.hashtags.length > 0 && (
                            <span>{cap.hashtags.length} tags</span>
                          )}
                        </div>
                      </div>

                      <div className="whitespace-pre-line text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans select-all">
                        {fullText}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyTextOnly(cap)}
                          className="h-8 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground"
                          title="Copy without hashtags"
                        >
                          {isCopiedText ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Text Only
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCaption(cap)}
                          className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-primary/30 hover:border-primary hover:bg-primary/10"
                        >
                          {isCopiedFull ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-primary" />
                              Copy Full Caption
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ToolGridMain>
      </ToolGrid>
    </ToolShell>
  );
}
