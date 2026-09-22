"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { OPEN_SEARCH_EVENT } from "./search-events";

const UnifiedSearchModal = dynamic(
  () => import("./UnifiedSearchModal").then((module) => module.UnifiedSearchModal),
  { ssr: false },
);

export function SearchModalHost() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setLoaded(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setLoaded(true);
      }
    };

    window.addEventListener(OPEN_SEARCH_EVENT, handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!loaded) return null;
  return <UnifiedSearchModal initialOpen onOpenChange={() => setLoaded(false)} />;
}
