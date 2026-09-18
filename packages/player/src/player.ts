/**
 * @file packages/player/src/player.ts
 * @description Zero-dependency, modern HTML5 video player engine with custom controls,
 * smooth scrub timeline, PiP, keyboard navigation, and theme customization.
 */

import { clamp, formatTime, isFullscreenSupported, isPipSupported } from "./utils.js";

export type PlayerEventType =
  | "play"
  | "pause"
  | "timeupdate"
  | "volumechange"
  | "ratechange"
  | "ended"
  | "seeking"
  | "seeked"
  | "fullscreenchange"
  | "pipchange"
  | "destroy";

export type PlayerEventHandler = (state: PlayerState) => void;

export interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPip: boolean;
  bufferedPercent: number;
}

export interface SopKitPlayerOptions {
  container: HTMLElement | string;
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  volume?: number;
  playbackRates?: number[];
  themeColor?: string;
  hotkeys?: boolean;
  controls?: boolean;
}

export class SopKitPlayer {
  public readonly video: HTMLVideoElement;
  public readonly container: HTMLElement;
  public readonly options: Required<SopKitPlayerOptions>;

  private listeners: Map<PlayerEventType, Set<PlayerEventHandler>> = new Map();
  private controlsEl: HTMLElement | null = null;
  private isDestroyed = false;

  constructor(options: SopKitPlayerOptions) {
    const targetContainer =
      typeof options.container === "string"
        ? document.querySelector<HTMLElement>(options.container)
        : options.container;

    if (!targetContainer) {
      throw new Error(`[SopKitPlayer] Invalid container element: ${options.container}`);
    }

    this.container = targetContainer;
    this.options = {
      container: targetContainer,
      src: options.src,
      poster: options.poster || "",
      autoplay: Boolean(options.autoplay),
      muted: Boolean(options.muted),
      loop: Boolean(options.loop),
      volume: options.volume !== undefined ? clamp(options.volume, 0, 1) : 1,
      playbackRates: options.playbackRates || [0.5, 0.75, 1, 1.25, 1.5, 2],
      themeColor: options.themeColor || "#06b6d4",
      hotkeys: options.hotkeys !== false,
      controls: options.controls !== false,
    };

    this.video = document.createElement("video");
    this.initVideoElement();
    this.initContainer();

    if (this.options.controls) {
      this.initControls();
    }

    if (this.options.hotkeys) {
      this.initHotkeys();
    }
  }

  private initContainer(): void {
    this.container.style.position = "relative";
    this.container.style.overflow = "hidden";
    this.container.style.backgroundColor = "#000";
    this.container.style.borderRadius = "12px";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.setAttribute("tabindex", "0");
    this.container.appendChild(this.video);
  }

  private initVideoElement(): void {
    this.video.src = this.options.src;
    if (this.options.poster) this.video.poster = this.options.poster;
    this.video.autoplay = this.options.autoplay;
    this.video.muted = this.options.muted;
    this.video.loop = this.options.loop;
    this.video.volume = this.options.volume;
    this.video.playsInline = true;

    this.video.style.width = "100%";
    this.video.style.height = "100%";
    this.video.style.display = "block";
    this.video.style.objectFit = "contain";

    const notify = (evt: PlayerEventType) => this.emit(evt);

    this.video.addEventListener("play", () => notify("play"));
    this.video.addEventListener("pause", () => notify("pause"));
    this.video.addEventListener("timeupdate", () => notify("timeupdate"));
    this.video.addEventListener("volumechange", () => notify("volumechange"));
    this.video.addEventListener("ratechange", () => notify("ratechange"));
    this.video.addEventListener("ended", () => notify("ended"));
    this.video.addEventListener("seeking", () => notify("seeking"));
    this.video.addEventListener("seeked", () => notify("seeked"));

    this.video.addEventListener("click", () => this.togglePlay());
  }

  private initControls(): void {
    const controls = document.createElement("div");
    controls.className = "sopkit-player-controls";
    controls.style.position = "absolute";
    controls.style.bottom = "0";
    controls.style.left = "0";
    controls.style.right = "0";
    controls.style.padding = "12px 16px";
    controls.style.background = "linear-gradient(to top, rgba(0,0,0,0.85), transparent)";
    controls.style.display = "flex";
    controls.style.flexDirection = "column";
    controls.style.gap = "8px";
    controls.style.transition = "opacity 0.25s ease";
    controls.style.zIndex = "10";

    // Timeline bar
    const timeline = document.createElement("div");
    timeline.className = "sopkit-player-timeline";
    timeline.style.position = "relative";
    timeline.style.height = "6px";
    timeline.style.backgroundColor = "rgba(255,255,255,0.2)";
    timeline.style.borderRadius = "3px";
    timeline.style.cursor = "pointer";

    const progress = document.createElement("div");
    progress.style.height = "100%";
    progress.style.width = "0%";
    progress.style.backgroundColor = this.options.themeColor;
    progress.style.borderRadius = "3px";
    timeline.appendChild(progress);

    timeline.addEventListener("click", (e) => {
      const rect = timeline.getBoundingClientRect();
      const pos = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      if (this.video.duration) {
        this.video.currentTime = pos * this.video.duration;
      }
    });

    // Control buttons bar
    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.alignItems = "center";
    bar.style.justifyContent = "space-between";

    const leftGroup = document.createElement("div");
    leftGroup.style.display = "flex";
    leftGroup.style.alignItems = "center";
    leftGroup.style.gap = "12px";

    const playBtn = document.createElement("button");
    playBtn.style.background = "none";
    playBtn.style.border = "none";
    playBtn.style.color = "#fff";
    playBtn.style.cursor = "pointer";
    playBtn.style.fontSize = "16px";
    playBtn.innerHTML = "▶";
    playBtn.addEventListener("click", () => this.togglePlay());

    const timeLabel = document.createElement("span");
    timeLabel.style.color = "rgba(255,255,255,0.8)";
    timeLabel.style.fontSize = "12px";
    timeLabel.style.fontFamily = "monospace";
    timeLabel.innerText = "00:00 / 00:00";

    leftGroup.appendChild(playBtn);
    leftGroup.appendChild(timeLabel);

    const rightGroup = document.createElement("div");
    rightGroup.style.display = "flex";
    rightGroup.style.alignItems = "center";
    rightGroup.style.gap = "12px";

    // Speed button
    const speedBtn = document.createElement("button");
    speedBtn.style.background = "none";
    speedBtn.style.border = "none";
    speedBtn.style.color = "#fff";
    speedBtn.style.cursor = "pointer";
    speedBtn.style.fontSize = "12px";
    speedBtn.innerText = "1x";
    speedBtn.addEventListener("click", () => {
      const rates = this.options.playbackRates;
      const currentIdx = rates.indexOf(this.video.playbackRate);
      const nextIdx = (currentIdx + 1) % rates.length;
      this.setPlaybackRate(rates[nextIdx]);
      speedBtn.innerText = `${rates[nextIdx]}x`;
    });

    // Pip button
    if (isPipSupported()) {
      const pipBtn = document.createElement("button");
      pipBtn.style.background = "none";
      pipBtn.style.border = "none";
      pipBtn.style.color = "#fff";
      pipBtn.style.cursor = "pointer";
      pipBtn.style.fontSize = "14px";
      pipBtn.title = "Picture-in-Picture";
      pipBtn.innerText = "⧉";
      pipBtn.addEventListener("click", () => this.togglePip());
      rightGroup.appendChild(pipBtn);
    }

    // Fullscreen button
    if (isFullscreenSupported()) {
      const fsBtn = document.createElement("button");
      fsBtn.style.background = "none";
      fsBtn.style.border = "none";
      fsBtn.style.color = "#fff";
      fsBtn.style.cursor = "pointer";
      fsBtn.style.fontSize = "14px";
      fsBtn.title = "Fullscreen";
      fsBtn.innerText = "⛶";
      fsBtn.addEventListener("click", () => this.toggleFullscreen());
      rightGroup.appendChild(fsBtn);
    }

    rightGroup.appendChild(speedBtn);

    bar.appendChild(leftGroup);
    bar.appendChild(rightGroup);

    controls.appendChild(timeline);
    controls.appendChild(bar);
    this.container.appendChild(controls);
    this.controlsEl = controls;

    // Update controls on timeupdate and play/pause
    this.on("timeupdate", () => {
      if (this.video.duration) {
        const pct = (this.video.currentTime / this.video.duration) * 100;
        progress.style.width = `${pct}%`;
        timeLabel.innerText = `${formatTime(this.video.currentTime)} / ${formatTime(this.video.duration)}`;
      }
    });

    this.on("play", () => {
      playBtn.innerHTML = "⏸";
    });

    this.on("pause", () => {
      playBtn.innerHTML = "▶";
    });
  }

  private initHotkeys(): void {
    const handleKey = (e: KeyboardEvent) => {
      if (this.isDestroyed) return;
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA")
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          this.togglePlay();
          break;
        case "arrowleft":
        case "j":
          e.preventDefault();
          this.seek(this.video.currentTime - 5);
          break;
        case "arrowright":
        case "l":
          e.preventDefault();
          this.seek(this.video.currentTime + 5);
          break;
        case "m":
          e.preventDefault();
          this.toggleMute();
          break;
        case "f":
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case "arrowup":
          e.preventDefault();
          this.setVolume(this.video.volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          this.setVolume(this.video.volume - 0.1);
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    this.on("destroy", () => window.removeEventListener("keydown", handleKey));
  }

  public async play(): Promise<void> {
    return this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public togglePlay(): void {
    if (this.video.paused) {
      this.play().catch(() => {});
    } else {
      this.pause();
    }
  }

  public seek(seconds: number): void {
    if (isNaN(seconds)) return;
    const max = this.video.duration || 0;
    this.video.currentTime = clamp(seconds, 0, max);
  }

  public setVolume(volume: number): void {
    const v = clamp(volume, 0, 1);
    this.video.volume = v;
    if (v > 0 && this.video.muted) {
      this.video.muted = false;
    }
  }

  public toggleMute(): void {
    this.video.muted = !this.video.muted;
  }

  public setPlaybackRate(rate: number): void {
    if (rate > 0) {
      this.video.playbackRate = rate;
    }
  }

  public async togglePip(): Promise<void> {
    if (!isPipSupported()) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await this.video.requestPictureInPicture();
    }
  }

  public async toggleFullscreen(): Promise<void> {
    if (!isFullscreenSupported()) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await this.container.requestFullscreen();
    }
  }

  public getState(): PlayerState {
    let bufferedPercent = 0;
    if (this.video.buffered.length > 0 && this.video.duration) {
      bufferedPercent =
        (this.video.buffered.end(this.video.buffered.length - 1) /
          this.video.duration) *
        100;
    }

    return {
      playing: !this.video.paused,
      currentTime: this.video.currentTime,
      duration: this.video.duration || 0,
      volume: this.video.volume,
      muted: this.video.muted,
      playbackRate: this.video.playbackRate,
      isFullscreen: Boolean(
        typeof document !== "undefined" && document.fullscreenElement === this.container
      ),
      isPip: Boolean(
        typeof document !== "undefined" && document.pictureInPictureElement === this.video
      ),
      bufferedPercent,
    };
  }

  public on(event: PlayerEventType, handler: PlayerEventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: PlayerEventType, handler: PlayerEventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  private emit(event: PlayerEventType): void {
    const handlers = this.listeners.get(event);
    if (!handlers || handlers.size === 0) return;
    const state = this.getState();
    handlers.forEach((fn) => fn(state));
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.emit("destroy");
    this.listeners.clear();
    this.video.pause();
    this.video.src = "";
    this.video.remove();
    if (this.controlsEl) {
      this.controlsEl.remove();
    }
  }
}

/**
 * Factory helper to instantiate a SopKitPlayer.
 */
export function createPlayer(options: SopKitPlayerOptions): SopKitPlayer {
  return new SopKitPlayer(options);
}
