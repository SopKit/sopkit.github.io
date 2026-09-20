"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Plus,
  X,
  MoveUp,
  MoveDown,
  ShieldCheck,
  Settings,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MergeFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  pageRange: string;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: MergeFile[] = [];

    setIsProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");

      for (const file of selectedFiles) {
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          let pageCount = 0;

          try {
            const fileBuffer = await file.arrayBuffer();
            const doc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
            pageCount = doc.getPageCount();
          } catch (err) {
            console.error("Failed to load PDF pages count for file:", file.name, err);
          }

          validFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            name: file.name,
            size: file.size,
            pageCount,
            pageRange: "",
          });
        }
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
        setDownloadUrl(null);
        toast.success(validFiles.length + " PDF files added.");
      } else if (selectedFiles.length > 0) {
        toast.error("Please upload valid PDF files.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load PDF editing engine.");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDownloadUrl(null);
  };

  const moveFile = (index: number, direction: number) => {
    const newFiles = [...files];

    if (direction === -1 && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 1 && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }

    setFiles(newFiles);
    setDownloadUrl(null);
  };

  const handleRangeChange = (id: string, range: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, pageRange: range } : f)));
    setDownloadUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const fileBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const totalPages = pdf.getPageCount();

        let pagesToKeep: number[] = [];

        if (fileObj.pageRange.trim()) {
          const parts = fileObj.pageRange.split(",");

          for (const part of parts) {
            const trimmed = part.trim();

            if (trimmed.includes("-")) {
              const [start, end] = trimmed
                .split("-")
                .map((num) => parseInt(num, 10));

              if (!Number.isNaN(start) && !Number.isNaN(end)) {
                for (let i = start; i <= end; i++) {
                  if (i >= 1 && i <= totalPages) {
                    pagesToKeep.push(i - 1);
                  }
                }
              }
            } else {
              const pageNum = parseInt(trimmed, 10);

              if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                pagesToKeep.push(pageNum - 1);
              }
            }
          }
        } else {
          pagesToKeep = Array.from({ length: totalPages }, (_, i) => i);
        }

        if (pagesToKeep.length > 0) {
          const uniquePages = Array.from(new Set(pagesToKeep));
          const copiedPages = await mergedPdf.copyPages(pdf, uniquePages);
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      toast.success("PDF files merged successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to merge PDFs. One of the documents may be password protected or corrupted."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
        <div className="flex items-center gap-3 border-b border-border/40 bg-muted/10 px-4 py-3 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground sm:text-sm">Private browser processing</p>
            <p className="text-[11px] leading-4 text-muted-foreground sm:text-xs">
              Files stay on your device. Nothing is uploaded to a server.
            </p>
          </div>
        </div>

        <div className="px-0 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                    PDF files to merge
                  </h2>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    {files.length === 0
                      ? "Add two or more files and arrange them before merging."
                      : files.length +
                        " " +
                        (files.length === 1 ? "file" : "files") +
                        " ready to merge"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <input
                id="add-more"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
              />
              <Button
                variant="outline"
                size="sm"
                className="pointer-events-none h-9 w-full gap-2 rounded-lg border-border/70 bg-background/55 px-3 text-xs font-semibold shadow-sm sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                Add files
              </Button>
            </div>
          </div>

          <div className="mt-5">
            {files.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-muted/[0.14] transition-colors hover:border-primary/45 hover:bg-primary/[0.025]">
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />

                <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[285px]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background/70 shadow-sm">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Drop PDFs here or click to browse
                  </p>
                  <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
                    Add multiple PDF files at once, then reorder them and optionally choose page ranges.
                  </p>
                  <div className="mt-4 inline-flex items-center rounded-full border border-border/50 bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    PDF only · processed locally
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/25">
                <div className="flex items-center justify-between border-b border-border/45 bg-muted/[0.12] px-3.5 py-2.5 sm:px-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Merge order
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {files.length} {files.length === 1 ? "document" : "documents"}
                  </span>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                  {files.map((fileObj, index) => (
                    <div
                      key={fileObj.id}
                      className="group border-b border-border/35 last:border-b-0"
                    >
                      <div className="flex items-start gap-3 px-3.5 py-3.5 sm:px-4">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary ring-1 ring-primary/10">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <span
                              className="truncate text-sm font-semibold text-foreground"
                              title={fileObj.name}
                            >
                              {fileObj.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {(fileObj.size / 1024 / 1024).toFixed(2)} MB · {fileObj.pageCount} pages
                            </span>
                          </div>

                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Settings className="h-3.5 w-3.5 shrink-0" />
                              <Label
                                htmlFor={"range-" + fileObj.id}
                                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                              >
                                Page range
                              </Label>
                            </div>
                            <Input
                              id={"range-" + fileObj.id}
                              type="text"
                              placeholder="All pages · 1-3, 5"
                              value={fileObj.pageRange}
                              onChange={(e) => handleRangeChange(fileObj.id, e.target.value)}
                              className="h-8 w-full rounded-lg border-border/50 bg-muted/[0.12] text-xs sm:max-w-[220px]"
                            />
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-75 sm:transition-opacity sm:group-hover:opacity-100">
                          <Button
                            onClick={() => moveFile(index, -1)}
                            disabled={index === 0}
                            variant="ghost"
                            size="icon"
                            aria-label="Move file up"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          >
                            <MoveUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => moveFile(index, 1)}
                            disabled={index === files.length - 1}
                            variant="ghost"
                            size="icon"
                            aria-label="Move file down"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          >
                            <MoveDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => removeFile(fileObj.id)}
                            variant="ghost"
                            size="icon"
                            aria-label={"Remove " + fileObj.name}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/40 bg-muted/[0.10] p-4 sm:p-5">
          {downloadUrl ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Your merged PDF is ready</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Download the combined document when you are ready.
                </p>
              </div>

              <Button
                asChild
                className="h-10 rounded-lg px-4 text-sm font-semibold shadow-sm"
              >
                <a href={downloadUrl} download="merged-document.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-foreground">
                  {files.length < 2
                    ? "Add at least two PDFs to continue."
                    : "Everything looks ready."}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  You can reorder files or set page ranges before exporting.
                </p>
              </div>

              <Button
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                className="h-11 w-full rounded-lg text-sm font-semibold shadow-sm sm:w-auto sm:min-w-[220px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Merging documents…
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Merge PDFs
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
