export type FactionId = 'emperor' | 'spacing_guild' | 'bene_gesserit' | 'fremen';

export interface Faction {
	id: FactionId;
	name: string;
	color: string;
	description: string;
	strengths: string[];
	weaknesses: string[];
}
