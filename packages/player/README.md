# @sopkit/player

[![NPM Version](https://img.shields.io/npm/v/@sopkit/player.svg?style=flat-square&color=06b6d4)](https://www.npmjs.com/package/@sopkit/player)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://sopkit.space/packages/player)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
<a href="https://visitorbadge.io/status?path=https%3A%2F%2Fsopkit.space%2Fpackages%2Fplayer"><img src="https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fsopkit.space%2Fpackages%2Fplayer&countColor=%23263759&style=flat" alt="Visitors" /></a>

Ultra-fast, modern HTML5 video player engine with zero external dependencies. Features smooth timeline scrubbing, Picture-in-Picture (PiP), fullscreen mode, keyboard navigation, and theme customization.

Part of the [SopKit Developer Ecosystem](https://sopkit.space/).

---

## ⚡ Features

- **Zero Dependencies**: Lightweight pure TypeScript/JavaScript (< 5 KB minified).
- **Custom UI Overlay**: Gradient floating controls, smooth progress timeline, and responsive buttons.
- **Picture-in-Picture**: Built-in Picture-in-Picture support with automatic browser capability detection.
- **Keyboard Shortcuts**: YouTube-like hotkeys (`Space`/`K` play-pause, `J`/`L` seek ±5s, `M` mute, `F` fullscreen, `Arrows` volume).
- **Playback Rate Selector**: Instant switching between `0.5x`, `0.75x`, `1x`, `1.25x`, `1.5x`, and `2x`.
- **Event Driven**: Full event subscription model (`play`, `pause`, `timeupdate`, `volumechange`, `ended`).
- **Dual Formats**: Native ESM (`import`) and CommonJS (`require`) builds with strict TypeScript definitions.

---

## 📦 Installation

```bash
npm install @sopkit/player
```

Or with Bun / PNPM:

```bash
bun add @sopkit/player
pnpm add @sopkit/player
```

---

## 🚀 Quick Start

### Vanilla HTML / JavaScript

```html
<div id="video-container" style="width: 640px; height: 360px;"></div>

<script type="module">
  import { createPlayer } from "@sopkit/player";

  const player = createPlayer({
    container: "#video-container",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
    themeColor: "#06b6d4",
  });

  player.on("play", (state) => {
    console.log("Playing at:", state.currentTime);
  });
</script>
```

### TypeScript / Modern Frameworks

```typescript
import { SopKitPlayer } from "@sopkit/player";

const container = document.getElementById("player")!;
const player = new SopKitPlayer({
  container,
  src: "/videos/demo.mp4",
  autoplay: false,
  volume: 0.8,
  hotkeys: true,
});

// Control programmatically
await player.play();
player.seek(30);
player.setPlaybackRate(1.5);
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` or `K` | Toggle Play / Pause |
| `J` or `Left Arrow` | Seek backward 5 seconds |
| `L` or `Right Arrow` | Seek forward 5 seconds |
| `M` | Toggle Mute |
| `F` | Toggle Fullscreen |
| `Up Arrow` | Increase volume (+10%) |
| `Down Arrow` | Decrease volume (-10%) |

---

## 📄 License

MIT © [SopKit](https://sopkit.space/)
