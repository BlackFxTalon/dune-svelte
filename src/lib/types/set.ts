export type SetId =
	| 'imperium'
	| 'rise_of_ix'
	| 'immortality'
	| 'uprising'
	| 'bloodlines'
	| 'fan_sietch'
	| 'fan_choam';

export interface GameSet {
	id: SetId;
	name: string;
	releaseYear: number;
	official: boolean;
	cardCount: number;
	description: string;
}
