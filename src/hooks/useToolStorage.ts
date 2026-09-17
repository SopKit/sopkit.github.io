"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface StorageOptions {
  debounceMs?: number;
}

/**
 * useToolStorage — Safely persists tool inputs into the browser's localStorage.
 * Automatically saves on change, restores on next visit, and prevents data loss.
 *
 * @param toolId Unique identifier of the tool (e.g. "jwt-decoder")
 * @param key State key (e.g. "token", "input-text")
 * @param initialValue Default value if nothing is saved
 * @param options Debounce and behavior options
 */
export function useToolStorage<T>(
  toolId: string,
  key: string,
  initialValue: T,
  options: StorageOptions = {}
): [
  T,
  (valOrUpdater: T | ((prev: T) => T)) => void,
  {
    isSaved: boolean;
    lastSaved: Date | null;
    clearStorage: () => void;
    hasStoredValue: boolean;
  }
] {
  const { debounceMs = 300 } = options;
  const storageKey = `sopkit_tool_${toolId}_${key}`;

  const [value, setValueState] = useState<T>(initialValue);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [hasStoredValue, setHasStoredValue] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isHydratedRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Restore on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setValueState(JSON.parse(stored));
        setHasStoredValue(true);
        setIsSaved(true);
      }
    } catch (e) {
      console.warn(`[useToolStorage] Failed to read ${storageKey}:`, e);
    } finally {
      isHydratedRef.current = true;
    }
  }, [storageKey]);

  // Persist with debounce
  const setValue = useCallback(
    (valOrUpdater: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const nextValue =
          typeof valOrUpdater === "function"
            ? (valOrUpdater as (p: T) => T)(prev)
            : valOrUpdater;

        if (typeof window !== "undefined" && isHydratedRef.current) {
          setIsSaved(false);
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            try {
              if (
                nextValue === "" ||
                nextValue === null ||
                nextValue === undefined
              ) {
                localStorage.removeItem(storageKey);
                setHasStoredValue(false);
              } else {
                localStorage.setItem(storageKey, JSON.stringify(nextValue));
                setHasStoredValue(true);
              }
              setIsSaved(true);
              setLastSaved(new Date());
            } catch (e) {
              console.warn(`[useToolStorage] Failed to write ${storageKey}:`, e);
            }
          }, debounceMs);
        }

        return nextValue;
      });
    },
    [storageKey, debounceMs]
  );

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setValueState(initialValue);
      setHasStoredValue(false);
      setIsSaved(false);
      setLastSaved(null);
    } catch (e) {
      console.warn(`[useToolStorage] Failed to clear ${storageKey}:`, e);
    }
  }, [storageKey, initialValue]);

  return [
    value,
    setValue,
    {
      isSaved,
      lastSaved,
      clearStorage,
      hasStoredValue,
    },
  ];
}

/**
 * useRecentHistory — Keeps track of recent runs/outputs for quick retrieval.
 */
export function useRecentHistory<T>(
  toolId: string,
  key: string = "recents",
  maxItems = 6
): [
  T[],
  (item: T) => void,
  () => void
] {
  const storageKey = `sopkit_recent_${toolId}_${key}`;
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn(`[useRecentHistory] Read failed for ${storageKey}:`, e);
    }
  }, [storageKey]);

  const pushItem = useCallback(
    (newItem: T) => {
      setItems((prev) => {
        // Filter out duplicate if primitive or has identical string representation
        const filtered = prev.filter(
          (p) => JSON.stringify(p) !== JSON.stringify(newItem)
        );
        const next = [newItem, ...filtered].slice(0, maxItems);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (e) {
          console.warn(`[useRecentHistory] Save failed:`, e);
        }
        return next;
      });
    },
    [storageKey, maxItems]
  );

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setItems([]);
    } catch (e) {
      console.warn(`[useRecentHistory] Clear failed:`, e);
    }
  }, [storageKey]);

  return [items, pushItem, clearHistory];
}

/**
 * useCopyFeedback — Easy clipboard copying with animated checkmark feedback.
 */
export function useCopyFeedback(durationMs = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), durationMs);
        return true;
      } catch (err) {
        // Fallback for older browsers / iframe contexts
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), durationMs);
          return true;
        } catch {
          return false;
        }
      }
    },
    [durationMs]
  );

  return { copied, copy };
}
