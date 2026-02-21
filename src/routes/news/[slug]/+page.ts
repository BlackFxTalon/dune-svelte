import { error } from '@sveltejs/kit';

import type { Article } from '$lib/types/article';

import articlesData from '../../../data/articles.json';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const articles = articlesData as Article[];
	const article = articles.find((item) => item.slug === params.slug);

	if (!article) {
		throw error(404, 'Article not found');
	}

	const relatedArticles = article.relatedSlugs
		.map((slug) => articles.find((item) => item.slug === slug) ?? null)
		.filter((item): item is Article => item !== null);

	return {
		article,
		relatedArticles
	};
};
