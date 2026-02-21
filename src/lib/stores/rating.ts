import { derived, writable } from 'svelte/store';

import type { SortDirection } from '$lib/types/card';
import type { Player } from '$lib/types/player';

import playersData from '../../data/players.json';

type RatingSortField = 'rating' | 'wins' | 'gamesPlayed';

interface RatingFilters {
	season: string | 'all';
	sortField: RatingSortField;
	sortDirection: SortDirection;
}

const defaultFilters: RatingFilters = {
	season: 'all',
	sortField: 'rating',
	sortDirection: 'desc'
};

function orderByField(players: Player[], field: RatingSortField, direction: SortDirection): Player[] {
	const modifier = direction === 'asc' ? 1 : -1;
	return [...players].sort((left, right) => (left[field] - right[field]) * modifier);
}

export function createRatingStore(initialPlayers: Player[] = playersData as Player[]) {
	const players = writable<Player[]>([...initialPlayers]);
	const filters = writable<RatingFilters>({ ...defaultFilters });

	const leaderboard = derived([players, filters], ([$players, $filters]) => {
		const seasonPlayers =
			$filters.season === 'all'
				? $players
				: $players.filter((player) => player.season === $filters.season);

		return orderByField(seasonPlayers, $filters.sortField, $filters.sortDirection);
	});

	const state = derived([players, filters, leaderboard], ([$players, $filters, $leaderboard]) => ({
		players: $players,
		filters: $filters,
		leaderboard: $leaderboard
	}));

	return {
		subscribe: state.subscribe,
		players,
		filters,
		leaderboard,
		loadPlayers(source: Player[] = playersData as Player[]) {
			players.set([...source]);
		},
		setSeason(season: string | 'all') {
			filters.update((current) => ({ ...current, season }));
		},
		setSorting(sortField: RatingSortField, sortDirection: SortDirection) {
			filters.update((current) => ({ ...current, sortField, sortDirection }));
		},
		resetFilters() {
			filters.set({ ...defaultFilters });
		}
	};
}

export const ratingStore = createRatingStore();
