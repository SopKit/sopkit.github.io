import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function PageShell({ className, children, ...props }: PageShellProps) {
	return (
		<main
			className={cn(
				"relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden antialiased",
				className
			)}
			{...props}
		>
			{children}
		</main>
	);
}
