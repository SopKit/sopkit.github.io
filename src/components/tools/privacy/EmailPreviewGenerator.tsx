"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EmailPreviewGenerator() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"desktop" | "mobile" | "dark">("desktop");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Preview Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input className="w-full border rounded px-2 py-1 text-sm" placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)} />
        <Textarea placeholder="Email body (HTML or plain text)..." value={body} onChange={e => setBody(e.target.value)} rows={6} />
        <div className="flex gap-2">
          {(["desktop", "mobile", "dark"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 text-xs rounded-full border ${mode === m ? "bg-primary text-primary-foreground" : ""}`}>{m}</button>
          ))}
        </div>
        {(subject || body) && (
          <div className={`border rounded overflow-hidden ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
            <div className={`px-4 py-2 border-b text-sm font-medium ${mode === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
              {subject || "(No subject)"}
            </div>
            <div className={`p-4 text-sm whitespace-pre-wrap ${mode === "mobile" ? "max-w-sm mx-auto" : ""}`}>
              {body || "(Empty body)"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
