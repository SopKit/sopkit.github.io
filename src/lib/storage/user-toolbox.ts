/**
 * @file src/lib/storage/user-toolbox.ts
 * @description Privacy-first local storage for user favorites, recents, and search history.
 * 100% client-side, zero tracking, cross-tab reactive synchronization.
 */

export interface RecentToolItem {
	id: string;
	name: string;
	route: string;
	category?: string;
	usedAt: number;
}

const STORAGE_KEYS = {
	FAVORITES: "sopkit:favorites:v1",
	RECENTS: "sopkit:recents:v1",
	SEARCH_HISTORY: "sopkit:search_history:v1",
} as const;

const MAX_RECENTS = 12;
const MAX_SEARCH_HISTORY = 8;
export const TOOLBOX_CHANGE_EVENT = "sopkit:toolbox:change";

function isBrowser(): boolean {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyToolboxChange() {
	if (!isBrowser()) return;
	window.dispatchEvent(new CustomEvent(TOOLBOX_CHANGE_EVENT));
}

// -----------------------------------------------------------------------------
// Favorites
// -----------------------------------------------------------------------------

export function getFavorites(): string[] {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function isFavorite(toolId: string): boolean {
	if (!toolId) return false;
	const favs = getFavorites();
	return favs.includes(toolId);
}

export function toggleFavorite(toolId: string): boolean {
	if (!isBrowser() || !toolId) return false;
	const favs = getFavorites();
	let newFavs: string[];
	let added = false;

	if (favs.includes(toolId)) {
		newFavs = favs.filter((id) => id !== toolId);
		added = false;
	} else {
		newFavs = [toolId, ...favs.filter((id) => id !== toolId)];
		added = true;
	}

	try {
		localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavs));
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to persist favorites to localStorage:", e);
	}

	return added;
}

export function clearFavorites(): void {
	if (!isBrowser()) return;
	try {
		localStorage.removeItem(STORAGE_KEYS.FAVORITES);
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to clear favorites:", e);
	}
}

// -----------------------------------------------------------------------------
// Recents
// -----------------------------------------------------------------------------

export function getRecents(): RecentToolItem[] {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.RECENTS);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function recordRecent(tool: {
	id: string;
	name: string;
	route: string;
	category?: string;
}): void {
	if (!isBrowser() || !tool?.id) return;
	try {
		const recents = getRecents().filter((r) => r.id !== tool.id);
		const newItem: RecentToolItem = {
			id: tool.id,
			name: tool.name,
			route: tool.route,
			category: tool.category,
			usedAt: Date.now(),
		};
		const updated = [newItem, ...recents].slice(0, MAX_RECENTS);
		localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to record recent tool:", e);
	}
}

export function removeRecent(toolId: string): void {
	if (!isBrowser() || !toolId) return;
	try {
		const recents = getRecents().filter((r) => r.id !== toolId);
		localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(recents));
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to remove recent tool:", e);
	}
}

export function clearRecents(): void {
	if (!isBrowser()) return;
	try {
		localStorage.removeItem(STORAGE_KEYS.RECENTS);
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to clear recents:", e);
	}
}

// -----------------------------------------------------------------------------
// Search History
// -----------------------------------------------------------------------------

export function getSearchHistory(): string[] {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function recordSearchQuery(query: string): void {
	if (!isBrowser()) return;
	const clean = query.trim();
	if (!clean || clean.length < 2) return;

	try {
		const history = getSearchHistory().filter((q) => q.toLowerCase() !== clean.toLowerCase());
		const updated = [clean, ...history].slice(0, MAX_SEARCH_HISTORY);
		localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to record search query:", e);
	}
}

export function clearSearchHistory(): void {
	if (!isBrowser()) return;
	try {
		localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
		notifyToolboxChange();
	} catch (e) {
		console.warn("Failed to clear search history:", e);
	}
}
