"use client";

import {
	Copy,
	Download,
	Heart,
	Play,
	RefreshCw,
	Share2,
	Shuffle,
	ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Import SocialShareButtons component
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const YouTubeCommentGeneratorTool = () => {
	const [comment, setComment] = useState("");
	const [videoTopic, setVideoTopic] = useState("");
	const [selectedStyle, setSelectedStyle] = useState("");
	const [selectedEmotion, setSelectedEmotion] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedComments, setGeneratedComments] = useState([]);

	const commentStyles = [
		{
			id: "dramatic",
			name: "Dramatic",
			icon: "🎭",
			description: "Over-the-top emotional reactions",
		},
		{
			id: "first",
			name: "First Comment",
			icon: "🥇",
			description: 'Classic "First!" variations',
		},
		{
			id: "philosophical",
			name: "Philosophical",
			icon: "🤔",
			description: "Deep thoughts about simple videos",
		},
		{
			id: "conspiracy",
			name: "Conspiracy",
			icon: "👁️",
			description: "Everything is connected somehow",
		},
		{
			id: "nostalgic",
			name: "Nostalgic",
			icon: "😢",
			description: "Remember when things were better",
		},
		{
			id: "expert",
			name: "Fake Expert",
			icon: "🧠",
			description: "Pretending to know everything",
		},
		{
			id: "emotional",
			name: "Emotional",
			icon: "😭",
			description: "Crying over everything",
		},
		{
			id: "hater",
			name: "Constructive Hater",
			icon: "😤",
			description: "Negative but oddly specific",
		},
		{
			id: "bot",
			name: "Bot-like",
			icon: "🤖",
			description: "Suspiciously generic praise",
		},
		{
			id: "random",
			name: "Random",
			icon: "🎲",
			description: "Completely unrelated to video",
		},
	];

	const emotions = [
		{ id: "excited", name: "Excited", emoji: "🤩" },
		{ id: "angry", name: "Angry", emoji: "😡" },
		{ id: "sad", name: "Sad", emoji: "😢" },
		{ id: "confused", name: "Confused", emoji: "😕" },
		{ id: "amazed", name: "Amazed", emoji: "🤯" },
		{ id: "disappointed", name: "Disappointed", emoji: "😞" },
		{ id: "grateful", name: "Grateful", emoji: "🙏" },
		{ id: "skeptical", name: "Skeptical", emoji: "🤨" },
	];

	const presetComments = [
		{
			style: "dramatic",
			text: "I'M LITERALLY CRYING RIGHT NOW 😭😭😭 This video changed my entire perspective on life and I will never be the same person again. Thank you for this masterpiece 🙏✨",
		},
		{
			style: "first",
			text: "FIRST! 🥇 Been waiting for this notification for HOURS. My life is now complete. Edit: Thanks for the heart! Edit 2: OMG 3 likes?? Edit 3: MOM I'M FAMOUS",
		},
		{
			style: "philosophical",
			text: "This 30-second cat video really makes you think about the fragility of existence and how we're all just floating through the cosmic void searching for meaning... anyway cute cat 🐱",
		},
		{
			style: "conspiracy",
			text: "Notice how the background music is in B minor? That's the same key used in government mind control experiments. Wake up sheeple! 👁️ This isn't just entertainment, it's PROGRAMMING",
		},
		{
			style: "nostalgic",
			text: "Anyone else miss when YouTube was just people filming themselves in their bedrooms with a potato camera? Now everything is so PRODUCED. Take me back to 2009 😢",
		},
		{
			style: "expert",
			text: "As someone who has been studying this topic for 47 years (I'm 23 btw), I can confirm that everything in this video is 100% accurate. Source: trust me bro 🧠",
		},
	];

	const generateCommentWithAI = async (topic, style, emotion) => {
		try {
			const prompt = `Generate a ${style} YouTube comment about "${topic}" with a ${emotion} tone. 

The comment should be:
- Authentic to how real YouTube users comment
- Include appropriate emojis
- Match the ${style} style perfectly
- Show ${emotion} emotion
- Be engaging and shareable
- Sound like it could go viral

Make it feel genuine but entertaining!`;

			const response = await fetch(
				`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`,
			);
			const result = await response.text();
			return result;
		} catch (error) {
			console.error("AI generation failed:", error);
			return generateFallbackComment(style, emotion);
		}
	};

	const generateFallbackComment = (style, emotion) => {
		const templates = {
			dramatic: {
				excited:
					"OMG THIS IS LITERALLY THE BEST VIDEO EVER!!! 🤩✨ I can't even breathe right now!!!",
				sad: "I'm literally sobbing 😭😭😭 This hit me right in the feels and I can't stop crying",
				amazed:
					"MY MIND IS BLOWN 🤯🤯🤯 How is this even possible?! I need to watch this 100 times!",
			},
			first: {
				excited:
					"FIRST!!! 🥇 I've been refreshing for HOURS waiting for this! My life is complete now ✨",
				angry:
					"FIRST! And honestly? I'm disappointed. Expected better. Still first though 😤",
				grateful:
					"First! 🙏 Thank you for always posting amazing content, you literally saved my day!",
			},
			philosophical: {
				confused:
					"This really makes you question the nature of reality... are we all just NPCs in someone else's simulation? 🤔",
				amazed:
					"The profound simplicity of this content reveals the complex beauty of human existence... deep stuff 🧠✨",
				sad: "Watching this reminds me how fleeting life is... we're all just temporary visitors in this cosmic dance 😢",
			},
		};

		return (
			templates[style]?.[emotion] ||
			"This video really speaks to me on so many levels! Thanks for sharing! 🙏✨"
		);
	};

	const handleGenerate = async () => {
		if (!selectedStyle || !selectedEmotion) {
			toast.error("Please select both a comment style and emotion!");
			return;
		}

		setIsGenerating(true);
		try {
			const generated = await generateCommentWithAI(
				videoTopic || "this video",
				commentStyles.find((s) => s.id === selectedStyle)?.name,
				emotions.find((e) => e.id === selectedEmotion)?.name,
			);

			setComment(generated);

			// Add to history
			const newComment = {
				id: Date.now(),
				style: selectedStyle,
				emotion: selectedEmotion,
				topic: videoTopic,
				text: generated,
				timestamp: new Date().toLocaleString(),
			};
			setGeneratedComments((prev) => [newComment, ...prev.slice(0, 9)]);

			toast.success("Comment generated successfully!");
		} catch (error) {
			toast.error("Failed to generate comment. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePresetSelect = (preset) => {
		setComment(preset.text);
		toast.success(`Loaded ${preset.style} comment!`);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		toast.success("Comment copied to clipboard!");
	};

	const downloadComment = () => {
		const content = `YouTube Comment\n\nGenerated on: ${new Date().toLocaleString()}\nStyle: ${selectedStyle}\nEmotion: ${selectedEmotion}\nTopic: ${videoTopic}\n\n${comment}`;
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "youtube-comment.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Comment downloaded!");
	};

	const shareText = comment
		? `Check out this hilarious YouTube comment I generated: "${comment.substring(0, 100)}..." Create your own at`
		: "Generate viral YouTube comments at";

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Tabs defaultValue="generator" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="generator">Generator</TabsTrigger>
					<TabsTrigger value="presets">Popular Styles</TabsTrigger>
					<TabsTrigger value="history">History ({history.length})</TabsTrigger>
				</TabsList>

					<TabsContent value="generator" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							{/* Input Section */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Play className="w-5 h-5 text-destructive" />
										Comment Settings
									</CardTitle>
									<CardDescription>
										Customize your YouTube comment style and tone
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="topic">Video Topic (Optional)</Label>
										<Input
											id="topic"
											placeholder="e.g., cat video, cooking tutorial, music video..."
											value={videoTopic}
											onChange={(e) => setVideoTopic(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="style">Comment Style</Label>
										<Select
											value={selectedStyle}
											onValueChange={setSelectedStyle}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a comment style" />
											</SelectTrigger>
											<SelectContent>
												{commentStyles.map((style) => (
													<SelectItem key={style.id} value={style.id}>
														<div className="flex items-center gap-2">
															<span>{style.icon}</span>
															<div>
																<div className="font-medium">{style.name}</div>
																<div className="text-sm text-muted-foreground">
																	{style.description}
																</div>
															</div>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="emotion">Emotion</Label>
										<Select
											value={selectedEmotion}
											onValueChange={setSelectedEmotion}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select an emotion" />
											</SelectTrigger>
											<SelectContent>
												{emotions.map((emotion) => (
													<SelectItem key={emotion.id} value={emotion.id}>
														{emotion.emoji} {emotion.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<Button
										onClick={handleGenerate}
										disabled={
											isGenerating || !selectedStyle || !selectedEmotion
										}
										className="w-full bgtbd"
									>
										{isGenerating ? (
											<>
												<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
												Generating Comment...
											</>
										) : (
											<>
												<Play className="w-4 h-4 mr-2" />
												Generate Comment
											</>
										)}
									</Button>
								</CardContent>
							</Card>

							{/* Output Section */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Copy className="w-5 h-5 text-primary" />
										Generated Comment
									</CardTitle>
									<CardDescription>
										Your viral YouTube comment is ready!
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{comment ? (
										<>
											<div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-sm">
												<div className="flex items-start gap-3">
													<div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
														YT
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-xs text-foreground">
																@viral_viewer
															</span>
															<span className="text-[11px] text-muted-foreground">
																2 hours ago
															</span>
														</div>
														<p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
															{comment}
														</p>
														<div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
															<div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
																<ThumbsUp className="w-3.5 h-3.5" />
																<span>4.2K</span>
															</div>
															<div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
																<Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
																<span className="text-[11px]">Pinned by Creator</span>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-2 pt-1">
												<Button
													onClick={() => copyToClipboard(comment)}
													className="flex-1 font-semibold"
													size="sm"
												>
													<Copy className="w-4 h-4 mr-1.5" />
													Copy Comment
												</Button>
												<Button
													onClick={handleGenerate}
													variant="outline"
													size="sm"
													disabled={isGenerating}
												>
													<Shuffle className="w-4 h-4 mr-1.5" />
													New
												</Button>
												<Button
													onClick={downloadComment}
													variant="ghost"
													size="sm"
												>
													<Download className="w-4 h-4" />
												</Button>
											</div>
										</>
									) : (
										<div className="text-center py-8 text-muted-foreground">
											<Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
											<p>Generate a comment to see the result here</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="presets" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-4">
							{presetComments.map((preset, index) => (
								<Card
									key={index}
									className="cursor-pointer hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<CardTitle className="text-lg flex items-center gap-2">
											{commentStyles.find((s) => s.id === preset.style)?.icon}
											{commentStyles.find((s) => s.id === preset.style)?.name}{" "}
											Style
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="bg-gray-50 p-3 ">
											<div className="flex items-start gap-2">
												<div className="w-6 h-6 bg-background">U</div>
												<div className="flex-1">
													<div className="font-medium text-xs text-muted-foreground mb-1">
														@ExampleUser
													</div>
													<p className="text-sm text-foreground">
														{preset.text}
													</p>
												</div>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => handlePresetSelect(preset)}
												size="sm"
												className="flex-1"
											>
												Use This Style
											</Button>
											<Button
												onClick={() => copyToClipboard(preset.text)}
												variant="outline"
												size="sm"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="history" className="space-y-6">
						{generatedComments.length > 0 ? (
							<div className="space-y-4">
								{generatedComments.map((item) => (
									<Card key={item.id}>
										<CardHeader>
											<div className="flex justify-between items-start">
												<div>
													<CardTitle className="text-lg flex items-center gap-2">
														{
															commentStyles.find((s) => s.id === item.style)
																?.icon
														}
														{
															commentStyles.find((s) => s.id === item.style)
																?.name
														}{" "}
														-{" "}
														{emotions.find((e) => e.id === item.emotion)?.name}
													</CardTitle>
													<CardDescription>{item.timestamp}</CardDescription>
												</div>
												<div className="flex gap-2">
													<Button
														onClick={() => copyToClipboard(item.text)}
														variant="outline"
														size="sm"
													>
														<Copy className="w-4 h-4" />
													</Button>
													<Button
														onClick={() => setComment(item.text)}
														size="sm"
													>
														Use Again
													</Button>
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<div className="bg-gray-50 p-3 ">
												<p className="text-sm text-foreground">{item.text}</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
								<p>No comments generated yet. Create your first one!</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
		</div>
	);
};

export default YouTubeCommentGeneratorTool;
