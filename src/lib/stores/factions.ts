import { derived, writable } from 'svelte/store';

import type { Card } from '$lib/types/card';
import type { Faction, FactionId } from '$lib/types/faction';

import cardsData from '../../data/cards.json';
import factionsData from '../../data/factions.json';

export function createFactionsStore(initialFactions: Faction[] = factionsData as Faction[]) {
	const factions = writable<Faction[]>([...initialFactions]);
	const selectedFaction = writable<FactionId | 'all'>('all');

	const cardsByFaction = derived(factions, ($factions) => {
		return $factions.reduce<Record<FactionId, number>>((acc, faction) => {
			const total = (cardsData as Card[]).filter((card) => card.faction === faction.id).length;
			acc[faction.id] = total;
			return acc;
		}, {} as Record<FactionId, number>);
	});

	const activeFaction = derived([factions, selectedFaction], ([$factions, $selectedFaction]) => {
		return $selectedFaction === 'all'
			? null
			: $factions.find((faction) => faction.id === $selectedFaction) ?? null;
	});

	const state = derived([factions, selectedFaction, activeFaction, cardsByFaction], ([$factions, $selectedFaction, $activeFaction, $cardsByFaction]) => ({
		factions: $factions,
		selectedFaction: $selectedFaction,
		activeFaction: $activeFaction,
		cardsByFaction: $cardsByFaction
	}));

	return {
		subscribe: state.subscribe,
		factions,
		selectedFaction,
		activeFaction,
		cardsByFaction,
		loadFactions(source: Faction[] = factionsData as Faction[]) {
			factions.set([...source]);
		},
		setSelectedFaction(factionId: FactionId | 'all') {
			selectedFaction.set(factionId);
		}
	};
}

export const factionsStore = createFactionsStore();
