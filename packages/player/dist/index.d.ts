/**
 * @file packages/player/src/player.ts
 * @description Zero-dependency, modern HTML5 video player engine with custom controls,
 * smooth scrub timeline, PiP, keyboard navigation, and theme customization.
 */
type PlayerEventType = "play" | "pause" | "timeupdate" | "volumechange" | "ratechange" | "ended" | "seeking" | "seeked" | "fullscreenchange" | "pipchange" | "destroy";
type PlayerEventHandler = (state: PlayerState) => void;
interface PlayerState {
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
interface SopKitPlayerOptions {
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
declare class SopKitPlayer {
    readonly video: HTMLVideoElement;
    readonly container: HTMLElement;
    readonly options: Required<SopKitPlayerOptions>;
    private listeners;
    private controlsEl;
    private isDestroyed;
    constructor(options: SopKitPlayerOptions);
    private initContainer;
    private initVideoElement;
    private initControls;
    private initHotkeys;
    play(): Promise<void>;
    pause(): void;
    togglePlay(): void;
    seek(seconds: number): void;
    setVolume(volume: number): void;
    toggleMute(): void;
    setPlaybackRate(rate: number): void;
    togglePip(): Promise<void>;
    toggleFullscreen(): Promise<void>;
    getState(): PlayerState;
    on(event: PlayerEventType, handler: PlayerEventHandler): () => void;
    off(event: PlayerEventType, handler: PlayerEventHandler): void;
    private emit;
    destroy(): void;
}
/**
 * Factory helper to instantiate a SopKitPlayer.
 */
declare function createPlayer(options: SopKitPlayerOptions): SopKitPlayer;

/**
 * @file packages/player/src/utils.ts
 * @description Utility functions for time formatting, math, and DOM checks.
 */
/**
 * Formats time in seconds to human-readable format (MM:SS or HH:MM:SS).
 */
declare function formatTime(seconds: number): string;
/**
 * Clamps a number between min and max bounds.
 */
declare function clamp(val: number, min?: number, max?: number): number;
/**
 * Checks if Picture-in-Picture is supported in the current environment.
 */
declare function isPipSupported(): boolean;
/**
 * Checks if Fullscreen API is supported in the current environment.
 */
declare function isFullscreenSupported(): boolean;

export { type PlayerEventHandler, type PlayerEventType, type PlayerState, SopKitPlayer, type SopKitPlayerOptions, clamp, createPlayer, formatTime, isFullscreenSupported, isPipSupported };
