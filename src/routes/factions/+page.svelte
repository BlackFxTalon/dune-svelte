<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	import { Badge, Tag } from '$lib/components';
	import { factionsStore } from '$lib/stores/factions';
	import { leadersStore } from '$lib/stores/leaders';
	import type { FactionId } from '$lib/types/faction';
	import { useScrollReveal } from '$lib/utils';

	import { page } from '$app/state';

	const strategiesByFaction: Record<FactionId, string[]> = {
		emperor: [
			'Push influence tracks early to secure alliance tempo before conflict spikes.',
			'Preserve intrigue cards for round-closing swings, not early value.',
			'Convert economy bursts into decisive late-round conflict commitments.'
		],
		spacing_guild: [
			'Use mobility edges to contest board spaces opponents cannot chain efficiently.',
			'Prioritize flexible card buys over narrow combat-only lines.',
			'Leverage shipping tempo to pivot between diplomacy and economy in one round.'
		],
		bene_gesserit: [
			'Trim weak cards early and shape draws for high-control turns.',
			'Keep intrigue threat visible to pressure suboptimal opponent decisions.',
			'Play for incremental board advantages and punish overextensions in conflicts.'
		],
		fremen: [
			'Exploit desert access for consistent tempo and resource conversion.',
			'Build predictable combat floors before committing to high-risk spikes.',
			'Force opponents into uncomfortable conflict timing with worm-rider pressure.'
		]
	};

	const visibleFactions = $derived(
		$factionsStore.selectedFaction === 'all'
			? $factionsStore.factions
			: $factionsStore.factions.filter((faction) => faction.id === $factionsStore.selectedFaction)
	);

	const leadersByFaction = $derived(
		$leadersStore.leaders.reduce<Record<FactionId, number>>(
			(acc, leader) => {
				acc[leader.faction] += 1;
				return acc;
			},
			{
				emperor: 0,
				spacing_guild: 0,
				bene_gesserit: 0,
				fremen: 0
			}
		)
	);

	onMount(() => {
		factionsStore.loadFactions();
		leadersStore.loadLeaders();
	});
</script>

<svelte:head>
	<title>Factions | Dune Imperium</title>
	<meta
		name="description"
		content="Faction cards for Dune Imperium with strengths, weaknesses and strategy recommendations."
	/>
	<meta property="og:title" content="Factions | Dune Imperium" />
	<meta
		property="og:description"
		content="Compare faction strengths, weaknesses and strategic game plans."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main factions-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">House Intelligence</p>
			<h1>Factions</h1>
			<p class="factions-page__meta">
				Showing {visibleFactions.length} of {$factionsStore.factions.length} factions.
			</p>
		</div>

		<div class="surface factions-filters">
			<h2>Filter by faction</h2>
			<div class="factions-filters__tags">
				<Tag
					selected={$factionsStore.selectedFaction === 'all'}
					aria-pressed={$factionsStore.selectedFaction === 'all'}
					onclick={() => factionsStore.setSelectedFaction('all')}
				>
					All factions
				</Tag>
				{#each $factionsStore.factions as faction (faction.id)}
					<Tag
						selected={$factionsStore.selectedFaction === faction.id}
						aria-pressed={$factionsStore.selectedFaction === faction.id}
						onclick={() => factionsStore.setSelectedFaction(faction.id)}
					>
						{faction.name}
					</Tag>
				{/each}
			</div>
		</div>

		<section class="factions-grid" aria-live="polite">
			{#each visibleFactions as faction (faction.id)}
				<article class="faction-card" animate:flip={{ duration: 220 }}>
					<div class="faction-card__header">
						<h2>{faction.name}</h2>
						<div class="faction-card__meta">
							<Badge tone="neutral">cards: {$factionsStore.cardsByFaction[faction.id] ?? 0}</Badge>
							<Badge tone="neutral">leaders: {leadersByFaction[faction.id] ?? 0}</Badge>
						</div>
					</div>

					<p class="faction-card__description">{faction.description}</p>

					<div class="faction-card__lists">
						<div>
							<h3>Strengths</h3>
							<ul>
								{#each faction.strengths as strength (`${faction.id}-s-${strength}`)}
									<li>{strength}</li>
								{/each}
							</ul>
						</div>
						<div>
							<h3>Weaknesses</h3>
							<ul>
								{#each faction.weaknesses as weakness (`${faction.id}-w-${weakness}`)}
									<li>{weakness}</li>
								{/each}
							</ul>
						</div>
					</div>

					<div class="faction-card__strategy">
						<h3>Strategy notes</h3>
						<ul>
							{#each strategiesByFaction[faction.id] as tip (`${faction.id}-tip-${tip}`)}
								<li>{tip}</li>
							{/each}
						</ul>
					</div>
				</article>
			{/each}
		</section>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
