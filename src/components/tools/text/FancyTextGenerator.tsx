"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Unicode maps for font styles
const fontMaps: Record<string, (text: string) => string> = {
	"Bubble / Circle": (text) => {
		const bubbleMap: Record<string, string> = {
			'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
			'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
			'0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
		};
		return text.split('').map(char => bubbleMap[char] || char).join('');
	},
	"Square Block": (text) => {
		const squareMap: Record<string, string> = {
			'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🄺', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
			'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🄺', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
		};
		return text.split('').map(char => squareMap[char] || char).join('');
	},
	"Bold Serif": (text) => {
		const boldSerifMap: Record<string, string> = {
			'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
			'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
		};
		return text.split('').map(char => boldSerifMap[char] || char).join('');
	},
	"Cursive Script": (text) => {
		const scriptMap: Record<string, string> = {
			'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓿', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
			'A': '𝓐', 'B': '𝓑', 'C': '𝓓', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
		};
		return text.split('').map(char => scriptMap[char] || char).join('');
	},
	"Gothic Fraktur": (text) => {
		const gothicMap: Record<string, string> = {
			'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
			'A': '𝔄', 'B': '𝔅', 'C': '𝔍', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': '𝔋', 'I': '𝔌', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': '𝔕', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': '𝔝'
		};
		return text.split('').map(char => gothicMap[char] || char).join('');
	},
	"Double Struck": (text) => {
		const doubleMap: Record<string, string> = {
			'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
			'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ'
		};
		return text.split('').map(char => doubleMap[char] || char).join('');
	},
	"Tiny Caps": (text) => {
		const tinyMap: Record<string, string> = {
			'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
			'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
		};
		return text.split('').map(char => tinyMap[char] || char).join('');
	},
	"Monospace": (text) => {
		const monoMap: Record<string, string> = {
			'a': '𝖛', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟',
			'A': '𝖁', 'B': '𝖂', 'C': '𝖃', 'D': '𝖄', 'E': '𝖅', 'F': '𝖇', 'G': '𝖈', 'H': '𝖉', 'I': '𝖊', 'J': '𝖋', 'K': '𝖌', 'L': '𝖍', 'M': '𝖎', 'N': '𝖏', 'O': '𝖐', 'P': '𝖑', 'Q': '𝖒', 'R': '𝖓', 'S': '𝖔', 'T': '𝖕', 'U': '𝖖', 'V': '𝖗', 'W': '𝖘', 'X': '𝖙', 'Y': '𝖚', 'Z': '𝖛'
		};
		return text.split('').map(char => monoMap[char] || char).join('');
	},
};

const DECORATION_STYLES = [
	{ prefix: "꧁", suffix: "꧂" },
	{ prefix: "★彡 ", suffix: " 彡★" },
	{ prefix: "░▒▓ ", suffix: " ▓▒░" },
	{ prefix: "✿ ", suffix: " ✿" },
	{ prefix: "☠️ ", suffix: " ☠️" },
	{ prefix: "ᰔᩚ ", suffix: " ᰔᩚ" },
	{ prefix: "⚡ ", suffix: " ⚡" },
];

export default function FancyTextGenerator() {
	const [inputText, setInputText] = useState("SopKit");
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const handleCopy = async (key: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedKey(key);
			setTimeout(() => setCopiedKey(null), 2000);
		} catch (err) {
			console.error("Failed to copy", err);
		}
	};

	return (
		<div className="space-y-6">
			{/* Text Input Block */}
			<div className="space-y-2">
				<label htmlFor="fancy-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
					Type your text here:
				</label>
				<div className="flex gap-2">
					<Input
						id="fancy-input"
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="e.g. John Doe, FreeFireName"
						className="h-12 text-lg focus-visible:ring-primary/20 bg-background/50 border-border/40"
					/>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setInputText("")}
						className="h-12 w-12 border-border/40 hover:bg-destructive/5 shrink-0"
						title="Clear input"
					>
						<RefreshCw className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Generated Output Grid */}
			<div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
				{Object.entries(fontMaps).map(([fontName, converter]) => {
					const converted = converter(inputText || "Type Something");
					const key = `font-${fontName}`;
					return (
						<Card key={key} className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
							<CardContent className="p-4 flex items-center justify-between gap-4">
								<div className="space-y-1.5 min-w-0">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
										{fontName}
									</span>
									<span className="text-base sm:text-lg font-semibold text-foreground truncate block font-mono">
										{converted}
									</span>
								</div>
								<Button
									size="sm"
									onClick={() => handleCopy(key, converted)}
									className="shrink-0 gap-1.5 font-bold text-xs"
									variant={copiedKey === key ? "secondary" : "default"}
								>
									{copiedKey === key ? (
										<>
											<Check className="h-3.5 w-3.5 text-emerald-500" />
											<span>Copied</span>
										</>
									) : (
										<>
											<Copy className="h-3.5 w-3.5" />
											<span>Copy</span>
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					);
				})}

				{/* Fancy decorated names */}
				{DECORATION_STYLES.map((dec, idx) => {
					const decoratedText = `${dec.prefix}${inputText || "SopKit"}${dec.suffix}`;
					const key = `dec-${idx}`;
					return (
						<Card key={key} className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
							<CardContent className="p-4 flex items-center justify-between gap-4">
								<div className="space-y-1.5 min-w-0">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
										Nickname Decoration {idx + 1}
									</span>
									<span className="text-base sm:text-lg font-semibold text-foreground truncate block">
										{decoratedText}
									</span>
								</div>
								<Button
									size="sm"
									onClick={() => handleCopy(key, decoratedText)}
									className="shrink-0 gap-1.5 font-bold text-xs"
									variant={copiedKey === key ? "secondary" : "default"}
								>
									{copiedKey === key ? (
										<>
											<Check className="h-3.5 w-3.5 text-emerald-500" />
											<span>Copied</span>
										</>
									) : (
										<>
											<Copy className="h-3.5 w-3.5" />
											<span>Copy</span>
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
