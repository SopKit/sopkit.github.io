"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Upload, 
    Download, 
    User as UserIcon,
    Loader2,
    ShieldCheck,
    Check,
    Copy,
    Trash2,
    Settings,
    Grid,
    Sparkles,
    Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const NAME_DICTIONARY = {
    western: {
        male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald"],
        female: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret"],
        surnames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"],
        locations: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA"]
    },
    indian: {
        male: ["Aarav", "Vihaan", "Vivaan", "Reyansh", "Sai", "Arjun", "Krishna", "Aditya", "Ishaan", "Shaurya", "Atharv", "Pranav", "Aryan", "Kabir", "Rohan"],
        female: ["Aadhya", "Saanvi", "Ananya", "Diya", "Pari", "Pihu", "Khushi", "Aaradhya", "Kiara", "Ira", "Myra", "Avani", "Riya", "Aanya", "Anvi"],
        surnames: ["Sharma", "Verma", "Gupta", "Kumar", "Singh", "Patel", "Reddy", "Mehta", "Joshi", "Rao", "Nair", "Iyer", "Sen", "Das", "Choudhury"],
        locations: ["Mumbai, MH", "Delhi, NCR", "Bangalore, KA", "Hyderabad, TS", "Chennai, TN", "Kolkata, WB", "Pune, MH", "Ahmedabad, GJ"]
    },
    eastAsian: {
        male: ["Hiroshi", "Min-jun", "Wei", "Jian", "Haruto", "Yuki", "Dong-hyun", "Kaito", "Ji-hoon", "Takumi"],
        female: ["Sakura", "Mei", "Ji-woo", "Seo-yeon", "Yua", "Aoi", "Ying", "Fang", "Haruna", "Min-ji"],
        surnames: ["Sato", "Suzuki", "Takahashi", "Kim", "Lee", "Park", "Wang", "Li", "Zhang", "Chen"],
        locations: ["Tokyo, JP", "Seoul, KR", "Beijing, CN", "Shanghai, CN", "Kyoto, JP", "Busan, KR"]
    },
    hispanic: {
        male: ["Alejandro", "Mateo", "Santiago", "Sebastian", "Diego", "Nicolas", "Samuel", "Gabriel", "Tomas", "Lucas"],
        female: ["Sofia", "Valentina", "Isabella", "Camila", "Valeria", "Gabriela", "Mariana", "Luciana", "Daniela", "Maria"],
        surnames: ["Rodriguez", "Gomez", "Morales", "Sanchez", "Flores", "Ramirez", "Torres", "Diaz", "Vargas", "Castro"],
        locations: ["Madrid, ES", "Mexico City, MX", "Bogota, CO", "Buenos Aires, AR", "Santiago, CL", "Lima, PE"]
    }
};

const OCCUPATIONS = [
    "Software Engineer", "Data Scientist", "UI/UX Designer", "Product Manager", "Systems Architect",
    "Marketing Manager", "Financial Analyst", "Content Writer", "HR Specialist", "Operations Manager",
    "Business Analyst", "Network Engineer", "Graphic Designer", "Customer Success Lead", "Sales Executive"
];

interface GeneratedProfile {
    name: string;
    gender: string;
    age?: number;
    occupation?: string;
    location?: string;
}

export default function RandomNameGeneratorTool() {
    const [origin, setOrigin] = useState<keyof typeof NAME_DICTIONARY>("western");
    const [gender, setGender] = useState<"male" | "female" | "random">("random");
    const [count, setCount] = useState<number>(10);
    const [includeMeta, setIncludeMeta] = useState(true);
    const [exportFormat, setExportFormat] = useState<"text" | "json" | "csv">("json");
    const [profiles, setProfiles] = useState<GeneratedProfile[]>([]);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const generateNames = useCallback(() => {
        const region = NAME_DICTIONARY[origin];
        const temp: GeneratedProfile[] = [];

        for (let i = 0; i < count; i++) {
            let selectedGender = gender;
            if (selectedGender === "random") {
                selectedGender = Math.random() > 0.5 ? "male" : "female";
            }

            const firstNames = region[selectedGender];
            const lastNames = region.surnames;

            const first = firstNames[Math.floor(Math.random() * firstNames.length)];
            const last = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${first} ${last}`;

            if (includeMeta) {
                const age = Math.floor(Math.random() * 45) + 21; // 21 to 65
                const occupation = OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)];
                const location = region.locations[Math.floor(Math.random() * region.locations.length)];
                temp.push({ name: fullName, gender: selectedGender, age, occupation, location });
            } else {
                temp.push({ name: fullName, gender: selectedGender });
            }
        }
        setProfiles(temp);
    }, [origin, gender, count, includeMeta]);

    useEffect(() => {
        generateNames();
    }, [origin, gender, count, includeMeta, generateNames]);

    const getFormattedOutput = (): string => {
        if (exportFormat === "json") {
            return JSON.stringify(profiles, null, 2);
        } else if (exportFormat === "csv") {
            if (includeMeta) {
                const csvRows = ["Name,Gender,Age,Occupation,Location"];
                profiles.forEach(p => {
                    csvRows.push(`"${p.name}","${p.gender}",${p.age},"${p.occupation}","${p.location}"`);
                });
                return csvRows.join("\n");
            } else {
                const csvRows = ["Name,Gender"];
                profiles.forEach(p => {
                    csvRows.push(`"${p.name}","${p.gender}"`);
                });
                return csvRows.join("\n");
            }
        } else {
            return profiles.map(p => {
                if (includeMeta) {
                    return `${p.name} (${p.gender}, Age ${p.age}) - ${p.occupation} in ${p.location}`;
                }
                return p.name;
            }).join("\n");
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(getFormattedOutput());
            setCopiedFormat("copied");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Profiles copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const downloadFile = () => {
        const text = getFormattedOutput();
        const mime = exportFormat === "json" ? "application/json" : exportFormat === "csv" ? "text/csv" : "text/plain";
        const ext = exportFormat;
        const blob = new Blob([text], { type: `${mime};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mock_profiles.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Name generation algorithms execute locally inside browser RAM. No profiling data leaves your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Mock Profile & Name Generator</h2>
                        <p className="text-xs text-muted-foreground">Generate mock user profiles, names, occupations, and locations in JSON or CSV format locally</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button 
                        onClick={generateNames}
                        className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        <Shuffle className="w-4 h-4 mr-1.5" /> Re-Roll Names
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Options */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Settings
                        </h4>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="origin-select" className="text-[10px] text-muted-foreground uppercase">Origin Region</Label>
                                <select
                                    id="origin-select"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="western">Western Names</option>
                                    <option value="indian">Indian Names</option>
                                    <option value="eastAsian">East Asian (CN/JP/KR)</option>
                                    <option value="hispanic">Hispanic Names</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="gender-select" className="text-[10px] text-muted-foreground uppercase">Gender Profile</Label>
                                <select
                                    id="gender-select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="random">Random Mix</option>
                                    <option value="male">Male Only</option>
                                    <option value="female">Female Only</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="count-input" className="text-[10px] text-muted-foreground uppercase">Quantity</Label>
                                <Input 
                                    id="count-input"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={count}
                                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 10)))}
                                    className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-border/10 rounded-xl bg-background/50">
                                <Label htmlFor="meta-switch" className="text-xs font-bold text-foreground cursor-pointer">Include Meta Specs (Age, Job, City)</Label>
                                <Switch 
                                    id="meta-switch"
                                    checked={includeMeta} 
                                    onCheckedChange={setIncludeMeta}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Profiles Display & Export Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <div className="flex justify-between items-center border-b border-border/10 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Grid className="w-3.5 h-3.5 text-primary" /> Generated Profiles Output
                            </h4>
                            <div className="flex gap-2">
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value as any)}
                                    className="h-6 px-2 rounded border border-border/35 bg-background text-[10px] font-bold uppercase"
                                >
                                    <option value="json">JSON</option>
                                    <option value="csv">CSV</option>
                                    <option value="text">PLAIN TEXT</option>
                                </select>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={copyToClipboard}
                                    className="h-6 text-[9px] font-bold px-2 rounded border hover:bg-muted"
                                >
                                    {copiedFormat === "copied" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={downloadFile}
                                    className="h-6 text-[9px] font-bold px-2 rounded border hover:bg-muted"
                                >
                                    <Download className="w-3 h-3 text-primary" />
                                </Button>
                            </div>
                        </div>

                        <Textarea 
                            readOnly 
                            value={getFormattedOutput()} 
                            className="font-mono text-xs h-[300px] bg-background/50 border-border/30 resize-none rounded-xl p-4 leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
