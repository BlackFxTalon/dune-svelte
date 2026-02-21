import { derived, writable } from 'svelte/store';

import type { SortDirection } from '$lib/types/card';
import type { Player } from '$lib/types/player';

import playersData from '../../data/players.json';

export type RatingSortField = 'rating' | 'wins' | 'gamesPlayed' | 'winRate';
export type RatingMode = 'ladder' | 'tournament';

export interface RatingFilters {
	season: string | 'all';
	mode: RatingMode;
	sortField: RatingSortField;
	sortDirection: SortDirection;
}

export const defaultRatingFilters: RatingFilters = {
	season: 'all',
	mode: 'ladder',
	sortField: 'rating',
	sortDirection: 'desc'
};

function cloneDefaultFilters(): RatingFilters {
	return {
		season: 'all',
		mode: 'ladder',
		sortField: 'rating',
		sortDirection: 'desc'
	};
}

function byDirection(value: number, direction: SortDirection): number {
	return direction === 'asc' ? value : -value;
}

export function calculateWinRate(player: Player): number {
	return player.gamesPlayed === 0 ? 0 : player.wins / player.gamesPlayed;
}

function comparePlayers(left: Player, right: Player, field: RatingSortField): number {
	if (field === 'winRate') {
		return calculateWinRate(left) - calculateWinRate(right);
	}

	return left[field] - right[field];
}

function filterPlayersByMode(players: Player[], mode: RatingMode): Player[] {
	if (mode === 'ladder') {
		return players;
	}

	return players.filter((player) => player.rating >= 1600 || player.gamesPlayed >= 80);
}

export function applyRatingFilters(players: Player[], filters: RatingFilters): Player[] {
	const seasonPlayers =
		filters.season === 'all'
			? players
			: players.filter((player) => player.season === filters.season);
	const modePlayers = filterPlayersByMode(seasonPlayers, filters.mode);

	return [...modePlayers].sort((left, right) => {
		const diff = comparePlayers(left, right, filters.sortField);
		if (diff !== 0) {
			return byDirection(diff, filters.sortDirection);
		}

		return left.nickname.localeCompare(right.nickname);
	});
}

export function createRatingStore(initialPlayers: Player[] = playersData as Player[]) {
	const players = writable<Player[]>([...initialPlayers]);
	const filters = writable<RatingFilters>(cloneDefaultFilters());

	const availableSeasons = derived(players, ($players) => {
		const seasons = [...new Set($players.map((player) => player.season))].sort((left, right) =>
			right.localeCompare(left)
		);
		return ['all', ...seasons];
	});

	const leaderboard = derived([players, filters], ([$players, $filters]) =>
		applyRatingFilters($players, $filters)
	);

	const stats = derived([players, leaderboard], ([$players, $leaderboard]) => {
		const averageRating =
			$leaderboard.length === 0
				? 0
				: Math.round(
						$leaderboard.reduce((total, player) => total + player.rating, 0) / $leaderboard.length
					);

		return {
			totalPlayers: $players.length,
			visiblePlayers: $leaderboard.length,
			averageRating
		};
	});

	const state = derived(
		[players, filters, leaderboard, availableSeasons, stats],
		([$players, $filters, $leaderboard, $availableSeasons, $stats]) => ({
			players: $players,
			filters: $filters,
			leaderboard: $leaderboard,
			availableSeasons: $availableSeasons,
			stats: $stats
		})
	);

	return {
		subscribe: state.subscribe,
		players,
		filters,
		leaderboard,
		availableSeasons,
		stats,
		loadPlayers(source: Player[] = playersData as Player[]) {
			players.set([...source]);
		},
		setSeason(season: string | 'all') {
			filters.update((current) => ({ ...current, season }));
		},
		setMode(mode: RatingMode) {
			filters.update((current) => ({ ...current, mode }));
		},
		setSorting(sortField: RatingSortField, sortDirection: SortDirection) {
			filters.update((current) => ({ ...current, sortField, sortDirection }));
		},
		toggleSort(sortField: RatingSortField) {
			filters.update((current) => {
				if (current.sortField !== sortField) {
					return { ...current, sortField, sortDirection: 'desc' };
				}

				return {
					...current,
					sortDirection: current.sortDirection === 'desc' ? 'asc' : 'desc'
				};
			});
		},
		resetFilters() {
			filters.set(cloneDefaultFilters());
		}
	};
}

export const ratingStore = createRatingStore();
