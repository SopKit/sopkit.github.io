"use client";

import * as React from "react";
import { Check, Database, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolAutoSaveIndicatorProps {
  isSaved?: boolean;
  hasStoredValue?: boolean;
  onClear?: () => void;
  className?: string;
  showClearButton?: boolean;
}

export function ToolAutoSaveIndicator({
  isSaved = true,
  hasStoredValue = false,
  onClear,
  className,
  showClearButton = true,
}: ToolAutoSaveIndicatorProps) {
  if (!hasStoredValue && isSaved) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium text-muted-foreground bg-muted/40 border border-border/50 rounded-lg px-2 py-1 transition-all",
        className
      )}
      title="Data is preserved locally in your browser memory and localStorage. Nothing is sent to any server."
    >
      <div className="flex items-center gap-1">
        {isSaved ? (
          <>
            <Check className="w-3 h-3 text-emerald-500" />
            <span className="text-foreground/80">Saved locally</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-muted-foreground">Saving...</span>
          </>
        )}
      </div>

      {hasStoredValue && showClearButton && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
          title="Clear saved data and reset to initial state"
        >
          <RotateCcw className="w-2.5 h-2.5 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
