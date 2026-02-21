import type { FactionId } from './faction';

export interface Player {
	id: number;
	nickname: string;
	rating: number;
	gamesPlayed: number;
	wins: number;
	losses: number;
	favoriteFaction: FactionId;
	season: string;
}
