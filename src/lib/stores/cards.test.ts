import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import type { Card, CardFilters } from '$lib/types/card';

import {
	applyCardFilters,
	cardFiltersToSearchParams,
	createCardsStore,
	defaultCardFilters,
	searchParamsToCardFilters
} from './cards';

const sampleCards: Card[] = [
	{
		id: 1,
		slug: 'imperial-spy',
		name: 'Imperial Spy',
		nameEn: 'Imperial Spy',
		cost: 3,
		setId: 'rise_of_ix',
		faction: 'emperor',
		cell: 'spy',
		properties: ['purchase_bonus'],
		imageUrl: 'https://placehold.co/432x600?text=Imperial+Spy',
		isOfficial: true,
		text: 'Discounts the next purchase.'
	},
	{
		id: 2,
		slug: 'guild-embassy',
		name: 'Guild Embassy',
		nameEn: 'Guild Embassy',
		cost: 5,
		setId: 'immortality',
		faction: 'spacing_guild',
		cell: 'city',
		properties: ['teamwork', 'choam'],
		imageUrl: 'https://placehold.co/432x600?text=Guild+Embassy',
		isOfficial: true,
		text: 'Hybrid economy and support.'
	},
	{
		id: 3,
		slug: 'sietch-mentor',
		name: 'Sietch Mentor',
		nameEn: 'Sietch Mentor',
		cost: 2,
		setId: 'fan_sietch',
		faction: 'fremen',
		cell: 'desert',
		properties: ['purchase_bonus'],
		imageUrl: 'https://placehold.co/432x600?text=Sietch+Mentor',
		isOfficial: false,
		text: 'Fast desert starts.'
	}
];

describe('cardsStore pipeline', () => {
	it('applies filter -> search -> sort pipeline', () => {
		const filters: CardFilters = {
			selectedSets: ['immortality', 'fan_sietch'],
			selectedFactions: ['spacing_guild'],
			selectedCells: ['city'],
			selectedProperties: ['teamwork'],
			searchQuery: 'guild',
			sortField: 'cost',
			sortDirection: 'desc'
		};

		const result = applyCardFilters(sampleCards, filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe('guild-embassy');
	});

	it('serializes and parses filter state with query params', () => {
		const filters: CardFilters = {
			selectedSets: ['rise_of_ix', 'fan_sietch'],
			selectedFactions: ['emperor'],
			selectedCells: ['spy'],
			selectedProperties: ['purchase_bonus'],
			sortField: 'cost',
			sortDirection: 'desc',
			searchQuery: 'spy'
		};

		const params = cardFiltersToSearchParams(filters);
		const parsed = searchParamsToCardFilters(params);

		expect(parsed.selectedSets).toEqual(filters.selectedSets);
		expect(parsed.selectedFactions).toEqual(filters.selectedFactions);
		expect(parsed.selectedCells).toEqual(filters.selectedCells);
		expect(parsed.selectedProperties).toEqual(filters.selectedProperties);
		expect(parsed.sortField).toBe('cost');
		expect(parsed.sortDirection).toBe('desc');
		expect(parsed.searchQuery).toBe('spy');
	});

	it('resets filters to defaults', () => {
		const store = createCardsStore(sampleCards);

		store.toggleSet('fan_sietch');
		store.toggleFaction('fremen');
		store.setSearchQuery('mentor');
		store.setSorting('cost', 'desc');

		store.resetFilters();

		expect(get(store.filters)).toEqual(defaultCardFilters);
		expect(get(store.filteredCards)).toHaveLength(sampleCards.length);
	});
});
