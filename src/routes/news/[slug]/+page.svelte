<script lang="ts">
	import { Badge } from '$lib/components';
	import { useScrollReveal } from '$lib/utils';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import type { PageData } from './$types';

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	let { data }: { data: PageData } = $props();

	function formatDate(value: string): string {
		return dateFormatter.format(new Date(value));
	}
</script>

<svelte:head>
	<title>{data.article.title} | Dune Imperium</title>
	<meta name="description" content={data.article.excerpt} />
	<meta property="og:title" content={`${data.article.title} | Dune Imperium`} />
	<meta property="og:description" content={data.article.excerpt} />
	<meta property="og:image" content={data.article.imageUrl} />
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main article-page">
	<section class="container section">
		<article class="surface article-main u-reveal" use:useScrollReveal>
			<a class="article-back" href={resolve('/news')}>← Back to news</a>

			<p class="article-meta">{formatDate(data.article.publishedAt)} · {data.article.author}</p>
			<h1>{data.article.title}</h1>

			<div class="article-tags">
				{#each data.article.tags as tag (`${data.article.slug}-${tag}`)}
					<Badge tone="neutral">{tag}</Badge>
				{/each}
			</div>

			<div class="article-image">
				<img src={data.article.imageUrl} alt={data.article.title} loading="lazy" />
			</div>

			<p class="article-excerpt">{data.article.excerpt}</p>
			<p class="article-content">{data.article.content}</p>
		</article>

		{#if data.relatedArticles.length > 0}
			<section class="surface-soft article-related u-reveal" use:useScrollReveal>
				<div class="section-title">
					<p class="eyebrow">Read next</p>
					<h2>Related articles</h2>
				</div>

				<div class="article-related__grid">
					{#each data.relatedArticles as relatedArticle (relatedArticle.id)}
						<article class="article-related__card">
							<a
								class="article-related__image"
								href={resolve('/news/[slug]', { slug: relatedArticle.slug })}
							>
								<img src={relatedArticle.imageUrl} alt={relatedArticle.title} loading="lazy" />
							</a>
							<div class="article-related__content">
								<p>{formatDate(relatedArticle.publishedAt)}</p>
								<h3>
									<a href={resolve('/news/[slug]', { slug: relatedArticle.slug })}>
										{relatedArticle.title}
									</a>
								</h3>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
