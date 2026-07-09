"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, HomeIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getAllTools, getRouteById, STATIC_ROUTES } from "@/lib/tools";

export default function NotFoundPage() {
	const [isRedirecting, setIsRedirecting] = useState(true);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const pathname = window.location.pathname;
			const search = window.location.search;

			// 1. /shorts/:id -> /youtube-downloader/?url=https://www.youtube.com/shorts/:id
			const shortsMatch = pathname.match(/^\/shorts\/([^/]+)\/?$/);
			if (shortsMatch) {
				const id = shortsMatch[1];
				const youtubeUrl = `https://www.youtube.com/shorts/${id}`;
				window.location.replace(`/youtube-downloader/?url=${encodeURIComponent(youtubeUrl)}`);
				return;
			}

			// 2. /v/:id -> /youtube-downloader/?url=https://www.youtube.com/v/:id
			const vMatch = pathname.match(/^\/v\/([^/]+)\/?$/);
			if (vMatch) {
				const id = vMatch[1];
				const youtubeUrl = `https://www.youtube.com/v/${id}`;
				window.location.replace(`/youtube-downloader/?url=${encodeURIComponent(youtubeUrl)}`);
				return;
			}

			// 3. /embed-redirect/:id -> /youtube-downloader/?url=https://www.youtube.com/embed/:id
			const embedMatch = pathname.match(/^\/embed-redirect\/([^/]+)\/?$/);
			if (embedMatch) {
				const id = embedMatch[1];
				const youtubeUrl = `https://www.youtube.com/embed/${id}`;
				window.location.replace(`/youtube-downloader/?url=${encodeURIComponent(youtubeUrl)}`);
				return;
			}

			// 4. /watch -> /youtube-downloader/?url=https://www.youtube.com/watch...
			if (pathname.startsWith("/watch")) {
				const youtubeUrl = `https://www.youtube.com/watch${search}`;
				window.location.replace(`/youtube-downloader/?url=${encodeURIComponent(youtubeUrl)}`);
				return;
			}

			// 5. /embed/:player/:videoId -> /embed/?player=:player&id=:videoId
			const playerEmbedMatch = pathname.match(/^\/embed\/([^/]+)\/([^/]+)\/?$/);
			if (playerEmbedMatch) {
				const player = playerEmbedMatch[1];
				const videoId = playerEmbedMatch[2];
				window.location.replace(`/embed/?player=${player}&id=${videoId}`);
				return;
			}

			setIsRedirecting(false);
		}
	}, []);

	const popularTools = getAllTools()
		.filter((t) => t.popular)
		.slice(0, 4);

	if (isRedirecting) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<div className="text-center space-y-2">
					<div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
					<p className="text-xs text-muted-foreground">Redirecting...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-16 max-w-4xl">
			<div className="text-center space-y-8">
				{/* 404 Header */}
				<div className="space-y-4">
					<h1 className="text-6xl font-bold text-foreground">404</h1>
					<h2 className="text-2xl font-semibold text-foreground">
						Page Not Found
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto">
						Sorry, we couldn't find the page you're looking for. But don't
						worry, we have plenty of useful tools to explore!
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg">
						<Link href={STATIC_ROUTES.HOME}>
							<HomeIcon className="w-4 h-4 mr-2" />
							Go Home
						</Link>
					</Button>

					<Button asChild variant="outline" size="lg">
						<Link href={getRouteById("search")}>
							<SearchIcon className="w-4 h-4 mr-2" />
							Search Tools
						</Link>
					</Button>
				</div>

				{/* Popular Tools */}
				<div className="mt-16">
					<h3 className="text-xl font-semibold text-foreground mb-6">
						Popular Tools
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{popularTools.map((tool) => (
							<Link key={tool.id} href={tool.route} className="block">
								<Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
									<CardHeader className="pb-3">
										<CardTitle className="text-base group-hover:text-primary transition-colors">
											{tool.name}
										</CardTitle>
										<CardDescription className="text-sm group-hover:text-foreground transition-colors line-clamp-2">
											{tool.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="w-full flex items-center justify-between p-2 rounded-none bg-transparent group-hover:bg-primary/10 transition-colors">
											<span className="text-sm">Try it</span>
											<ArrowRightIcon className="w-4 h-4" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
