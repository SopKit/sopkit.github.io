"use client";

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
    const cleanPhone = phone.replace(/\D/g, "");
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
              <Input id="country-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} placeholder="91" />
            </div>
            <div className="w-3/4 space-y-1.5">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input id="phone-number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
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
