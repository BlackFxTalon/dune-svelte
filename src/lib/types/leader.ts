import type { FactionId } from './faction';
import type { SetId } from './set';

export type LeaderComplexity = 'low' | 'medium' | 'high';

export interface Leader {
	id: number;
	slug: string;
	name: string;
	house: string;
	faction: FactionId;
	ability: string;
	complexity: LeaderComplexity;
	setId: SetId;
	imageUrl: string;
}
