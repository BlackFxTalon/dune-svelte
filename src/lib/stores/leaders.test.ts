import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import type { Leader } from '$lib/types/leader';

import {
	applyLeadersFilters,
	createLeadersStore,
	defaultLeadersFilters,
	groupLeadersByFaction,
	type LeadersFilters
} from './leaders';

const sampleLeaders: Leader[] = [
	{
		id: 1,
		slug: 'baron-harkonnen',
		name: 'Baron Harkonnen',
		house: 'House Harkonnen',
		faction: 'emperor',
		ability: 'Intrigue pressure and conflict spikes.',
		complexity: 'high',
		setId: 'imperium',
		imageUrl: 'https://placehold.co/480x640?text=Baron'
	},
	{
		id: 2,
		slug: 'stilgar',
		name: 'Stilgar',
		house: 'Fremen',
		faction: 'fremen',
		ability: 'Desert tempo with combat efficiency.',
		complexity: 'medium',
		setId: 'bloodlines',
		imageUrl: 'https://placehold.co/480x640?text=Stilgar'
	},
	{
		id: 3,
		slug: 'mohiam',
		name: 'Reverend Mother Mohiam',
		house: 'Bene Gesserit',
		faction: 'bene_gesserit',
		ability: 'Punishes inefficient deck building.',
		complexity: 'high',
		setId: 'uprising',
		imageUrl: 'https://placehold.co/480x640?text=Mohiam'
	},
	{
		id: 4,
		slug: 'thufir-hawat',
		name: 'Thufir Hawat',
		house: 'Atreides',
		faction: 'spacing_guild',
		ability: 'Efficient intel conversion into economy.',
		complexity: 'medium',
		setId: 'uprising',
		imageUrl: 'https://placehold.co/480x640?text=Thufir'
	}
];

describe('leadersStore pipeline', () => {
	it('applies search, faction and set filters together', () => {
		const filters: LeadersFilters = {
			searchQuery: 'conflict',
			faction: 'emperor',
			setId: 'imperium',
			groupBy: 'none'
		};

		const result = applyLeadersFilters(sampleLeaders, filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe('baron-harkonnen');
	});

	it('groups leaders by faction in predefined faction order', () => {
		const grouped = groupLeadersByFaction(sampleLeaders);

		expect(grouped.map((group) => group.faction)).toEqual([
			'emperor',
			'spacing_guild',
			'bene_gesserit',
			'fremen'
		]);
		expect(grouped.find((group) => group.faction === 'emperor')?.leaders).toHaveLength(1);
		expect(grouped.find((group) => group.faction === 'fremen')?.leaders[0]?.slug).toBe('stilgar');
	});

	it('resets filters to defaults', () => {
		const store = createLeadersStore(sampleLeaders);

		store.setSearchQuery('tempo');
		store.setFaction('fremen');
		store.setSet('bloodlines');
		store.setGroupBy('faction');

		expect(get(store.filteredLeaders)).toHaveLength(1);
		expect(
			get(store.groupedLeaders).find((group) => group.faction === 'fremen')?.leaders.length
		).toBe(1);

		store.resetFilters();

		expect(get(store.filters)).toEqual(defaultLeadersFilters);
		expect(get(store.filteredLeaders)).toHaveLength(sampleLeaders.length);
	});
});
