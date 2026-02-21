<script lang="ts">
	import { onMount } from 'svelte';

	import { Badge, Button, Input, Tag } from '$lib/components';
	import { newsStore } from '$lib/stores/news';
	import { useScrollReveal } from '$lib/utils';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	const availableTags = $derived([
		'all',
		...[...new Set($newsStore.articles.flatMap((article) => article.tags))].sort((left, right) =>
			left.localeCompare(right)
		)
	]);

	function formatDate(value: string): string {
		return dateFormatter.format(new Date(value));
	}

	function resetFilters() {
		newsStore.resetFilters();
	}

	onMount(() => {
		newsStore.loadArticles();
	});
</script>

<svelte:head>
	<title>News | Dune Imperium</title>
	<meta
		name="description"
		content="Latest Dune Imperium news, meta reports and tournament announcements with tag filters and search."
	/>
	<meta property="og:title" content="News | Dune Imperium" />
	<meta
		property="og:description"
		content="Community articles, meta updates and tournament announcements."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main news-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">Community Feed</p>
			<h1>News</h1>
			<p class="news-page__meta">
				Showing {$newsStore.filteredArticles.length} of {$newsStore.articles.length} articles.
			</p>
		</div>

		<div class="surface news-filters">
			<Input
				id="news-search"
				label="Search articles"
				placeholder="Search by title or excerpt..."
				value={$newsStore.filters.searchQuery}
				oninput={(event) => newsStore.setSearchQuery((event.currentTarget as HTMLInputElement).value)}
			/>

			<div class="news-filters__tags" role="group" aria-label="News tags">
				{#each availableTags as tag (tag)}
					<Tag
						selected={$newsStore.filters.tag === tag}
						aria-pressed={$newsStore.filters.tag === tag}
						onclick={() => newsStore.setTag(tag)}
					>
						{tag === 'all' ? 'All tags' : tag}
					</Tag>
				{/each}
			</div>

			<Button variant="ghost" size="sm" onclick={resetFilters}>Reset filters</Button>
		</div>

		<section class="news-grid" aria-live="polite">
			{#if $newsStore.filteredArticles.length === 0}
				<article class="surface news-empty">
					<h2>No articles found</h2>
					<p>Try changing the search query or tag filter.</p>
					<Button variant="secondary" onclick={resetFilters}>Reset filters</Button>
				</article>
			{:else}
				{#each $newsStore.filteredArticles as article (article.id)}
					<article class="news-card">
						<a class="news-card__image" href={resolve('/news/[slug]', { slug: article.slug })}>
							<img src={article.imageUrl} alt={article.title} loading="lazy" />
						</a>

						<div class="news-card__content">
							<p class="news-card__meta">{formatDate(article.publishedAt)} · {article.author}</p>
							<h2>
								<a href={resolve('/news/[slug]', { slug: article.slug })}>{article.title}</a>
							</h2>
							<p>{article.excerpt}</p>

							<div class="news-card__tags">
								{#each article.tags as tag (`${article.slug}-${tag}`)}
									<Badge tone="neutral">{tag}</Badge>
								{/each}
							</div>
						</div>
					</article>
				{/each}
			{/if}
		</section>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
