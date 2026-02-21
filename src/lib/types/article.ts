export interface Article {
	id: number;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	imageUrl: string;
	publishedAt: string;
	author: string;
	tags: string[];
	relatedSlugs: string[];
}
