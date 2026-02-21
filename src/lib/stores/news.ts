import { derived, writable } from 'svelte/store';

import type { Article } from '$lib/types/article';

import articlesData from '../../data/articles.json';

interface NewsFilters {
	searchQuery: string;
	tag: string | 'all';
}

const defaultFilters: NewsFilters = {
	searchQuery: '',
	tag: 'all'
};

export function createNewsStore(initialArticles: Article[] = articlesData as Article[]) {
	const articles = writable<Article[]>([...initialArticles]);
	const filters = writable<NewsFilters>({ ...defaultFilters });

	const filteredArticles = derived([articles, filters], ([$articles, $filters]) => {
		const query = $filters.searchQuery.trim().toLowerCase();

		return $articles
			.filter((article) => {
				if ($filters.tag === 'all') {
					return true;
				}
				return article.tags.includes($filters.tag);
			})
			.filter((article) => {
				if (query.length === 0) {
					return true;
				}
				return (
					article.title.toLowerCase().includes(query) || article.excerpt.toLowerCase().includes(query)
				);
			})
			.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
	});

	const state = derived([articles, filters, filteredArticles], ([$articles, $filters, $filteredArticles]) => ({
		articles: $articles,
		filters: $filters,
		filteredArticles: $filteredArticles
	}));

	return {
		subscribe: state.subscribe,
		articles,
		filters,
		filteredArticles,
		loadArticles(source: Article[] = articlesData as Article[]) {
			articles.set([...source]);
		},
		setSearchQuery(searchQuery: string) {
			filters.update((current) => ({ ...current, searchQuery }));
		},
		setTag(tag: string | 'all') {
			filters.update((current) => ({ ...current, tag }));
		},
		resetFilters() {
			filters.set({ ...defaultFilters });
		}
	};
}

export const newsStore = createNewsStore();
