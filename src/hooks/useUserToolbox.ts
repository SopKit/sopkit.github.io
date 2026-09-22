"use client";

/**
 * @file src/hooks/useUserToolbox.ts
 * @description React hook for user favorites, recents, and search history with cross-tab reactivity.
 */

import { useState, useEffect, useCallback } from "react";
import {
	getFavorites,
	getRecents,
	getSearchHistory,
	toggleFavorite as toggleFavStorage,
	isFavorite as isFavStorage,
	recordRecent as recordRecentStorage,
	removeRecent as removeRecentStorage,
	clearRecents as clearRecentsStorage,
	clearFavorites as clearFavoritesStorage,
	recordSearchQuery as recordSearchQueryStorage,
	clearSearchHistory as clearSearchHistoryStorage,
	TOOLBOX_CHANGE_EVENT,
	type RecentToolItem,
} from "@/lib/storage/user-toolbox";

export function useUserToolbox() {
	const [favorites, setFavorites] = useState<string[]>([]);
	const [recents, setRecents] = useState<RecentToolItem[]>([]);
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const [isHydrated, setIsHydrated] = useState(false);

	const syncFromStorage = useCallback(() => {
		setFavorites(getFavorites());
		setRecents(getRecents());
		setSearchHistory(getSearchHistory());
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		syncFromStorage();

		const handleStorageChange = () => {
			syncFromStorage();
		};

		window.addEventListener(TOOLBOX_CHANGE_EVENT, handleStorageChange);
		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener(TOOLBOX_CHANGE_EVENT, handleStorageChange);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [syncFromStorage]);

	const toggleFavorite = useCallback((toolId: string) => {
		const added = toggleFavStorage(toolId);
		setFavorites(getFavorites());
		return added;
	}, []);

	const isFavorite = useCallback(
		(toolId: string) => {
			return favorites.includes(toolId) || isFavStorage(toolId);
		},
		[favorites],
	);

	const recordRecent = useCallback(
		(tool: { id: string; name: string; route: string; category?: string }) => {
			recordRecentStorage(tool);
			setRecents(getRecents());
		},
		[],
	);

	const removeRecent = useCallback((toolId: string) => {
		removeRecentStorage(toolId);
		setRecents(getRecents());
	}, []);

	const clearRecents = useCallback(() => {
		clearRecentsStorage();
		setRecents([]);
	}, []);

	const clearFavorites = useCallback(() => {
		clearFavoritesStorage();
		setFavorites([]);
	}, []);

	const recordSearch = useCallback((query: string) => {
		recordSearchQueryStorage(query);
		setSearchHistory(getSearchHistory());
	}, []);

	const clearSearch = useCallback(() => {
		clearSearchHistoryStorage();
		setSearchHistory([]);
	}, []);

	return {
		favorites,
		recents,
		searchHistory,
		isHydrated,
		toggleFavorite,
		isFavorite,
		recordRecent,
		removeRecent,
		clearRecents,
		clearFavorites,
		recordSearch,
		clearSearch,
	};
}
