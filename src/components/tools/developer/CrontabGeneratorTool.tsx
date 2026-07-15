"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Clock, 
    Copy, 
    Check, 
    Sparkles, 
    ShieldCheck, 
    Settings,
    Grid,
    HelpCircle,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TEMPLATES = [
    { name: "Every Minute", min: "*", hr: "*", dom: "*", mon: "*", dow: "*" },
    { name: "Every Hour", min: "0", hr: "*", dom: "*", mon: "*", dow: "*" },
    { name: "Every Midnight", min: "0", hr: "0", dom: "*", mon: "*", dow: "*" },
    { name: "Every Sunday at Midnight", min: "0", hr: "0", dom: "*", mon: "*", dow: "0" },
    { name: "First of Every Month", min: "0", hr: "0", dom: "1", mon: "*", dow: "*" },
    { name: "Every Weekday at 9 AM", min: "0", hr: "9", dom: "*", mon: "*", dow: "1-5" }
];

export default function CrontabGeneratorTool() {
    const [minute, setMinute] = useState("*");
    const [hour, setHour] = useState("*");
    const [dayOfMonth, setDayOfMonth] = useState("*");
    const [month, setMonth] = useState("*");
    const [dayOfWeek, setDayOfWeek] = useState("*");

    const [expression, setExpression] = useState("* * * * *");
    const [description, setDescription] = useState("Every minute");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const applyTemplate = (t: typeof TEMPLATES[number]) => {
        setMinute(t.min);
        setHour(t.hr);
        setDayOfMonth(t.dom);
        setMonth(t.mon);
        setDayOfWeek(t.dow);
        toast.success(`Preset "${t.name}" loaded successfully.`);
    };

    const handleExpressionChange = (val: string) => {
        setExpression(val);
        const parts = val.trim().split(/\s+/);
        if (parts.length === 5) {
            setMinute(parts[0]);
            setHour(parts[1]);
            setDayOfMonth(parts[2]);
            setMonth(parts[3]);
            setDayOfWeek(parts[4]);
        }
    };

    const generateExplanation = useCallback(() => {
        const expr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
        setExpression(expr);

        let desc = "Runs ";

        // Minutes explanation
        if (minute === "*") {
            desc += "every minute ";
        } else if (minute.startsWith("*/")) {
            desc += `every ${minute.split("/")[1]} minutes `;
        } else {
            desc += `at minute ${minute} `;
        }

        // Hours explanation
        if (hour === "*") {
            desc += "of every hour ";
        } else if (hour.startsWith("*/")) {
            desc += `of every ${hour.split("/")[1]} hours `;
        } else {
            desc += `at hour ${hour}:00 `;
        }

        // Day of Month explanation
        if (dayOfMonth === "*") {
            desc += "on every day of the month ";
        } else {
            desc += `on day ${dayOfMonth} of the month `;
        }

        // Months explanation
        if (month === "*") {
            desc += "of every month ";
        } else {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const mIdx = parseInt(month, 10);
            desc += `in ${months[mIdx - 1] || month} `;
        }

        // Day of Week explanation
        if (dayOfWeek === "*") {
            // standard every day
        } else if (dayOfWeek === "1-5") {
            desc += "on weekdays (Monday through Friday)";
        } else if (dayOfWeek === "0,6") {
            desc += "on weekends (Saturday and Sunday)";
        } else {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dIdx = parseInt(dayOfWeek, 10);
            desc += `on ${days[dIdx] || dayOfWeek}`;
        }

        setDescription(desc.trim());
    }, [minute, hour, dayOfMonth, month, dayOfWeek]);

    useEffect(() => {
        generateExplanation();
    }, [minute, hour, dayOfMonth, month, dayOfWeek, generateExplanation]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(expression);
            setCopiedFormat("cron");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Cron expression copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Expression generation is fully calculated inside your local browser. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Cron Expression Generator</h2>
                        <p className="text-xs text-muted-foreground">Generate, translate, and verify crontab syntax schedule expressions locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Selectors */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-6 shadow-sm">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Interactive Schedule Builder
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
                            {/* Minutes */}
                            <div className="space-y-1.5">
                                <Label htmlFor="minute-select" className="text-[10px] text-muted-foreground uppercase">Minutes</Label>
                                <select
                                    id="minute-select"
                                    value={minute}
                                    onChange={(e) => setMinute(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="*">Every Minute (*)</option>
                                    <option value="*/5">Every 5 Minutes (*/5)</option>
                                    <option value="*/10">Every 10 Minutes (*/10)</option>
                                    <option value="*/15">Every 15 Minutes (*/15)</option>
                                    <option value="*/30">Every 30 Minutes (*/30)</option>
                                    <option value="0">At start of hour (0)</option>
                                </select>
                            </div>

                            {/* Hours */}
                            <div className="space-y-1.5">
                                <Label htmlFor="hour-select" className="text-[10px] text-muted-foreground uppercase">Hours</Label>
                                <select
                                    id="hour-select"
                                    value={hour}
                                    onChange={(e) => setHour(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="*">Every Hour (*)</option>
                                    <option value="*/2">Every 2 Hours (*/2)</option>
                                    <option value="*/4">Every 4 Hours (*/4)</option>
                                    <option value="*/6">Every 6 Hours (*/6)</option>
                                    <option value="*/12">Every 12 Hours (*/12)</option>
                                    <option value="0">Midnight (0)</option>
                                    <option value="12">Noon (12)</option>
                                </select>
                            </div>

                            {/* Day of Month */}
                            <div className="space-y-1.5">
                                <Label htmlFor="dom-select" className="text-[10px] text-muted-foreground uppercase">Day of Month</Label>
                                <select
                                    id="dom-select"
                                    value={dayOfMonth}
                                    onChange={(e) => setDayOfMonth(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="*">Every Day (*)</option>
                                    <option value="1">1st of Month (1)</option>
                                    <option value="15">15th of Month (15)</option>
                                    <option value="31">Last Day of Month (31)</option>
                                </select>
                            </div>

                            {/* Month */}
                            <div className="space-y-1.5">
                                <Label htmlFor="month-select" className="text-[10px] text-muted-foreground uppercase">Month</Label>
                                <select
                                    id="month-select"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="*">Every Month (*)</option>
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="6">June</option>
                                    <option value="12">December</option>
                                </select>
                            </div>

                            {/* Day of Week */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="dow-select" className="text-[10px] text-muted-foreground uppercase">Day of Week</Label>
                                <select
                                    id="dow-select"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="*">Every Day (*)</option>
                                    <option value="1-5">Weekdays only (Mon-Fri)</option>
                                    <option value="0,6">Weekends only (Sat-Sun)</option>
                                    <option value="1">Monday only</option>
                                    <option value="5">Friday only</option>
                                    <option value="0">Sunday only</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Expression and Preset Templates */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Expression Box */}
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <Label htmlFor="expr-input" className="text-xs font-bold text-muted-foreground uppercase block">Expression Output</Label>
                        <div className="flex gap-2">
                            <Input 
                                id="expr-input"
                                type="text"
                                value={expression}
                                onChange={(e) => handleExpressionChange(e.target.value)}
                                className="h-10 font-mono text-base tracking-wider font-bold border-border/30 bg-background/50 flex-1"
                            />
                            <Button 
                                onClick={copyToClipboard}
                                className="bg-primary hover:bg-primary/95 text-white h-10 px-4 font-bold rounded-lg"
                            >
                                {copiedFormat === "cron" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 border border-border/20 rounded-xl bg-background/40">
                            <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Human Translation</span>
                                <p className="text-xs font-bold text-foreground capitalize leading-normal">{description}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Presets Card */}
                    <Card className="p-6 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs font-semibold">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Common Schedule Presets
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                            {TEMPLATES.map((t) => (
                                <Button
                                    key={t.name}
                                    variant="outline"
                                    onClick={() => applyTemplate(t)}
                                    className="h-10 justify-start rounded-lg text-xs font-bold border-border/40 hover:border-primary/40 hover:bg-primary/5"
                                >
                                    <Play className="w-3 h-3 mr-2 text-primary" /> {t.name}
                                </Button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
