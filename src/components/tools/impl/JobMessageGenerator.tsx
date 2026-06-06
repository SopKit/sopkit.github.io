"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Linkedin, 
  Send, 
  User, 
  Briefcase, 
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Shield,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const TEMPLATES = {
  "cover-letter": {
    title: "Cover Letter Generator",
    description: "Create a personalized cover letter for your job application.",
    fields: ["name", "role", "company", "skills", "experience"],
    generate: (f) => `Dear Hiring Manager at ${f.company || "[Company Name]"},

I am writing to express my strong interest in the ${f.role || "[Role Name]"} position. With my background in ${f.skills || "[Your Key Skills]"} and ${f.experience || "[X] years of"} experience, I am confident that I can contribute significantly to your team.

At my previous role, I developed a strong foundation in ${f.skills || "[Skills]"}, which allowed me to deliver high-quality results. I am particularly drawn to ${f.company || "your company"} because of its reputation for innovation and excellence.

I have attached my resume for your review and look forward to the possibility of discussing how my skills and experience align with the needs of your team.

Best regards,
${f.name || "[Your Name]"}`
  },
  "linkedin-headline": {
    title: "LinkedIn Headline Generator",
    description: "Generate professional headlines that stand out to recruiters.",
    fields: ["role", "skills", "experience"],
    generate: (f) => {
      const role = f.role || "[Role]";
      const skills = f.skills ? f.skills.split(",").map(s => s.trim()).slice(0, 3).join(" | ") : "[Skill 1] | [Skill 2]";
      return [
        `${role} | Helping companies build better products with ${skills}`,
        `${role} at ${f.company || "[Company]"} | Specialized in ${skills}`,
        `${role} | ${f.experience || "[X]"} Years Experience in ${skills}`,
        `Passionate ${role} | Building the future with ${skills}`
      ].join("\n\n---\n\n");
    }
  },
  "internship-message": {
    title: "Internship Outreach",
    description: "Generate short outreach messages for internships.",
    fields: ["name", "role", "company", "skills"],
    generate: (f) => `Hi ${f.company || "[Founder/HR Name]"},

I'm ${f.name || "[Your Name]"}, a student passionate about ${f.skills || "[Your Interest/Field]"}. I've been following ${f.company || "[Company]"} and I'm very impressed with your work in [Mention a specific project/aspect].

I'm looking for an internship opportunity in ${f.role || "[Role]"} and would love to contribute to your team. I have experience with ${f.skills || "[Skills]"} and I'm a quick learner.

Would you be open to a quick chat?

Best,
${f.name || "[Your Name]"}`
  }
};

export default function JobMessageGenerator({ defaultTab = "cover-letter" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    skills: "",
    experience: ""
  });
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const generateMessage = () => {
    setIsGenerating(true);
    setCopied(false);
    
    // Simulate generation
    setTimeout(() => {
      const content = TEMPLATES[activeTab].generate(formData);
      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success("Generated successfully!");
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Tabs defaultValue={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        setGeneratedContent("");
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="cover-letter" className="rounded-xl gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin-headline" className="rounded-xl gap-2">
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn Headline</span>
          </TabsTrigger>
          <TabsTrigger value="internship-message" className="rounded-xl gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Internship</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <Card className="border-primary/10 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Details
                </CardTitle>
                <CardDescription>
                  {TEMPLATES[activeTab].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TEMPLATES[activeTab].fields.includes("name") && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                  </div>
                )}
                {TEMPLATES[activeTab].fields.includes("role") && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Target Role</Label>
                    <Input id="role" placeholder="Frontend Developer" value={formData.role} onChange={handleInputChange} />
                  </div>
                )}
                {TEMPLATES[activeTab].fields.includes("company") && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Recruiter Name</Label>
                    <Input id="company" placeholder="SopKit Inc." value={formData.company} onChange={handleInputChange} />
                  </div>
                )}
                {TEMPLATES[activeTab].fields.includes("skills") && (
                  <div className="space-y-2">
                    <Label htmlFor="skills">Key Skills (comma separated)</Label>
                    <Input id="skills" placeholder="React, Tailwind, Node.js" value={formData.skills} onChange={handleInputChange} />
                  </div>
                )}
                {TEMPLATES[activeTab].fields.includes("experience") && (
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience / Current Status</Label>
                    <Input id="experience" placeholder="3 years or Computer Science Student" value={formData.experience} onChange={handleInputChange} />
                  </div>
                )}

                <Button className="w-full h-12 gap-2 mt-4" onClick={generateMessage} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Generate {TEMPLATES[activeTab].title.split(" ")[0]}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full border-primary/20 bg-primary/5 min-h-[400px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Result</CardTitle>
                {generatedContent && (
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {generatedContent ? (
                  <div className="h-full bg-background/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap border overflow-y-auto max-h-[500px]">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                    <div className="p-4 rounded-full bg-muted">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm">Enter your details and click generate to see the magic.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            100% Private
          </h4>
          <p className="text-xs text-muted-foreground">We don't store your personal details or generated messages. Everything happens in your browser.</p>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            Human-sounding Templates
          </h4>
          <p className="text-xs text-muted-foreground">Our templates are designed to sound natural and professional, avoiding generic AI-generated vibes.</p>
        </div>
      </div>
    </div>
  );
}
