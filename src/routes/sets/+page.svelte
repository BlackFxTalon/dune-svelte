<script lang="ts">
import { onMount } from 'svelte';
import { flip } from 'svelte/animate';
import { slide } from 'svelte/transition';

import { Badge, Button } from '$lib/components';
import { setsStore } from '$lib/stores/sets';
import type { SetId } from '$lib/types/set';
import { useScrollReveal } from '$lib/utils';

import { page } from '$app/state';

	type SetFilter = 'all' | 'official' | 'fan';

	let setFilter = $state<SetFilter>('all');

	const visibleSets = $derived(
		$setsStore.sets
			.filter((set) => {
				if (setFilter === 'official') {
					return set.official;
				}

				if (setFilter === 'fan') {
					return !set.official;
				}

				return true;
			})
			.sort((left, right) => right.releaseYear - left.releaseYear || left.name.localeCompare(right.name))
	);

	function toggleSetDetails(setId: SetId) {
		setsStore.setActiveSet($setsStore.activeSetId === setId ? 'all' : setId);
	}

	function resetSelection() {
		setsStore.setActiveSet('all');
		setFilter = 'all';
	}

	onMount(() => {
		setsStore.loadSets();
	});
</script>

<svelte:head>
	<title>Sets | Dune Imperium</title>
	<meta
		name="description"
		content="Browse official and fan-made Dune Imperium sets with expandable details and release context."
	/>
	<meta property="og:title" content="Sets | Dune Imperium" />
	<meta
		property="og:description"
		content="Official and fan sets with animated details and card-pool context."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main sets-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">Set Archive</p>
			<h1>Sets</h1>
			<p class="sets-page__meta">
				Showing {visibleSets.length} of {$setsStore.sets.length} sets.
			</p>
		</div>

		<div class="sets-controls">
			<div class="sets-controls__filters" role="group" aria-label="Set source filters">
				<Button
					variant={setFilter === 'all' ? 'primary' : 'secondary'}
					size="sm"
					onclick={() => (setFilter = 'all')}
				>
					All sets
				</Button>
				<Button
					variant={setFilter === 'official' ? 'primary' : 'secondary'}
					size="sm"
					onclick={() => (setFilter = 'official')}
				>
					Official
				</Button>
				<Button
					variant={setFilter === 'fan' ? 'primary' : 'secondary'}
					size="sm"
					onclick={() => (setFilter = 'fan')}
				>
					Fan-made
				</Button>
			</div>

			<Button variant="ghost" size="sm" onclick={resetSelection}>Reset</Button>
		</div>

		<section class="sets-grid" aria-live="polite">
			{#if visibleSets.length === 0}
				<article class="surface sets-empty">
					<h2>No sets found</h2>
					<p>Try switching source filters.</p>
				</article>
			{:else}
				{#each visibleSets as set (set.id)}
					<article class="set-card" animate:flip={{ duration: 240 }}>
						<div class="set-card__header">
							<div>
								<p class="set-card__year">{set.releaseYear}</p>
								<h2>{set.name}</h2>
							</div>
							<Badge tone={set.official ? 'primary' : 'info'}>
								{set.official ? 'official' : 'fan set'}
							</Badge>
						</div>

						<p class="set-card__summary">{set.description}</p>

						<div class="set-card__meta">
							<Badge tone="neutral">cards: {$setsStore.cardCountBySet[set.id] ?? set.cardCount}</Badge>
							<Badge tone="neutral">id: {set.id}</Badge>
						</div>

						<button
							type="button"
							class="set-card__toggle"
							aria-expanded={$setsStore.activeSetId === set.id}
							aria-controls={`set-details-${set.id}`}
							onclick={() => toggleSetDetails(set.id)}
						>
							{$setsStore.activeSetId === set.id ? 'Hide details' : 'Show details'}
						</button>

						{#if $setsStore.activeSetId === set.id}
							<div
								id={`set-details-${set.id}`}
								class="set-card__details"
								transition:slide={{ duration: 220 }}
							>
								<h3>Details</h3>
								<ul>
									<li>Release year: {set.releaseYear}</li>
									<li>Cards in pool: {$setsStore.cardCountBySet[set.id] ?? set.cardCount}</li>
									<li>
										Type: {set.official ? 'Official expansion / core line' : 'Community fan expansion'}
									</li>
								</ul>
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
