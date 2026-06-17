"use client";

import { useUser, UserButton } from "@stackframe/stack";
import type { ReactNode } from "react";

// This component lives in its own module so the heavy @stackframe/stack SDK
// (~640 KB) is split into a separate chunk and only downloaded when Stack auth
// is configured AND a user is present. Do NOT import this module statically
// from anything that renders on every page (navbar/layout) — import it lazily
// via next/dynamic from AuthButton instead.

interface Props {
	// Shown when there is no authenticated user. Passed in by AuthButton so this
	// module only needs the Stack SDK and not the button UI.
	fallback: ReactNode;
}

export function AuthedButton({ fallback }: Props) {
	const user = useUser({ or: "return-null" });

	if (user) {
		return (
			<div className="flex items-center gap-2">
				<UserButton />
			</div>
		);
	}

	return <>{fallback}</>;
}

export default AuthedButton;
