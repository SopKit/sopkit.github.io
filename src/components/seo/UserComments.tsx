"use client";

import {
	Heart,
	MessageCircle,
	MessageSquare,
	Reply,
	Share2,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Comments data - currently empty. Add real comments from your database/API when available.
const SAMPLE_COMMENTS = [];

function CommentItem({ comment, onReply, onLike, depth = 0 }: any) {
	const [liked, setLiked] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");
	// "shared" = sent via the native share sheet, "copied" = page link
	// copied to the clipboard because no share sheet was available.
	// Either state only ever appears after the action really happened.
	const [shareState, setShareState] = useState<"idle" | "shared" | "copied">(
		"idle",
	);

	const formatTimeAgo = (timestamp: any) => {
		const now = new Date();
		const time = new Date(timestamp);
		const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		return `${Math.floor(diffInHours / 24)}d ago`;
	};

	const handleLike = () => {
		setLiked(!liked);
		onLike(comment.id, !liked);
	};

	const handleReply = () => {
		if (replyText.trim()) {
			onReply(comment.id, replyText);
			setReplyText("");
			setShowReplyForm(false);
		}
	};

	// Share this comment's page. Mirrors SocialShare: the native share
	// sheet when the browser offers one (a cancelled sheet is not a
	// failure and does not fall through to the clipboard), otherwise a
	// clipboard copy of the page's own URL. No comment anchor is
	// claimed: no `#comment-<id>` anchor exists on the page, so the
	// shared URL is the page itself and the shared text is the
	// comment's own content, truncated so a long comment does not
	// overflow the share sheet.
	const handleShare = async () => {
		const url = window.location.href;
		const text = String(comment.content ?? "").slice(0, 200);
		if (navigator.share) {
			try {
				await navigator.share({ text, url });
				setShareState("shared");
				setTimeout(() => setShareState("idle"), 2000);
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			}
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			setShareState("copied");
			setTimeout(() => setShareState("idle"), 2000);
		} catch (err) {
			console.error("Error copying link:", err);
		}
	};

	const renderStars = (rating: any) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span
				key={i}
				className={`text-sm ${i < rating ? "text-primary" : "text-gray-300"}`}
			>
				★
			</span>
		));
	};

	return (
		<div className={`${depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
			<div className="flex gap-3 p-4 border-b last:border-b-0">
				<Avatar className="h-10 w-10">
					<AvatarImage src={comment.avatar} alt={comment.author} />
					<AvatarFallback>
						{comment.author
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<span className="font-medium text-sm">{comment.author}</span>
						{comment.verified && (
							<Badge variant="secondary" className="text-xs">
								Verified
							</Badge>
						)}
						{comment.helpful && (
							<Badge variant="outline" className="text-xs text-primary">
								Helpful
							</Badge>
						)}
						<span className="text-xs text-muted-foreground">
							{formatTimeAgo(comment.timestamp)}
						</span>
					</div>

					{comment.toolRating && (
						<div className="flex items-center gap-1">
							{renderStars(comment.toolRating)}
							<span className="text-xs text-muted-foreground ml-1">
								Rated this tool
							</span>
						</div>
					)}

					<p className="text-sm text-foreground leading-relaxed">
						{comment.content}
					</p>

					<div className="flex items-center gap-4 text-sm">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLike}
							className={`h-auto p-1 ${liked ? "text-destructive" : "text-muted-foreground"}`}
						>
							<Heart
								className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`}
							/>
							{comment.likes + (liked ? 1 : 0)}
						</Button>

						{depth < 3 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowReplyForm(!showReplyForm)}
								className="h-auto p-1 text-muted-foreground"
							>
								<Reply className="h-4 w-4 mr-1" />
								Reply
							</Button>
						)}

						<Button
							variant="ghost"
							size="sm"
							onClick={handleShare}
							className="h-auto p-1 text-muted-foreground"
						>
							<Share2 className="h-4 w-4 mr-1" />
							{shareState === "copied"
								? "Link copied"
								: shareState === "shared"
									? "Shared"
									: "Share"}
						</Button>
					</div>

					{showReplyForm && (
						<div className="mt-3 space-y-2">
							<Textarea
								placeholder="Write a reply..."
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								className="min-h-[80px]"
							/>
							<div className="flex gap-2">
								<Button size="sm" onClick={handleReply}>
									Post Reply
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowReplyForm(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

					{/* Replies render here, nested, because a reply that
						vanishes on submit is a lie: previously handleReply
						only logged to the console and nothing ever
						rendered. Depth is capped at 3 levels by hiding
						the Reply button deeper (see above). */}
					{(comment.replies ?? []).length > 0 && (
						<div className="mt-2 space-y-2">
							{(comment.replies ?? []).map((reply: any) => (
								<CommentItem
									key={reply.id}
									comment={reply}
									onReply={onReply}
									onLike={onLike}
									depth={depth + 1}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function UserComments({
	toolId,
	toolName,
	showStats = true,
	allowComments = true,
}: any) {
	const [comments, setComments] = useState(SAMPLE_COMMENTS);
	const [newComment, setNewComment] = useState("");
	const [sortBy, setSortBy] = useState("newest"); // newest, oldest, helpful, popular
	const [filterBy, setFilterBy] = useState("all"); // all, verified, helpful
	const [showCommentForm, setShowCommentForm] = useState(false);

	const handleAddComment = () => {
		if (newComment.trim()) {
			const comment = {
				id: Date.now(),
				author: "You",
				avatar: "/avatars/default.jpg",
				content: newComment,
				timestamp: new Date().toISOString(),
				likes: 0,
				// A list, not a count: replies render nested under their
				// parent (see CommentItem), so a posted reply must be
				// stored, not counted and discarded.
				replies: [],
				verified: false,
				helpful: false,
				toolRating: 5,
			};

			setComments([comment, ...comments]);
			setNewComment("");
			setShowCommentForm(false);
		}
	};

	// Walk the whole tree, not just the top level: replies are nested
	// comments, and a like or reply aimed at a nested comment must
	// reach it instead of silently doing nothing.
	const updateCommentTree = (list: any[], commentId: any, update: any): any[] =>
		list.map((comment: any) =>
			comment.id === commentId
				? update(comment)
				: {
						...comment,
						replies: updateCommentTree(comment.replies ?? [], commentId, update),
					},
		);

	const handleLike = (commentId: any, liked: any) => {
		setComments(
			updateCommentTree(comments, commentId, (comment: any) => ({
				...comment,
				likes: comment.likes + (liked ? 1 : -1),
			})),
		);
	};

	const handleReply = (commentId: any, replyText: any) => {
		const reply = {
			id: Date.now(),
			author: "You",
			avatar: "/avatars/default.jpg",
			content: replyText,
			timestamp: new Date().toISOString(),
			likes: 0,
			replies: [],
			verified: false,
			helpful: false,
		};
		setComments(
			updateCommentTree(comments, commentId, (comment: any) => ({
				...comment,
				replies: [...(comment.replies ?? []), reply],
			})),
		);
	};

	const sortedComments = [...comments].sort((a: any, b: any) => {
		switch (sortBy) {
			case "oldest":
				return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
			case "helpful":
				return (b.helpful ? 1 : 0) - (a.helpful ? 1 : 0);
			case "popular":
				return b.likes - a.likes;
			default: // newest
				return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
		}
	});

	const filteredComments = sortedComments.filter((comment) => {
		switch (filterBy) {
			case "verified":
				return comment.verified;
			case "helpful":
				return comment.helpful;
			default:
				return true;
		}
	});

	// The average of comments that actually carry a rating — never a
	// hardcoded number. When no comment is rated there is no average
	// to show, and the header says so instead of inventing one (the
	// previous code rendered a fixed four-point-eight rating over an
	// empty list, while
	// the schema layer deliberately emits no aggregateRating without
	// genuine reviews). Only rated comments enter both the sum and
	// the divisor; the old code summed all comments but divided by
	// the rated count.
	const ratedComments = comments.filter(
		(c: any) => typeof c.toolRating === "number",
	);
	const averageRating =
		ratedComments.length > 0
			? ratedComments.reduce(
					(sum: number, comment: any) => sum + comment.toolRating,
					0,
				) / ratedComments.length
			: null;

	return (
		<section className="py-8">
			<div className="container mx-auto px-4">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="h-5 w-5 text-primary" />
								User Comments & Reviews
								<Badge variant="secondary">{comments.length}</Badge>
							</CardTitle>

							{showStats && (
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<TrendingUp className="h-4 w-4" />
										<span>
											{averageRating !== null
												? `${averageRating.toFixed(1)}/5 avg rating`
												: "No ratings yet"}
										</span>
									</div>
									<div>
										{comments.filter((c) => c.helpful).length} helpful reviews
									</div>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Add Comment Form */}
						{allowComments && (
							<div className="space-y-4">
								{!showCommentForm ? (
									<Button
										variant="outline"
										onClick={() => setShowCommentForm(true)}
										className="w-full"
									>
										<MessageSquare className="h-4 w-4 mr-2" />
										Share your experience with {toolName}
									</Button>
								) : (
									<div className="space-y-3 p-4 border ">
										<Textarea
											placeholder={`How was your experience with ${toolName}? Help others by sharing your feedback...`}
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
											className="min-h-[100px]"
										/>
										<div className="flex gap-2">
											<Button onClick={handleAddComment}>Post Comment</Button>
											<Button
												variant="outline"
												onClick={() => setShowCommentForm(false)}
											>
												Cancel
											</Button>
										</div>
										<p className="text-xs text-muted-foreground">
											Comments you add here stay in this browser
											session only — they are not saved or published.
										</p>
									</div>
								)}
							</div>
						)}

						{/* Filters and Sorting */}
						<div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 ">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Sort by:</span>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="text-sm border border-border rounded px-2 py-1 bg-background"
								>
									<option value="newest">Newest</option>
									<option value="oldest">Oldest</option>
									<option value="helpful">Most Helpful</option>
									<option value="popular">Most Liked</option>
								</select>
							</div>

							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Filter:</span>
								<select
									value={filterBy}
									onChange={(e) => setFilterBy(e.target.value)}
									className="text-sm border border-border rounded px-2 py-1 bg-background"
								>
									<option value="all">All Comments</option>
									<option value="verified">Verified Only</option>
									<option value="helpful">Helpful Only</option>
								</select>
							</div>

							<div className="text-sm text-muted-foreground">
								Showing {filteredComments.length} of {comments.length} comments
							</div>
						</div>

						{/* Comments List */}
						<div className="divide-y divide-border">
							{filteredComments.length > 0 ? (
								filteredComments.map((comment) => (
									<CommentItem
										key={comment.id}
										comment={comment}
										onReply={handleReply}
										onLike={handleLike}
									/>
								))
							) : (
								<div className="text-center py-12">
									<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
									<h3 className="text-lg font-medium mb-2">No comments yet</h3>
									<p className="text-muted-foreground">
										Be the first to share your experience with {toolName}!
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
