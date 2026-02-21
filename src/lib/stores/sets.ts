import { derived, writable } from 'svelte/store';

import type { Card } from '$lib/types/card';
import type { GameSet, SetId } from '$lib/types/set';

import cardsData from '../../data/cards.json';
import setsData from '../../data/sets.json';

export function createSetsStore(initialSets: GameSet[] = setsData as GameSet[]) {
	const sets = writable<GameSet[]>([...initialSets]);
	const activeSetId = writable<SetId | 'all'>('all');

	const cardCountBySet = derived(sets, ($sets) => {
		return $sets.reduce<Record<SetId, number>>((acc, current) => {
			const total = (cardsData as Card[]).filter((card) => card.setId === current.id).length;
			acc[current.id] = total;
			return acc;
		}, {} as Record<SetId, number>);
	});

	const activeSet = derived([sets, activeSetId], ([$sets, $activeSetId]) => {
		return $activeSetId === 'all' ? null : $sets.find((set) => set.id === $activeSetId) ?? null;
	});

	const state = derived([sets, activeSetId, activeSet, cardCountBySet], ([$sets, $activeSetId, $activeSet, $cardCountBySet]) => ({
		sets: $sets,
		activeSetId: $activeSetId,
		activeSet: $activeSet,
		cardCountBySet: $cardCountBySet
	}));

	return {
		subscribe: state.subscribe,
		sets,
		activeSetId,
		activeSet,
		cardCountBySet,
		loadSets(source: GameSet[] = setsData as GameSet[]) {
			sets.set([...source]);
		},
		setActiveSet(setId: SetId | 'all') {
			activeSetId.set(setId);
		}
	};
}

export const setsStore = createSetsStore();
