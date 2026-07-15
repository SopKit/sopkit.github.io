"use client";

import dynamic from "next/dynamic";
import React from "react";

const LazyStackAuthProvider = dynamic(
	() => import("./StackAuthProvider"),
	{ ssr: false }
);

export function ClientStackAuthProvider({ children }: { children: React.ReactNode }) {
	return <LazyStackAuthProvider>{children}</LazyStackAuthProvider>;
}
