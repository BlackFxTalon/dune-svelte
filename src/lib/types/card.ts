import type { FactionId } from './faction';
import type { SetId } from './set';

export type CardCell = 'landsraad' | 'city' | 'desert' | 'spy' | 'other';
export type CardProperty =
	| 'purchase_bonus'
	| 'trash'
	| 'graft'
	| 'tleilaxu'
	| 'command'
	| 'teamwork'
	| 'choam';
export type CardSortField = 'name' | 'cost';
export type SortDirection = 'asc' | 'desc';

export interface Card {
	id: number;
	slug: string;
	name: string;
	nameEn: string;
	cost: number;
	setId: SetId;
	faction: FactionId | null;
	cell: CardCell;
	properties: CardProperty[];
	imageUrl: string;
	isOfficial: boolean;
	text: string;
}

export interface CardFilters {
	selectedSets: SetId[];
	selectedFactions: FactionId[];
	selectedCells: CardCell[];
	selectedProperties: CardProperty[];
	sortField: CardSortField;
	sortDirection: SortDirection;
	searchQuery: string;
}
