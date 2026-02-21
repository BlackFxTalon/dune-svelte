<script lang="ts">
	import { slide } from 'svelte/transition';

	import { Button, Input } from '$lib/components';
	import { useScrollReveal } from '$lib/utils';

	import { page } from '$app/state';

	interface FaqItem {
		id: number;
		question: string;
		answer: string;
		topic: 'rules' | 'strategy' | 'events' | 'content';
	}

	const faqItems: FaqItem[] = [
		{
			id: 1,
			question: 'Where should new players start in Dune Imperium?',
			answer:
				'Focus on reliable influence gains and low-risk economy turns. Avoid overcommitting to conflicts in early rounds.',
			topic: 'strategy'
		},
		{
			id: 2,
			question: 'How are fan expansions marked in the site catalog?',
			answer:
				'Fan expansions use explicit fan labels in cards, sets and leaders views to separate them from official content.',
			topic: 'content'
		},
		{
			id: 3,
			question: 'How often is the rating table updated?',
			answer:
				'The rating view is synced with seasonal snapshots and community event recaps. In this mock, updates are represented by dataset refreshes.',
			topic: 'events'
		},
		{
			id: 4,
			question: 'Can I browse articles by tag or topic?',
			answer:
				'Yes. The news page supports tag filtering and free-text search to narrow the article feed.',
			topic: 'content'
		},
		{
			id: 5,
			question: 'What does the tournament mode filter in rating mean?',
			answer:
				'Tournament mode highlights players with stronger rating or match volume to approximate competitive event cuts.',
			topic: 'events'
		},
		{
			id: 6,
			question: 'Do filter selections stay while navigating cards and leaders?',
			answer:
				'Cards filters are synchronized with URL params. Leaders and other pages keep filter state during active session interactions.',
			topic: 'rules'
		},
		{
			id: 7,
			question: 'How can I improve my conflict timing decisions?',
			answer:
				'Track opponent intrigue posture and avoid spending high-value combat cards before you know final conflict commitments.',
			topic: 'strategy'
		},
		{
			id: 8,
			question: 'What is included in faction strategy notes?',
			answer:
				'Each faction card summarizes strengths, weaknesses and practical turn-planning recommendations for midgame and endgame.',
			topic: 'strategy'
		}
	];

	let searchQuery = $state('');
	let openItemId = $state<number | null>(null);

	const filteredFaqItems = $derived(
		faqItems.filter((item) => {
			const query = searchQuery.trim().toLowerCase();
			if (query.length === 0) {
				return true;
			}

			return (
				item.question.toLowerCase().includes(query) ||
				item.answer.toLowerCase().includes(query) ||
				item.topic.toLowerCase().includes(query)
			);
		})
	);

	function toggleItem(itemId: number) {
		openItemId = openItemId === itemId ? null : itemId;
	}

	function resetSearch() {
		searchQuery = '';
		openItemId = null;
	}
</script>

<svelte:head>
	<title>FAQ | Dune Imperium</title>
	<meta
		name="description"
		content="Frequently asked questions about Dune Imperium gameplay, strategy and site navigation."
	/>
	<meta property="og:title" content="FAQ | Dune Imperium" />
	<meta
		property="og:description"
		content="Answers about gameplay, site usage and community features."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: faqItems.map((item) => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.answer
				}
			}))
		})}
	</script>
</svelte:head>

<main class="page-main faq-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">Knowledge Base</p>
			<h1>FAQ</h1>
			<p class="faq-page__meta">
				Showing {filteredFaqItems.length} of {faqItems.length} questions.
			</p>
		</div>

		<div class="surface faq-search">
			<Input
				id="faq-search"
				label="Search questions"
				placeholder="Type question, answer keyword or topic..."
				value={searchQuery}
				oninput={(event) => (searchQuery = (event.currentTarget as HTMLInputElement).value)}
			/>
			<Button variant="ghost" size="sm" onclick={resetSearch} disabled={searchQuery.trim().length === 0}>
				Reset search
			</Button>
		</div>

		<section class="faq-list" aria-live="polite">
			{#if filteredFaqItems.length === 0}
				<article class="surface faq-empty">
					<h2>No questions found</h2>
					<p>Try another keyword or reset search.</p>
					<Button variant="secondary" onclick={resetSearch}>Reset search</Button>
				</article>
			{:else}
				{#each filteredFaqItems as item (item.id)}
					<article class="faq-item">
						<h2>
							<button
								type="button"
								class="faq-item__trigger"
								aria-expanded={openItemId === item.id}
								aria-controls={`faq-panel-${item.id}`}
								onclick={() => toggleItem(item.id)}
							>
								<span>{item.question}</span>
								<span aria-hidden="true">{openItemId === item.id ? '−' : '+'}</span>
							</button>
						</h2>

						{#if openItemId === item.id}
							<div id={`faq-panel-${item.id}`} class="faq-item__panel" transition:slide={{ duration: 180 }}>
								<p>{item.answer}</p>
								<small>Topic: {item.topic}</small>
							</div>
						{/if}
					</article>
				{/each}
			{/if}
		</section>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
