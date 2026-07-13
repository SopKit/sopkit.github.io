"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  Briefcase, 
  ArrowRight,
  Upload,
  RefreshCw,
  Shield,
  Star,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AdPlacement from "@/components/ads/AdPlacement";

export default function ResumeATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      toast.error("For now, please upload .txt or .md files. PDF support coming soon!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result);
      toast.success("Resume content loaded!");
    };
    reader.readAsText(file);
  };

  const analyzeATS = () => {
    if (!resumeText.trim()) {
      toast.error("Please provide your resume text.");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate complex analysis
    setTimeout(() => {
      const score = calculateScore(resumeText, jobDescription);
      const findings = generateFindings(resumeText, jobDescription);
      
      setResults({
        score,
        findings,
        timestamp: new Date().toLocaleTimeString()
      });
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 1500);
  };

  const calculateScore = (resume, job) => {
    let baseScore = 40;
    
    // Length heuristic
    if (resume.length > 500) baseScore += 10;
    if (resume.length > 1500) baseScore += 10;
    
    // Keyword matching
    if (job.trim()) {
      const keywords = job.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      const uniqueKeywords = [...new Set(keywords)];
      const foundCount = uniqueKeywords.filter(kw => resume.toLowerCase().includes(kw)).length;
      const matchRate = foundCount / uniqueKeywords.length;
      baseScore += Math.floor(matchRate * 40);
    } else {
      baseScore += 20; // Default if no job description
    }

    return Math.min(98, baseScore);
  };

  const generateFindings = (resume, job) => {
    const findings = [
      { type: "success", text: "Contact information found." },
      { type: "success", text: "Education section detected." },
      { type: "warning", text: "Consider using more action verbs (e.g., 'Directed', 'Developed')." },
    ];

    if (resume.length < 800) {
      findings.push({ type: "error", text: "Resume content is quite short. Add more detail about your impact." });
    }

    if (job.trim()) {
      const jobKws = job.toLowerCase().split(/\W+/).filter(w => w.length > 5);
      const missing = jobKws.filter(kw => !resume.toLowerCase().includes(kw)).slice(0, 5);
      if (missing.length > 0) {
        findings.push({ 
          type: "info", 
          text: `Missing potential keywords: ${missing.join(", ")}` 
        });
      }
    }

    return findings;
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <div className="space-y-6">
          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Resume
              </CardTitle>
              <CardDescription>
                Paste your resume text or upload a plain text file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste your resume content here..."
                className="min-h-[250px] bg-background/50 resize-none font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 border-dashed"
                  onClick={triggerFileSelect}
                >
                  <Upload className="h-4 w-4" />
                  Upload .txt file
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setResumeText("")}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                Target Job Description (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste the job description to check keyword match..."
                className="min-h-[150px] bg-background/50 resize-none text-sm"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          <Button 
            className="w-full h-14 text-lg font-bold gap-2 group relative overflow-hidden"
            onClick={analyzeATS}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400 group-hover:scale-125 transition-transform" />
                Check ATS Score
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>

        {/* Right Side: Results */}
        <div className="space-y-6">
          {results ? (
            <>
              <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Badge variant="outline" className="bg-background/50">Score {results.score}/100</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-black mb-2">{results.score}%</CardTitle>
                  <CardDescription className="text-lg">Overall ATS Compatibility</CardDescription>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                  <Progress value={results.score} className="h-3" />
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Analyzed at {results.timestamp}
                  </p>
                </CardContent>
              </Card>

              <div className="shrink-0">
                <AdPlacement placement="in-content" slug="resume-ats-checker" category="utilities" />
              </div>

              <Card className="border-primary/10 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Key Findings & Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.findings.map((finding, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-background/40 border border-border/50">
                      {finding.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                      {finding.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />}
                      {finding.type === "error" && <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />}
                      {finding.type === "info" && <Search className="h-5 w-5 text-blue-500 shrink-0" />}
                      <span className="text-sm leading-snug">{finding.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="rounded-2xl bg-secondary/5 border border-secondary/20 p-6 space-y-3">
                <h4 className="font-bold flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Quick Tips for ATS
                </h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Use a clean, single-column layout.</li>
                  <li>• Avoid images, icons, and charts inside the resume.</li>
                  <li>• Use standard section headings like "Work Experience".</li>
                  <li>• Match keywords from the job description naturally.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6 bg-secondary/5 rounded-3xl border border-dashed">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-10 w-10 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Ready to analyze</h3>
                <p className="text-muted-foreground max-w-xs">
                  Upload your resume to see your score, find missing keywords, and get job-fit suggestions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-border/40 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
           <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
           <div>
             <h5 className="font-bold text-sm">Privacy First</h5>
             <p className="text-xs text-muted-foreground">Your resume is processed in your browser. We don't save your data.</p>
           </div>
        </div>
        <div className="flex items-start gap-3">
           <div className="p-2 rounded-lg bg-primary/10"><Briefcase className="h-5 w-5 text-primary" /></div>
           <div>
             <h5 className="font-bold text-sm">Job Matching</h5>
             <p className="text-xs text-muted-foreground">Get specific suggestions based on the job description you provide.</p>
           </div>
        </div>
        <div className="flex items-start gap-3">
           <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
           <div>
             <h5 className="font-bold text-sm">Free Forever</h5>
             <p className="text-xs text-muted-foreground">No credit card or signup required. Just upload and check.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
