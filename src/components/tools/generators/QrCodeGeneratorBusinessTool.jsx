"use client";

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
