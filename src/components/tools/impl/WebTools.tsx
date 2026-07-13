"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  DollarSign,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export default function WebTools({ defaultTab = "domain" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Domain Generator States
  const [keyword, setKeyword] = useState("");
  const [domains, setDomains] = useState([]);

  // Website Cost States
  const [pages, setPages] = useState(5);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [designLevel, setDesignLevel] = useState("premium");

  // SEO Generator States
  const [topic, setTopic] = useState("");
  const [seoResults, setSeoResults] = useState(null);

  // --- Domain Generator ---
  const generateDomains = () => {
    if (!keyword) return;
    const suffixes = ["ly", "ify", "hq", "base", "hub", "kit", "lab", "flow"];
    const results = suffixes.map(s => `${keyword}${s}.com`);
    setDomains(results);
    toast.success("Domain ideas generated!");
  };

  // --- Website Cost ---
  const costEstimate = (() => {
    let base = pages * 50; // $50 per page
    if (isEcommerce) base += 500;
    if (designLevel === "premium") base *= 1.5;
    return { min: Math.round(base), max: Math.round(base * 1.3) };
  })();

  // --- SEO Generator ---
  const generateSeo = () => {
    if (!topic) return;
    setSeoResults({
      title: `${topic} | Best Online Tool | SopKit`,
      description: `Use our free ${topic} tool to process your data instantly. Fast, secure, and 100% browser-based with no signup required.`
    });
    toast.success("SEO tags generated!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="domain" className="rounded-xl gap-2">
            <Globe className="h-4 w-4" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="cost" className="rounded-xl gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Calc
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-xl gap-2">
            <Search className="h-4 w-4" />
            SEO Tags
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {activeTab === "domain" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Domain Name Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enter your niche or keyword</Label>
                    <Input placeholder="e.g. food, tech, shop" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                  </div>
                  <Button className="w-full gap-2" onClick={generateDomains}>
                    <Sparkles className="h-4 w-4" />
                    Generate Names
                  </Button>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {domains.length > 0 ? (
                  domains.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                      <span className="font-mono font-bold text-primary">{d}</span>
                      <Button variant="ghost" size="icon" onClick={() => {
                        navigator.clipboard.writeText(d);
                        toast.success("Copied!");
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-10 text-center border border-dashed rounded-3xl opacity-50">
                    <Globe className="h-10 w-10 mb-2" />
                    <p className="text-sm">Enter a keyword to get domain ideas.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "cost" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Website Cost Estimator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Number of Pages: {pages}</Label>
                    </div>
                    <Slider value={[pages]} onValueChange={(v) => setPages(v[0])} max={50} min={1} step={1} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ecommerce">Ecommerce Support?</Label>
                    <Button 
                      variant={isEcommerce ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setIsEcommerce(!isEcommerce)}
                    >
                      {isEcommerce ? "Yes" : "No"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Design Quality</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={designLevel === "basic" ? "default" : "outline"} 
                        onClick={() => setDesignLevel("basic")}
                      >
                        Basic
                      </Button>
                      <Button 
                        variant={designLevel === "premium" ? "default" : "outline"} 
                        onClick={() => setDesignLevel("premium")}
                      >
                        Premium
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 flex flex-col items-center justify-center p-10 text-center">
                <CardHeader>
                  <CardTitle className="text-4xl font-black">${costEstimate.min} - ${costEstimate.max}</CardTitle>
                  <CardDescription className="text-lg">Estimated Development Cost</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <p className="text-sm text-muted-foreground">This is a rough estimate for design and development. Hosting and maintenance not included.</p>
                   <Button className="w-full h-12 gap-2">
                     <Zap className="h-4 w-4" />
                     Hire a Developer
                   </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">SEO Snippet Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Topic or Main Keyword</Label>
                    <Input placeholder="e.g. PDF Compressor" value={topic} onChange={(e) => setTopic(e.target.value)} />
                  </div>
                  <Button className="w-full gap-2" onClick={generateSeo}>
                    <RefreshCw className="h-4 w-4" />
                    Generate Tags
                  </Button>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {seoResults ? (
                  <>
                    <div className="p-4 rounded-xl border bg-card/50 space-y-2">
                      <Label className="text-xs text-muted-foreground">SEO Title</Label>
                      <p className="text-blue-600 font-bold hover:underline cursor-pointer">{seoResults.title}</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card/50 space-y-2">
                      <Label className="text-xs text-muted-foreground">Meta Description</Label>
                      <p className="text-sm text-muted-foreground">{seoResults.description}</p>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-10 text-center border border-dashed rounded-3xl opacity-50">
                    <Search className="h-10 w-10 mb-2" />
                    <p className="text-sm">Enter a topic to generate SEO tags.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
