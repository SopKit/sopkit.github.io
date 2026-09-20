import { redirect } from "next/navigation";

interface BlogsAliasProps {
	searchParams: Promise<{ page?: string }>;
}

export default async function BlogsAliasPage({ searchParams }: BlogsAliasProps) {
	const params = await searchParams;
	const page = params.page ? `?page=${encodeURIComponent(params.page)}` : "";
	redirect(`/blog${page}`);
}
