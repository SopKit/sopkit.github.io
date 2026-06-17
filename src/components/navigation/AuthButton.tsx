"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import dynamic from "next/dynamic";

function LoginLink() {
	return (
		<Button
			variant="outline"
			size="sm"
			className="gap-1.5 text-xs font-medium rounded-none"
			asChild
		>
			<a href="/handler/sign-in">
				<LogIn className="h-3.5 w-3.5" />
				Login
			</a>
		</Button>
	);
}

// The Stack SDK is heavy (~640 KB). It lives in its own module so a real
// separate chunk is produced; here we load that chunk lazily, client-only.
// Anonymous visitors (the common case, and the entire build when Stack auth is
// unconfigured) never download it.
const LazyAuthedButton = dynamic(
	() => import("./AuthedButton").then((m) => m.AuthedButton),
	{
		ssr: false,
		loading: () => <LoginLink />,
	},
);

export function AuthButton() {
	const stackProjectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
	const stackPublishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

	// If Stack is not configured, show a plain login link.
	if (!stackProjectId || !stackPublishableKey) {
		return <LoginLink />;
	}

	// useUser throws if no StackProvider is above it (e.g. when the provider
	// fell back to no-auth). Degrade to a plain login link instead of crashing.
	return (
		<ErrorBoundary fallback={<LoginLink />}>
			<LazyAuthedButton fallback={<LoginLink />} />
		</ErrorBoundary>
	);
}
