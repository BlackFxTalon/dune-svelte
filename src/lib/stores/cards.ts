import { derived, get, writable } from 'svelte/store';

import type {
	Card,
	CardCell,
	CardFilters,
	CardProperty,
	CardSortField,
	SortDirection
} from '$lib/types/card';
import type { FactionId } from '$lib/types/faction';
import type { SetId } from '$lib/types/set';

import cardsData from '../../data/cards.json';

export const defaultCardFilters: CardFilters = {
	selectedSets: [],
	selectedFactions: [],
	selectedCells: [],
	selectedProperties: [],
	sortField: 'name',
	sortDirection: 'asc',
	searchQuery: ''
};

const sortFieldValues: CardSortField[] = ['name', 'cost'];
const sortDirectionValues: SortDirection[] = ['asc', 'desc'];

const setValues = new Set<SetId>((cardsData as Card[]).map((card) => card.setId));
const factionValues = new Set<FactionId>(
	(cardsData as Card[])
		.map((card) => card.faction)
		.filter((faction): faction is FactionId => faction !== null)
);
const cellValues = new Set<CardCell>((cardsData as Card[]).map((card) => card.cell));
const propertyValues = new Set<CardProperty>((cardsData as Card[]).flatMap((card) => card.properties));

function byDirection(value: number, direction: SortDirection): number {
	return direction === 'asc' ? value : -value;
}

function includesAllProperties(cardProperties: CardProperty[], selectedProperties: CardProperty[]): boolean {
	return selectedProperties.every((property) => cardProperties.includes(property));
}

export function applyCardFilters(cards: Card[], filters: CardFilters): Card[] {
	let result = [...cards];

	if (filters.selectedSets.length > 0) {
		result = result.filter((card) => filters.selectedSets.includes(card.setId));
	}

	if (filters.selectedFactions.length > 0) {
		result = result.filter((card) => card.faction !== null && filters.selectedFactions.includes(card.faction));
	}

	if (filters.selectedCells.length > 0) {
		result = result.filter((card) => filters.selectedCells.includes(card.cell));
	}

	if (filters.selectedProperties.length > 0) {
		result = result.filter((card) => includesAllProperties(card.properties, filters.selectedProperties));
	}

	const query = filters.searchQuery.trim().toLowerCase();

	if (query.length > 0) {
		result = result.filter((card) => {
			return card.name.toLowerCase().includes(query) || card.nameEn.toLowerCase().includes(query);
		});
	}

	return result.sort((left, right) => {
		if (filters.sortField === 'cost') {
			return byDirection(left.cost - right.cost, filters.sortDirection);
		}

		return byDirection(left.name.localeCompare(right.name), filters.sortDirection);
	});
}

function parseList<T extends string>(value: string | null, allowed: Set<T>): T[] {
	if (!value) {
		return [];
	}

	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item): item is T => allowed.has(item as T));
}

function cloneDefaultFilters(): CardFilters {
	return {
		selectedSets: [],
		selectedFactions: [],
		selectedCells: [],
		selectedProperties: [],
		sortField: 'name',
		sortDirection: 'asc',
		searchQuery: ''
	};
}

export function searchParamsToCardFilters(searchParams: URLSearchParams): Partial<CardFilters> {
	const sortField = searchParams.get('sortField');
	const sortDirection = searchParams.get('sortDirection');
	const searchQuery = searchParams.get('q')?.trim() ?? '';

	return {
		selectedSets: parseList(searchParams.get('sets'), setValues),
		selectedFactions: parseList(searchParams.get('factions'), factionValues),
		selectedCells: parseList(searchParams.get('cells'), cellValues),
		selectedProperties: parseList(searchParams.get('props'), propertyValues),
		sortField: sortFieldValues.includes(sortField as CardSortField)
			? (sortField as CardSortField)
			: undefined,
		sortDirection: sortDirectionValues.includes(sortDirection as SortDirection)
			? (sortDirection as SortDirection)
			: undefined,
		searchQuery
	};
}

function setParamIfNotEmpty(params: URLSearchParams, key: string, values: string[]) {
	if (values.length > 0) {
		params.set(key, values.join(','));
	}
}

export function cardFiltersToSearchParams(filters: CardFilters): URLSearchParams {
	const params = new URLSearchParams();

	setParamIfNotEmpty(params, 'sets', filters.selectedSets);
	setParamIfNotEmpty(params, 'factions', filters.selectedFactions);
	setParamIfNotEmpty(params, 'cells', filters.selectedCells);
	setParamIfNotEmpty(params, 'props', filters.selectedProperties);

	if (filters.sortField !== defaultCardFilters.sortField) {
		params.set('sortField', filters.sortField);
	}

	if (filters.sortDirection !== defaultCardFilters.sortDirection) {
		params.set('sortDirection', filters.sortDirection);
	}

	if (filters.searchQuery.trim().length > 0) {
		params.set('q', filters.searchQuery.trim());
	}

	return params;
}

function toggleInArray<T extends string>(items: T[], value: T): T[] {
	return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function createCardsStore(initialCards: Card[] = cardsData as Card[]) {
	const cards = writable<Card[]>([...initialCards]);
	const filters = writable<CardFilters>(cloneDefaultFilters());

	const filteredCards = derived([cards, filters], ([$cards, $filters]) => applyCardFilters($cards, $filters));
	const stats = derived([cards, filteredCards], ([$cards, $filteredCards]) => ({
		total: $cards.length,
		filtered: $filteredCards.length
	}));
	const state = derived([cards, filters, filteredCards, stats], ([$cards, $filters, $filteredCards, $stats]) => ({
		cards: $cards,
		filters: $filters,
		filteredCards: $filteredCards,
		stats: $stats
	}));

	function setFilters(patch: Partial<CardFilters>) {
		filters.update((current) => ({
			...current,
			...patch,
			selectedSets: patch.selectedSets ?? current.selectedSets,
			selectedFactions: patch.selectedFactions ?? current.selectedFactions,
			selectedCells: patch.selectedCells ?? current.selectedCells,
			selectedProperties: patch.selectedProperties ?? current.selectedProperties
		}));
	}

	return {
		subscribe: state.subscribe,
		cards,
		filters,
		filteredCards,
		stats,
		loadCards(source: Card[] = cardsData as Card[]) {
			cards.set([...source]);
		},
		setFilter<Key extends keyof CardFilters>(key: Key, value: CardFilters[Key]) {
			filters.update((current) => ({ ...current, [key]: value }));
		},
		setSearchQuery(query: string) {
			filters.update((current) => ({ ...current, searchQuery: query }));
		},
		setSorting(sortField: CardSortField, sortDirection: SortDirection) {
			filters.update((current) => ({ ...current, sortField, sortDirection }));
		},
		toggleSet(setId: SetId) {
			filters.update((current) => ({
				...current,
				selectedSets: toggleInArray(current.selectedSets, setId)
			}));
		},
		toggleFaction(factionId: FactionId) {
			filters.update((current) => ({
				...current,
				selectedFactions: toggleInArray(current.selectedFactions, factionId)
			}));
		},
		toggleCell(cell: CardCell) {
			filters.update((current) => ({
				...current,
				selectedCells: toggleInArray(current.selectedCells, cell)
			}));
		},
		toggleProperty(property: CardProperty) {
			filters.update((current) => ({
				...current,
				selectedProperties: toggleInArray(current.selectedProperties, property)
			}));
		},
		resetFilters() {
			filters.set(cloneDefaultFilters());
		},
		syncFiltersFromSearchParams(searchParams: URLSearchParams) {
			const parsed = searchParamsToCardFilters(searchParams);
			setFilters({
				...cloneDefaultFilters(),
				...parsed,
				searchQuery: parsed.searchQuery ?? ''
			});
		},
		getSearchParams() {
			return cardFiltersToSearchParams(get(filters));
		}
	};
}

export const cardsStore = createCardsStore();
