import { derived, writable } from 'svelte/store';

import type { FactionId } from '$lib/types/faction';
import type { Leader } from '$lib/types/leader';
import type { SetId } from '$lib/types/set';

import leadersData from '../../data/leaders.json';

export type LeadersGroupBy = 'none' | 'faction';

export interface LeadersFilters {
	searchQuery: string;
	faction: FactionId | 'all';
	setId: SetId | 'all';
	groupBy: LeadersGroupBy;
}

export interface LeadersGroup {
	faction: FactionId;
	leaders: Leader[];
}

export const defaultLeadersFilters: LeadersFilters = {
	searchQuery: '',
	faction: 'all',
	setId: 'all',
	groupBy: 'none'
};

const factionOrder: FactionId[] = ['emperor', 'spacing_guild', 'bene_gesserit', 'fremen'];

function byName(left: Leader, right: Leader): number {
	return left.name.localeCompare(right.name);
}

function cloneDefaultFilters(): LeadersFilters {
	return {
		searchQuery: '',
		faction: 'all',
		setId: 'all',
		groupBy: 'none'
	};
}

export function applyLeadersFilters(leaders: Leader[], filters: LeadersFilters): Leader[] {
	let result = [...leaders];

	if (filters.faction !== 'all') {
		result = result.filter((leader) => leader.faction === filters.faction);
	}

	if (filters.setId !== 'all') {
		result = result.filter((leader) => leader.setId === filters.setId);
	}

	const query = filters.searchQuery.trim().toLowerCase();

	if (query.length > 0) {
		result = result.filter((leader) => {
			return (
				leader.name.toLowerCase().includes(query) ||
				leader.house.toLowerCase().includes(query) ||
				leader.ability.toLowerCase().includes(query)
			);
		});
	}

	return result.sort(byName);
}

export function groupLeadersByFaction(leaders: Leader[]): LeadersGroup[] {
	const groups = new Map<FactionId, Leader[]>(factionOrder.map((faction) => [faction, []]));

	for (const leader of leaders) {
		const leadersInFaction = groups.get(leader.faction);
		if (!leadersInFaction) {
			groups.set(leader.faction, [leader]);
			continue;
		}

		leadersInFaction.push(leader);
	}

	return factionOrder.map((faction) => ({
		faction,
		leaders: [...(groups.get(faction) ?? [])].sort(byName)
	}));
}

export function createLeadersStore(initialLeaders: Leader[] = leadersData as Leader[]) {
	const leaders = writable<Leader[]>([...initialLeaders]);
	const filters = writable<LeadersFilters>(cloneDefaultFilters());

	const filteredLeaders = derived([leaders, filters], ([$leaders, $filters]) =>
		applyLeadersFilters($leaders, $filters)
	);
	const groupedLeaders = derived(filteredLeaders, ($filteredLeaders) =>
		groupLeadersByFaction($filteredLeaders)
	);

	const state = derived(
		[leaders, filters, filteredLeaders, groupedLeaders],
		([$leaders, $filters, $filteredLeaders, $groupedLeaders]) => ({
			leaders: $leaders,
			filters: $filters,
			filteredLeaders: $filteredLeaders,
			groupedLeaders: $groupedLeaders
		})
	);

	return {
		subscribe: state.subscribe,
		leaders,
		filters,
		filteredLeaders,
		groupedLeaders,
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
		setGroupBy(groupBy: LeadersGroupBy) {
			filters.update((current) => ({ ...current, groupBy }));
		},
		resetFilters() {
			filters.set(cloneDefaultFilters());
		}
	};
}

export const leadersStore = createLeadersStore();
