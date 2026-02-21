import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import type { Player } from '$lib/types/player';

import {
	applyRatingFilters,
	calculateWinRate,
	createRatingStore,
	defaultRatingFilters,
	type RatingFilters
} from './rating';

const samplePlayers: Player[] = [
	{
		id: 1,
		nickname: 'ArrakisWolf',
		rating: 1880,
		gamesPlayed: 120,
		wins: 75,
		losses: 45,
		favoriteFaction: 'fremen',
		season: '2025-S2'
	},
	{
		id: 2,
		nickname: 'GuildDesk',
		rating: 1710,
		gamesPlayed: 84,
		wins: 48,
		losses: 36,
		favoriteFaction: 'spacing_guild',
		season: '2025-S2'
	},
	{
		id: 3,
		nickname: 'NeedleVoice',
		rating: 1580,
		gamesPlayed: 42,
		wins: 21,
		losses: 21,
		favoriteFaction: 'bene_gesserit',
		season: '2025-S1'
	}
];

describe('ratingStore pipeline', () => {
	it('applies season and mode filters with sorting', () => {
		const filters: RatingFilters = {
			season: '2025-S2',
			mode: 'tournament',
			sortField: 'rating',
			sortDirection: 'desc'
		};

		const result = applyRatingFilters(samplePlayers, filters);

		expect(result).toHaveLength(2);
		expect(result[0]?.nickname).toBe('ArrakisWolf');
		expect(result[1]?.nickname).toBe('GuildDesk');
	});

	it('supports winRate sorting', () => {
		const filters: RatingFilters = {
			season: 'all',
			mode: 'ladder',
			sortField: 'winRate',
			sortDirection: 'desc'
		};

		const result = applyRatingFilters(samplePlayers, filters);

		expect(result[0]?.nickname).toBe('ArrakisWolf');
		expect(calculateWinRate(result[0]!)).toBeGreaterThan(calculateWinRate(result[1]!));
	});

	it('resets filters to defaults', () => {
		const store = createRatingStore(samplePlayers);

		store.setSeason('2025-S2');
		store.setMode('tournament');
		store.setSorting('wins', 'asc');

		store.resetFilters();

		expect(get(store.filters)).toEqual(defaultRatingFilters);
		expect(get(store.leaderboard)).toHaveLength(samplePlayers.length);
	});
});
