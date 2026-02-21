import { derived, writable } from 'svelte/store';

import type { FactionId } from '$lib/types/faction';
import type { Leader } from '$lib/types/leader';
import type { SetId } from '$lib/types/set';

import leadersData from '../../data/leaders.json';

interface LeadersFilters {
	searchQuery: string;
	faction: FactionId | 'all';
	setId: SetId | 'all';
}

const defaultFilters: LeadersFilters = {
	searchQuery: '',
	faction: 'all',
	setId: 'all'
};

export function createLeadersStore(initialLeaders: Leader[] = leadersData as Leader[]) {
	const leaders = writable<Leader[]>([...initialLeaders]);
	const filters = writable<LeadersFilters>({ ...defaultFilters });

	const filteredLeaders = derived([leaders, filters], ([$leaders, $filters]) => {
		let result = [...$leaders];
		const query = $filters.searchQuery.trim().toLowerCase();

		if ($filters.faction !== 'all') {
			result = result.filter((leader) => leader.faction === $filters.faction);
		}

		if ($filters.setId !== 'all') {
			result = result.filter((leader) => leader.setId === $filters.setId);
		}

		if (query.length > 0) {
			result = result.filter((leader) => {
				return (
					leader.name.toLowerCase().includes(query) || leader.house.toLowerCase().includes(query)
				);
			});
		}

		return result;
	});

	const state = derived([leaders, filters, filteredLeaders], ([$leaders, $filters, $filteredLeaders]) => ({
		leaders: $leaders,
		filters: $filters,
		filteredLeaders: $filteredLeaders
	}));

	return {
		subscribe: state.subscribe,
		leaders,
		filters,
		filteredLeaders,
		loadLeaders(source: Leader[] = leadersData as Leader[]) {
			leaders.set([...source]);
		},
		setSearchQuery(searchQuery: string) {
			filters.update((current) => ({ ...current, searchQuery }));
		},
		setFaction(faction: FactionId | 'all') {
			filters.update((current) => ({ ...current, faction }));
		},
		setSet(setId: SetId | 'all') {
			filters.update((current) => ({ ...current, setId }));
		},
		resetFilters() {
			filters.set({ ...defaultFilters });
		}
	};
}

export const leadersStore = createLeadersStore();
