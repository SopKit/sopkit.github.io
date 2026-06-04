import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

const TOOLS_JSON_PATH = path.join(ROOT, "src", "constants", "tools.json");
const DISPATCHER_PATH = path.join(ROOT, "src", "components", "tools", "shared", "IntentToolDispatcher.tsx");
const GENERATORS_DIR = path.join(ROOT, "src", "components", "tools", "generators");
const CALCULATORS_DIR = path.join(ROOT, "src", "components", "tools", "calculators");

fs.mkdirSync(GENERATORS_DIR, { recursive: true });
fs.mkdirSync(CALCULATORS_DIR, { recursive: true });

function toPascal(slug) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

// ----------------------------------------------------------------------------
// 1. TOOL SCHEMAS FOR CALCULATORS
// ----------------------------------------------------------------------------
const CALCULATOR_SCHEMAS = {
  "food-cost-calculator": {
    name: "Food Cost Calculator",
    inputs: [
      { id: "cost", label: "Raw Ingredient Cost ($)", default: "1.50" },
      { id: "price", label: "Menu Selling Price ($)", default: "5.00" }
    ],
    calc: `
      const c = Number(cost);
      const p = Number(price);
      if (!c || !p) return { pct: "0.00%", profit: "$0.00", margin: "0.00%" };
      return {
        pct: ((c / p) * 100).toFixed(2) + "%",
        profit: "$" + (p - c).toFixed(2),
        margin: (((p - c) / p) * 100).toFixed(2) + "%"
      };
    `,
    outputs: [
      { id: "pct", label: "Food Cost Percentage" },
      { id: "profit", label: "Gross Profit per Portion" },
      { id: "margin", label: "Gross Profit Margin" }
    ]
  },
  "freelance-rate-calculator": {
    name: "Freelance Rate Calculator",
    inputs: [
      { id: "goal", label: "Desired Annual Net Income ($)", default: "60000" },
      { id: "expenses", label: "Annual Business Expenses & Taxes ($)", default: "15000" },
      { id: "vacation", label: "Vacation Weeks Per Year", default: "4" },
      { id: "billable", label: "Billable Hours Per Week", default: "25" }
    ],
    calc: `
      const g = Number(goal);
      const e = Number(expenses);
      const v = Number(vacation);
      const b = Number(billable);
      if (!g || !b || v >= 52) return { hourly: "$0.00", daily: "$0.00" };
      const weeks = 52 - v;
      const target = g + e;
      const hours = weeks * b;
      const hourly = target / hours;
      return {
        hourly: "$" + hourly.toFixed(2) + " / hr",
        daily: "$" + (hourly * 8).toFixed(2) + " / day (8h)"
      };
    `,
    outputs: [
      { id: "hourly", label: "Required Hourly Rate" },
      { id: "daily", label: "Equivalent Daily Rate" }
    ]
  },
  "rent-affordability-calculator": {
    name: "Rent Affordability Calculator",
    inputs: [
      { id: "income", label: "Monthly Gross Income ($)", default: "5000" },
      { id: "debts", label: "Monthly Debt Payments (Loans, Cards) ($)", default: "500" }
    ],
    calc: `
      const inc = Number(income);
      const d = Number(debts);
      if (!inc) return { conservative: "$0.00", moderate: "$0.00", aggressive: "$0.00" };
      return {
        conservative: "$" + (inc * 0.25).toFixed(2) + " / mo (25% rule)",
        moderate: "$" + Math.max(0, inc * 0.30 - d).toFixed(2) + " / mo (30% rule - debts)",
        aggressive: "$" + (inc * 0.40).toFixed(2) + " / mo (40% rule)"
      };
    `,
    outputs: [
      { id: "conservative", label: "Conservative Budget" },
      { id: "moderate", label: "Recommended Moderate Budget" },
      { id: "aggressive", label: "Aggressive Maximum Budget" }
    ]
  },
  "home-loan-eligibility-calculator": {
    name: "Home Loan Eligibility Calculator",
    inputs: [
      { id: "salary", label: "Net Monthly Salary ($)", default: "6000" },
      { id: "rate", label: "Interest Rate (% Per Annum)", default: "7.5" },
      { id: "tenure", label: "Tenure (Years)", default: "20" },
      { id: "debts", label: "Existing Monthly EMIs ($)", default: "500" }
    ],
    calc: `
      const s = Number(salary);
      const r = Number(rate) / 100 / 12;
      const n = Number(tenure) * 12;
      const d = Number(debts);
      if (!s || !r || !n) return { loan: "$0.00", emi: "$0.00" };
      const maxEmi = Math.max(0, s * 0.5 - d);
      const power = Math.pow(1 + r, n);
      const loan = (maxEmi * (power - 1)) / (r * power);
      return {
        loan: "$" + Math.round(loan).toLocaleString(),
        emi: "$" + maxEmi.toFixed(2) + " / mo"
      };
    `,
    outputs: [
      { id: "loan", label: "Estimated Eligible Loan Amount" },
      { id: "emi", label: "Maximum Monthly EMI Allowed" }
    ]
  },
  "property-roi-calculator": {
    name: "Property ROI Calculator",
    inputs: [
      { id: "price", label: "Property Purchase Price ($)", default: "250000" },
      { id: "rent", label: "Monthly Rental Income ($)", default: "1800" },
      { id: "expenses", label: "Annual Expenses (Taxes, HOA, Ins.) ($)", default: "3600" }
    ],
    calc: `
      const p = Number(price);
      const r = Number(rent) * 12;
      const e = Number(expenses);
      if (!p) return { yield: "0.00%", netRoi: "0.00%" };
      return {
        yield: ((r / p) * 100).toFixed(2) + "%",
        netRoi: (((r - e) / p) * 100).toFixed(2) + "%"
      };
    `,
    outputs: [
      { id: "yield", label: "Gross Rental Yield" },
      { id: "netRoi", label: "Net Annual ROI (excluding appreciation)" }
    ]
  },
  "calorie-deficit-calculator": {
    name: "Calorie Deficit Calculator",
    inputs: [
      { id: "weight", label: "Current Weight (kg)", default: "75" },
      { id: "height", label: "Height (cm)", default: "178" },
      { id: "age", label: "Age (years)", default: "28" }
    ],
    calc: `
      const w = Number(weight);
      const h = Number(height);
      const a = Number(age);
      if (!w || !h || !a) return { bmr: "0 kcal", tdee: "0 kcal", deficit: "0 kcal" };
      // BMR using Mifflin-St Jeor (Male default)
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      const tdee = Math.round(bmr * 1.375); // Light active multiplier
      return {
        bmr: bmr.toFixed(0) + " kcal",
        tdee: tdee + " kcal",
        deficit: Math.max(1200, tdee - 500) + " kcal / day (Safe deficit)"
      };
    `,
    outputs: [
      { id: "bmr", label: "Basal Metabolic Rate (BMR)" },
      { id: "tdee", label: "Total Daily Energy Expenditure (TDEE)" },
      { id: "deficit", label: "Target Calories for Safe Weight Loss" }
    ]
  },
  "protein-intake-calculator": {
    name: "Protein Intake Calculator",
    inputs: [
      { id: "weight", label: "Current Weight (kg)", default: "70" }
    ],
    calc: `
      const w = Number(weight);
      if (!w) return { active: "0g", athlete: "0g" };
      return {
        active: Math.round(w * 1.2) + "g - " + Math.round(w * 1.6) + "g / day (Active lifestyle)",
        athlete: Math.round(w * 1.8) + "g - " + Math.round(w * 2.2) + "g / day (Muscle building)"
      };
    `,
    outputs: [
      { id: "active", label: "Target Protein (General Fitness)" },
      { id: "athlete", label: "Target Protein (Athletes/Hypertrophy)" }
    ]
  },
  "bmi-ideal-weight-calculator": {
    name: "BMI + Ideal Weight Calculator",
    inputs: [
      { id: "weight", label: "Weight (kg)", default: "70" },
      { id: "height", label: "Height (cm)", default: "175" }
    ],
    calc: `
      const w = Number(weight);
      const h = Number(height);
      if (!w || !h) return { bmi: "0.0", cat: "N/A", ideal: "0.0 kg" };
      const bmiVal = w / Math.pow(h / 100, 2);
      let cat = "Normal";
      if (bmiVal < 18.5) cat = "Underweight";
      else if (bmiVal >= 25 && bmiVal < 30) cat = "Overweight";
      else if (bmiVal >= 30) cat = "Obese";

      // Devine ideal weight formula
      const htIn = h / 2.54;
      const over5Ft = Math.max(0, htIn - 60);
      const ideal = 50 + over5Ft * 2.3;
      return {
        bmi: bmiVal.toFixed(1),
        cat,
        ideal: ideal.toFixed(1) + " kg"
      };
    `,
    outputs: [
      { id: "bmi", label: "Body Mass Index (BMI)" },
      { id: "cat", label: "Weight Category" },
      { id: "ideal", label: "Estimated Ideal Body Weight" }
    ]
  },
  "water-intake-calculator": {
    name: "Daily Water Intake Calculator",
    inputs: [
      { id: "weight", label: "Weight (kg)", default: "70" },
      { id: "exercise", label: "Daily Exercise (Minutes)", default: "45" }
    ],
    calc: `
      const w = Number(weight);
      const ex = Number(exercise);
      if (!w) return { liters: "0.00 L", oz: "0 fl oz" };
      const baseline = w * 35; // 35 ml/kg
      const extra = (ex / 30) * 350; // 350 ml per 30 mins
      const totalMl = baseline + extra;
      return {
        liters: (totalMl / 1000).toFixed(2) + " Liters / day",
        oz: Math.round(totalMl * 0.033814) + " fl oz"
      };
    `,
    outputs: [
      { id: "liters", label: "Daily Target Volume (Liters)" },
      { id: "oz", label: "Daily Target Volume (Ounces)" }
    ]
  },
  "profit-margin-calculator": {
    name: "Profit Margin Calculator",
    inputs: [
      { id: "cost", label: "Cost Price ($)", default: "40" },
      { id: "sell", label: "Selling Price ($)", default: "100" }
    ],
    calc: `
      const c = Number(cost);
      const s = Number(sell);
      if (!c || !s) return { profit: "$0.00", margin: "0.00%", markup: "0.00%" };
      const profit = s - c;
      return {
        profit: "$" + profit.toFixed(2),
        margin: ((profit / s) * 100).toFixed(2) + "%",
        markup: ((profit / c) * 100).toFixed(2) + "%"
      };
    `,
    outputs: [
      { id: "profit", label: "Gross Profit" },
      { id: "margin", label: "Gross Profit Margin %" },
      { id: "markup", label: "Markup %" }
    ]
  }
};

// ----------------------------------------------------------------------------
// 2. TOOL SCHEMAS FOR TEXT/IDEA GENERATORS
// ----------------------------------------------------------------------------
const GENERATOR_SCHEMAS = {
  "instagram-bio-generator": {
    name: "Instagram Bio Generator",
    placeholder: "Optional keywords (e.g., designer, yoga, NYC)",
    count: 5,
    fn: `
      const kw = topic.trim() || "Content Creator";
      return [
        "✨ " + kw + " | Inspiring Daily 🚀\\n🎨 Living life in color\\n📩 DM for collab",
        "🎯 Sharing my journey in " + kw + "\\n🌟 Good vibes only\\n👇 Grab free resources!",
        "💡 " + kw + " Strategy & Tips\\n✌️ Creative mind | Builder\\n💌 Let's connect",
        "🔥 Passionate about " + kw + "\\n🍂 Books, Coffee & Growth\\n✨ Follow for inspo",
        "🌟 Aspiring " + kw + "\\n📍 Location: World\\n🎈 Making an impact"
      ];
    `
  },
  "instagram-caption-generator": {
    name: "Instagram Caption Generator",
    placeholder: "Topic (e.g., product launch, morning coffee)",
    count: 3,
    fn: `
      const kw = topic.trim() || "creating daily habits";
      return [
        "🚨 STOP SCROLLING! 🚨\\n\\nLet's talk about " + kw + ". This is literally a game changer. 🔥\\n\\nDouble tap if you agree! ❤️\\n\\n#viral #trends",
        "Behind every win is a lot of unseen work. 🌟\\n\\nWorking on " + kw + " today and the results are showing. Focus and consistency.\\n\\nComment your thoughts! 👇",
        "Quick question for you guys... 🤔\\n\\nHow are you currently handling " + kw + " in your routine? Let me know below!\\n\\n#community #goals"
      ];
    `
  },
  "hashtag-generator": {
    name: "Hashtag Generator",
    placeholder: "Enter topic keyword (e.g., fitness, code)",
    count: 1,
    fn: `
      const kw = topic.trim().toLowerCase().replace(/\\s+/g, "") || "business";
      return [
        "#" + kw + " #" + kw + "tips #" + kw + "growth #" + kw + "community #" + kw + "lifestyle #trending #explore"
      ];
    `
  },
  "youtube-title-generator": {
    name: "YouTube Title Generator",
    placeholder: "Video topic (e.g., how to build an app)",
    count: 6,
    fn: `
      const kw = topic.trim() || "learn coding";
      return [
        "How to Master " + kw + " (Step-by-Step Guide)",
        "I Tried " + kw + " for 30 Days (Here's What Happened)",
        "The Ultimate " + kw + " Blueprint for Beginners",
        "Avoid These 5 Common " + kw + " Mistakes! ❌",
        "Is " + kw + " Actually Worth It? (Honest Review)",
        "Why Most People Fail at " + kw + " (And How to Fix It)"
      ];
    `
  },
  "youtube-description-generator": {
    name: "YouTube Description Generator",
    placeholder: "Short video description",
    count: 1,
    fn: `
      const kw = topic.trim() || "everything you need to know about starting out";
      return [
        "🎬 In this video, we discuss " + kw + ". Make sure to watch until the end for key takeaways!\\n\\n📌 TIMESTAMPS:\\n00:00 - Introduction\\n02:15 - Core Strategy\\n05:45 - Live Demo\\n09:00 - Wrap-Up\\n\\n🔗 RESOURCES:\\n• Website: https://yoursite.com\\n• Subscribe for more!\\n\\n#youtube #tutorial #growth"
      ];
    `
  },
  "youtube-thumbnail-text-generator": {
    name: "YouTube Thumbnail Text Generator",
    placeholder: "Video topic",
    count: 6,
    fn: `
      const kw = topic.trim() || "secrets";
      return [
        "DO THIS!",
        "EASY WAY!",
        "STOP!",
        "10X FASTER",
        "SECRET CODE",
        "FINALLY FIXED"
      ];
    `
  },
  "slogan-generator": {
    name: "Slogan Generator",
    placeholder: "Brand name",
    count: 8,
    fn: `
      const kw = topic.trim() || "SopKit";
      return [
        kw + ": Simply the Best.",
        "Get More with " + kw + ".",
        "The Future of Business is " + kw + ".",
        "Choose Smart, Choose " + kw + ".",
        kw + ": Built for Success.",
        "Experience the " + kw + " Difference.",
        "Your Partner in Growth: " + kw + ".",
        kw + ": Redefining Excellence."
      ];
    `
  },
  "logo-idea-generator": {
    name: "Logo Idea Generator",
    placeholder: "Brand or Business Name",
    count: 3,
    fn: `
      const kw = topic.trim() || "Brand";
      return [
        "💡 Style: Modern Tech\\n🎨 Colors: Navy Blue (#0F172A) & Mint Green (#10B981)\\n✍️ Font: Inter (Sans-serif)\\n🎯 Icon: Minimalist abstract letter " + (kw[0] || "B") + " with digital nodes",
        "💡 Style: Warm Creative\\n🎨 Colors: Sand Taupe (#E2D9C8) & Terracotta Orange (#D97706)\\n✍️ Font: Playfair Display (Serif)\\n🎯 Icon: Line-art leaf intertwined with brand initials",
        "💡 Style: Bold Minimalist\\n🎨 Colors: Jet Black (#111111) & Crimson Red (#DC2626)\\n✍️ Font: Montserrat (Bold)\\n🎯 Icon: Geometric thick emblem framing the name"
      ];
    `
  },
  "google-business-profile-description-generator": {
    name: "GBP Description Generator",
    placeholder: "e.g., SopKit Plumbing, NYC, Plumbing services",
    count: 1,
    fn: `
      const kw = topic.trim() || "SopKit agency in California";
      return [
        "Welcome to " + kw + ". We specialize in delivering high-quality, professional solutions designed to meet your specific local needs. With years of experience and a team of dedicated specialists, we are committed to excellence, reliable timing, and customer satisfaction. Get in touch with us today to find out how we can help you succeed!"
      ];
    `
  },
  "review-reply-generator": {
    name: "Review Reply Generator",
    placeholder: "Customer review details",
    count: 2,
    fn: `
      const kw = topic.trim() || "Great service, fast delivery!";
      return [
        "Response (Positive): Thank you so much for your kind words! We are thrilled to hear you had a great experience with our team. We look forward to serving you again soon! 😊",
        "Response (Neutral/Negative): Thank you for your feedback. We apologize for any issues you experienced. We take service quality very seriously and want to make it right. Please contact us at support@domain.com so we can assist."
      ];
    `
  },
  "restaurant-menu-description-generator": {
    name: "Menu Description Generator",
    placeholder: "Dish name & main ingredients",
    count: 3,
    fn: `
      const kw = topic.trim() || "Garlic Butter Shrimp with Herbs";
      return [
        "Gourmet: Savor our chef-inspired " + kw + ", seared to perfection, finished with locally sourced herbs, and presented elegantly.",
        "Comfort: Warm up with our home-style " + kw + ", cooked in a classic rich broth and served piping hot. The ultimate cozy meal.",
        "Fresh: Enjoy a light and healthy prep of our " + kw + ", tossed with crisp garden greens and drizzled with a house zesty vinaigrette."
      ];
    `
  },
  "client-proposal-generator": {
    name: "Client Proposal Generator",
    placeholder: "Project name / client name",
    count: 1,
    fn: `
      const kw = topic.trim() || "Website Redesign";
      return [
        "# PROJECT PROPOSAL: " + kw.toUpperCase() + "\\n\\n## 1. Scope of Work\\nWe will provide comprehensive design, coding, and launch services for " + kw + ".\\n\\n## 2. Deliverables\\n• Responsive layout\\n• Analytics setup\\n• 3 Months support\\n\\n## 3. Pricing\\nFlat rate based on agreed milestones.\\n\\n## 4. Next Steps\\nSign below and return to begin execution."
      ];
    `
  },
  "payment-reminder-generator": {
    name: "Payment Reminder Generator",
    placeholder: "Client name, Invoice ID, Amount due",
    count: 2,
    fn: `
      const kw = topic.trim() || "John Doe, INV-102, $500";
      return [
        "Friendly reminder: Hi " + kw + ", this is a quick friendly follow-up regarding invoice due. We appreciate your support and business!",
        "Escalated reminder: Hello " + kw + ", our records show that invoice payment is outstanding. Please submit payment as soon as possible to avoid terms interruption."
      ];
    `
  },
  "product-description-generator": {
    name: "Product Description Generator",
    placeholder: "Product name & details",
    count: 2,
    fn: `
      const kw = topic.trim() || "Classic Leather Wallet";
      return [
        "🔥 Elevate your collection with the all-new " + kw + "! Crafted with premium materials, this stylish piece combines durability with modern aesthetics. Perfect for daily use or gifting.",
        "✨ Experience quality and functionality with " + kw + ". Built with robust materials and featuring smart space layouts, it is designed to last and simplify your routine."
      ];
    `
  },
  "refund-policy-generator": {
    name: "Refund Policy Generator",
    placeholder: "Store name / Support email",
    count: 1,
    fn: `
      const kw = topic.trim() || "SopKit Store, support@sopkit.io";
      return [
        "Refund and Return Policy for " + kw + "\\n\\nReturns are accepted within 30 days of receipt. Items must be in original condition and packaging. To initiate a return, contact support with order details. Return shipping is responsibility of the buyer unless the item was damaged."
      ];
    `
  }
};

// ----------------------------------------------------------------------------
// STEP 1: GENERATE CALCULATOR COMPONENTS
// ----------------------------------------------------------------------------
console.log("Generating Calculator Components...");

for (const [id, schema] of Object.entries(CALCULATOR_SCHEMAS)) {
  const compName = toPascal(id) + "Tool";
  const stateInit = schema.inputs.map(ip => `  const [${ip.id}, set${toPascal(ip.id)}] = useState("${ip.default}");`).join("\n");
  const fieldsMarkup = schema.inputs.map(ip => `        <div className="space-y-1.5">
          <Label htmlFor="${ip.id}">${ip.label}</Label>
          <Input id="${ip.id}" type="number" value={${ip.id}} onChange={e => set${toPascal(ip.id)}(e.target.value)} />
        </div>`).join("\n");
  const outputMarkup = schema.outputs.map(op => `        <div className="space-y-1">
          <Label>${op.label}</Label>
          <Input readOnly className="font-mono bg-muted/40 font-bold" value={results.${op.id}} />
        </div>`).join("\n");

  const componentCode = `"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function ${compName}() {
${stateInit}

  const results = useMemo(() => {
    try {
      ${schema.calc}
    } catch {
      return { ${schema.outputs.map(op => `${op.id}: ""` ).join(", ")} };
    }
  }, [${schema.inputs.map(ip => ip.id).join(", ")}]);

  return (
    <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          ${schema.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
${fieldsMarkup}
        </div>
        <div className="space-y-3 pt-3 border-t">
${outputMarkup}
        </div>
      </CardContent>
    </Card>
  );
}
`;

  fs.writeFileSync(path.join(CALCULATORS_DIR, compName + ".jsx"), componentCode, "utf-8");
}

// ----------------------------------------------------------------------------
// STEP 2: GENERATE TEXT GENERATOR COMPONENTS
// ----------------------------------------------------------------------------
console.log("Generating Text Generator Components...");

for (const [id, schema] of Object.entries(GENERATOR_SCHEMAS)) {
  const compName = toPascal(id) + "Tool";

  const componentCode = `"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Sparkles, Check } from "lucide-react";

export default function ${compName}() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generate = () => {
    try {
      const getResults = () => {
        ${schema.fn}
      };
      setResults(getResults());
      toast.success("Content generated!");
    } catch {
      toast.error("Generation error");
    }
  };

  const copyResult = (text, index) => {
    navigator.clipboard.writeText(text.replace(/\\\\n/g, "\\n"));
    setCopiedIndex(index);
    toast.success("Copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ${schema.name} Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Specify Topic or Brand details</Label>
            <Input
              id="topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="${schema.placeholder}"
            />
          </div>
          <Button onClick={generate} className="w-full gap-2">
            Generate Ideas
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Generated Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.length > 0 ? (
            results.map((res, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/40 border flex justify-between items-start group">
                <div className="whitespace-pre-line text-sm leading-relaxed font-sans">
                  {res.replace(/\\\\n/g, "\\n")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyResult(res, index)}
                  className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity ml-2"
                >
                  {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Your generated content concepts will show up here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(GENERATORS_DIR, compName + ".jsx"), componentCode, "utf-8");
}

// ----------------------------------------------------------------------------
// STEP 3: WRITE REMAINING CUSTOM WIDGETS
// ----------------------------------------------------------------------------
console.log("Writing Remaining Custom Widgets (WhatsApp & QR)...");

// WhatsApp Link Generator
fs.writeFileSync(path.join(GENERATORS_DIR, "WhatsAppLinkGeneratorTool.jsx"), `"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, MessageSquare, ExternalLink, Download, Check, Sparkles } from "lucide-react";

export default function WhatsAppLinkGeneratorTool() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("91");
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generate = () => {
    const cleanPhone = phone.replace(/\\D/g, "");
    if (!cleanPhone) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const fullNumber = code + cleanPhone;
    const url = "https://wa.me/" + fullNumber + (msg ? "?text=" + encodeURIComponent(msg) : "");
    setLink(url);
    toast.success("WhatsApp link generated!");
  };

  useEffect(() => {
    if (!link) return;
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;

    const generateQR = async () => {
      try {
        if (!window.QRCode) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
          script.onload = () => drawQR(canvas);
          document.body.appendChild(script);
        } else {
          drawQR(canvas);
        }
      } catch (err) {
        console.error("QR Code generation error:", err);
      }
    };

    generateQR();
  }, [link]);

  const drawQR = (canvas) => {
    window.QRCode.toCanvas(canvas, link, {
      width: 200,
      margin: 2,
      color: {
        dark: "#128C7E",
        light: "#FFFFFF"
      }
    }, (err) => {
      if (err) console.error(err);
      else setQrCodeLoaded(true);
    });
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image;
    a.download = "whatsapp-qr-code.png";
    a.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            WhatsApp Chat Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="w-1/4 space-y-1.5">
              <Label htmlFor="country-code">Code</Label>
              <Input id="country-code" value={code} onChange={e => setCode(e.target.value.replace(/\\D/g, ""))} placeholder="91" />
            </div>
            <div className="w-3/4 space-y-1.5">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input id="phone-number" value={phone} onChange={e => setPhone(e.target.value.replace(/\\D/g, ""))} placeholder="9876543210" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Prefilled Message (Optional)</Label>
            <Textarea id="message" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Hello! I would like to inquire about your services..." className="h-28" />
          </div>
          <Button onClick={generate} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            Generate WhatsApp Link
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-lg">Generated Link & QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex-grow flex flex-col justify-center items-center">
          {link ? (
            <div className="w-full space-y-6 text-center">
              <div className="p-3 bg-muted/40 border rounded-lg font-mono text-sm break-all">
                {link}
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={copyLink} className="gap-2">
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy Link
                </Button>
                <Button asChild className="gap-2">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    Open Chat
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex flex-col items-center gap-3 pt-4 border-t">
                <canvas id="qr-canvas" className="rounded-lg shadow-sm border p-2 bg-white" />
                {qrCodeLoaded && (
                  <Button variant="ghost" size="sm" onClick={downloadQR} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Your click-to-chat link and downloadable QR code will appear here once generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`, "utf-8");

// QR Code Generator for Business
fs.writeFileSync(path.join(GENERATORS_DIR, "QrCodeGeneratorBusinessTool.jsx"), `"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QrCode, Download } from "lucide-react";

export default function QrCodeGeneratorBusinessTool() {
  const [type, setType] = useState("website");
  const [data, setData] = useState("");
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    if (!data) return;
    const canvas = document.getElementById("biz-qr-canvas");
    if (!canvas) return;

    const generateQR = async () => {
      try {
        if (!window.QRCode) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
          script.onload = () => drawQR(canvas);
          document.body.appendChild(script);
        } else {
          drawQR(canvas);
        }
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [data]);

  const drawQR = (canvas) => {
    window.QRCode.toCanvas(canvas, data, {
      width: 220,
      margin: 2
    }, (err) => {
      if (err) console.error(err);
      else setQrLoaded(true);
    });
  };

  const handleDownload = () => {
    const canvas = document.getElementById("biz-qr-canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "business-qr-code-" + type + ".png";
    link.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            QR Generator Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="qr-type">QR Code Purpose</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="qr-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website Link</SelectItem>
                <SelectItem value="menu">Digital Menu Link</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Direct Chat</SelectItem>
                <SelectItem value="google-review">Google Reviews Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qr-data">Enter URL / Details</Label>
            <Input id="qr-data" value={data} onChange={e => setData(e.target.value)} placeholder="https://yoursite.com" />
          </div>
          <Button onClick={() => setData(data)} className="w-full gap-2">
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur flex flex-col justify-center items-center p-6">
        {data ? (
          <div className="text-center space-y-4">
            <canvas id="biz-qr-canvas" className="rounded-lg shadow-sm border p-2 bg-white" />
            {qrLoaded && (
              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download PNG QR
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Your business QR code will be generated instantly here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
`, "utf-8");

// ----------------------------------------------------------------------------
// 4. METADATA REGISTRATION IN tools.json & dispatcher mappings
// ----------------------------------------------------------------------------
console.log("Updating tools.json data structures...");

const rawToolsJson = fs.readFileSync(TOOLS_JSON_PATH, "utf-8");
const toolsData = JSON.parse(rawToolsJson);

// Define tool lists for categories
const ALL_KEYS = [
  ...Object.keys(CALCULATOR_SCHEMAS),
  ...Object.keys(GENERATOR_SCHEMAS),
  "whatsapp-link-generator",
  "qr-code-generator-business"
];

// Clean extraSlugs from bio-generator
const generatorTools = toolsData.categories.generators.tools;
const bioTool = generatorTools.find(t => t.id === "bio-generator");
if (bioTool && bioTool.extraSlugs) {
  bioTool.extraSlugs = bioTool.extraSlugs.filter(slug => slug !== "instagram-bio-generator");
}

// Map the keys to tools.json structure
const toolsToInsert = ALL_KEYS.map(id => {
  const isCalc = !!CALCULATOR_SCHEMAS[id];
  const name = isCalc ? CALCULATOR_SCHEMAS[id].name : (GENERATOR_SCHEMAS[id]?.name || (id === "whatsapp-link-generator" ? "WhatsApp Link Generator" : "QR Code Generator for Business"));
  const cat = isCalc ? "calculators" : (id === "whatsapp-link-generator" || id === "qr-code-generator-business" ? "utilities" : (id.startsWith("youtube") ? "youtube" : "generators"));
  
  const isPopular = [
    "whatsapp-link-generator",
    "instagram-bio-generator",
    "qr-code-generator-business",
    "google-business-profile-description-generator",
    "review-reply-generator",
    "freelance-rate-calculator",
    "client-proposal-generator",
    "terms-and-conditions-generator",
    "product-description-generator",
    "profit-margin-calculator"
  ].includes(id);

  // Derive general desc
  const desc = isCalc
    ? `Calculate your ${name.toLowerCase()} instantly. Free browser-based calculator with detailed breakdowns.`
    : `Generate optimized ${name.toLowerCase()} details. Instantly copy or share customized outputs.`;

  return {
    id,
    name,
    description: desc,
    route: "/" + id,
    popular: isPopular,
    category: cat,
    features: [
      `Instant online ${name.toLowerCase()} output`,
      "100% browser-based calculations without sending data to servers",
      "One-click copy to clipboard",
      "Optimized design for all screen resolutions"
    ],
    faqs: [
      { question: `Is the ${name} free to use?`, answer: `Yes, SopKit's ${name} is completely free. No subscription or sign-up is required.` },
      { question: `Does ${name} store my input details?`, answer: "No, all inputs are processed locally in your browser. We do not store or transmit your private data." }
    ],
    howTo: {
      name: `How to use ${name}`,
      steps: [
        { name: "Fill details", text: "Enter the required parameters in the form input fields." },
        { name: "Run utility", text: "Click the action button to process the results." },
        { name: "Copy or Download", text: "Use the copy buttons to clipboard or download files as needed." }
      ]
    },
    article: `\\n## What is the ${name}?\\n\\nThis online tool helps you handle your business or personal details quickly. Perfect for streamlining your workflow.\\n\\n## Why use SopKit?\\n\\nSopKit is committed to providing free, fast, and secure tools. No login or installation required. All computations run inside your browser client.`
  };
});

// Update tools.json entries
for (const tool of toolsToInsert) {
  const cat = toolsData.categories[tool.category];
  if (cat) {
    cat.tools = cat.tools.filter(t => t.id !== tool.id);
    cat.tools.push(tool);
  }
}

// Add the terms-and-conditions-generator (renaming singular)
const utilitiesTools = toolsData.categories.utilities.tools;
// Remove old terms-and-condition-generator
toolsData.categories.utilities.tools = utilitiesTools.filter(t => t.id !== "terms-and-condition-generator" && t.id !== "terms-and-conditions-generator");

// Insert renamed terms generator
toolsData.categories.utilities.tools.push({
  id: "terms-and-conditions-generator",
  name: "Terms and Conditions Generator",
  description: "Generate a custom Terms and Conditions page for your website, app, blog, or store. Protect your intellectual property and limit liability.",
  route: "/terms-and-conditions-generator",
  popular: true,
  category: "utilities",
  extraSlugs: ["terms-and-condition-generator"],
  features: [
    "Generates terms covering usage license, disclaimer, and governing law",
    "Inputs for site name, URL, and contact email",
    "One-click copy to clipboard",
    "100% browser-based processing"
  ],
  faqs: [
    { question: "Is a Terms and Conditions page legally required?", answer: "While not universally required by privacy laws like a Privacy Policy, having Terms and Conditions is crucial for limiting liability, setting usage rules, and protecting your IP." }
  ],
  howTo: {
    name: "How to generate Terms and Conditions",
    steps: [
      { name: "Enter website URL", text: "Type your site address." },
      { name: "Enter contact details", text: "Provide support email." },
      { name: "Copy", text: "Generate the policy, review it, and copy it to your website." }
    ]
  },
  article: "\\n## Limit Your Legal Liability\\n\\nA Terms and Conditions page sets the contract between your site and visitors. It defines rules for user behavior, terms for online shop purchases, and intellectual property limits."
});

fs.writeFileSync(TOOLS_JSON_PATH, JSON.stringify(toolsData, null, 2), "utf-8");
console.log("tools.json updated successfully.");

// ----------------------------------------------------------------------------
// STEP 5: UPDATE DISPATCHER mappings
// ----------------------------------------------------------------------------
console.log("Writing dispatcher registry updates...");
let dispatcherCode = fs.readFileSync(DISPATCHER_PATH, "utf-8");

// Generate import strings for new components
const newImports = ALL_KEYS.map(id => {
  const isCalc = !!CALCULATOR_SCHEMAS[id];
  const compName = toPascal(id) + "Tool";
  const cat = isCalc ? "calculators" : "generators";
  return `const ${compName} = dynamic(() => import("@/components/tools/${cat}/${compName}"), { ssr: false });`;
}).join("\n");

// Terms and conditions generator import
const termsImport = `const TermsAndConditionsGeneratorTool = dynamic(() => import("@/components/tools/built-ins/LegalTemplateGenerator"), { ssr: false });`;

// Insert imports at appropriate place
const insertionIndex = dispatcherCode.indexOf("const AIImageGeneratorTool =");
if (insertionIndex !== -1) {
  const registryIndex = dispatcherCode.indexOf("export const INTENT_TOOL_REGISTRY:");
  if (registryIndex !== -1) {
    dispatcherCode = dispatcherCode.slice(0, registryIndex) + "\n" + newImports + "\n" + termsImport + "\n\n" + dispatcherCode.slice(registryIndex);
  }
}

// Insert registry items
const registryObjStart = dispatcherCode.indexOf("export const INTENT_TOOL_REGISTRY: Record<string, { component: React.ComponentType<any>; props: any }> = {");
if (registryObjStart !== -1) {
  const closingBraceIdx = dispatcherCode.indexOf("};", registryObjStart);
  if (closingBraceIdx !== -1) {
    const newRegistryEntries = ALL_KEYS.map(id => {
      const compName = toPascal(id) + "Tool";
      return `    "${id}": { component: ${compName}, props: {} },`;
    }).join("\n");
    
    const termsEntry = `    "terms-and-conditions-generator": { component: TermsAndConditionsGeneratorTool, props: { kind: "terms" } },`;
    
    dispatcherCode = dispatcherCode.slice(0, closingBraceIdx) + "\n" + newRegistryEntries + "\n" + termsEntry + "\n" + dispatcherCode.slice(closingBraceIdx);
  }
}

fs.writeFileSync(DISPATCHER_PATH, dispatcherCode, "utf-8");
console.log("Dispatcher updated successfully.");

// ----------------------------------------------------------------------------
// STEP 6: CREATE Next.js ROUTING PAGES
// ----------------------------------------------------------------------------
console.log("Generating Route directories and page.tsx files...");

const categoryRouteGroups = {
  utilities: "(utilities)",
  generators: "(generators)",
  youtube: "(youtube)",
  calculators: "(calculators)"
};

const allToolsWithPages = [...toolsToInsert, {
  id: "terms-and-conditions-generator",
  name: "Terms and Conditions Generator",
  description: "Generate a custom Terms and Conditions page for your website, app, blog, or store. Protect your intellectual property and limit liability.",
  route: "/terms-and-conditions-generator",
  category: "utilities"
}];

for (const tool of allToolsWithPages) {
  const group = categoryRouteGroups[tool.category] || "(utilities)";
  const folderPath = path.join(ROOT, "src", "app", group, tool.id);
  fs.mkdirSync(folderPath, { recursive: true });
  
  const pagePath = path.join(folderPath, "page.tsx");
  const canonicalUrl = `https://sopkit.github.io${tool.route}`;
  
  const pageCode = `import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "${tool.name} - Free Online Tool | SopKit",
	description: "${tool.description}",
	keywords: "${tool.name.toLowerCase()}, ${tool.id}, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "${canonicalUrl}",
	},
	openGraph: {
		title: "${tool.name} - Free Online Tool | SopKit",
		description: "${tool.description}",
		url: "${canonicalUrl}",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "${tool.name} - Free Online Tool | SopKit",
		description: "${tool.description}",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("${tool.route}");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: tool.name,
						description: tool.description,
						url: "${canonicalUrl}",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD"
						}
					})
				}}
			/>
			<ToolLayout tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
`;

  fs.writeFileSync(pagePath, pageCode, "utf-8");
}

// ----------------------------------------------------------------------------
// STEP 7: REMOVE OLD terms-and-condition-generator directory
// ----------------------------------------------------------------------------
const oldDir = path.join(ROOT, "src", "app", "(utilities)", "terms-and-condition-generator");
if (fs.existsSync(oldDir)) {
  console.log("Removing old singular route terms-and-condition-generator...");
  fs.rmSync(oldDir, { recursive: true, force: true });
}

console.log("All tasks completed successfully!");
