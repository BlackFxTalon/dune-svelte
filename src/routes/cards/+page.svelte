<script lang="ts">
	import { onMount } from 'svelte';

	import { Badge, Button, Card, Input, Select, Tag } from '$lib/components';
	import { cardFiltersToSearchParams, cardsStore } from '$lib/stores/cards';
	import { factionsStore } from '$lib/stores/factions';
	import { setsStore } from '$lib/stores/sets';
	import type {
		CardCell,
		CardFilters,
		CardProperty,
		CardSortField,
		SortDirection
	} from '$lib/types/card';
	import type { FactionId } from '$lib/types/faction';
	import type { SetId } from '$lib/types/set';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const cellOptions: { value: CardCell; label: string }[] = [
		{ value: 'landsraad', label: 'Landsraad' },
		{ value: 'city', label: 'City' },
		{ value: 'desert', label: 'Desert' },
		{ value: 'spy', label: 'Spy' },
		{ value: 'other', label: 'Other' }
	];

	const propertyOptions: { value: CardProperty; label: string }[] = [
		{ value: 'purchase_bonus', label: 'Purchase Bonus' },
		{ value: 'trash', label: 'Trash' },
		{ value: 'graft', label: 'Graft' },
		{ value: 'tleilaxu', label: 'Tleilaxu' },
		{ value: 'command', label: 'Command' },
		{ value: 'teamwork', label: 'Teamwork' },
		{ value: 'choam', label: 'CHOAM' }
	];

	const sortOptions = [
		{ value: 'name.asc', label: 'Name A-Z' },
		{ value: 'name.desc', label: 'Name Z-A' },
		{ value: 'cost.asc', label: 'Cost low-high' },
		{ value: 'cost.desc', label: 'Cost high-low' }
	];

	let initialized = $state(false);

	const currentSort = $derived(
		`${$cardsStore.filters.sortField}.${$cardsStore.filters.sortDirection}`
	);
	const setNameById = $derived(new Map($setsStore.sets.map((set) => [set.id, set.name])));

	function handleSortChange(value: string) {
		const [sortField, sortDirection] = value.split('.') as [CardSortField, SortDirection];
		cardsStore.setSorting(sortField, sortDirection);
	}

	function syncStoreFromUrl() {
		cardsStore.syncFiltersFromSearchParams(page.url.searchParams);
	}

	function syncUrlFromStore(filters: CardFilters) {
		const nextQuery = cardFiltersToSearchParams(filters).toString();
		const currentQuery = page.url.searchParams.toString();

		if (nextQuery === currentQuery) {
			return;
		}

		window.history.replaceState(
			window.history.state,
			'',
			resolve('/cards') + (nextQuery.length > 0 ? `?${nextQuery}` : '')
		);
	}

	onMount(() => {
		cardsStore.loadCards();
		syncStoreFromUrl();
		initialized = true;
	});

	$effect(() => {
		if (!initialized) {
			return;
		}

		const currentQuery = page.url.searchParams.toString();
		const storeQuery = cardsStore.getSearchParams().toString();

		if (currentQuery !== storeQuery) {
			syncStoreFromUrl();
		}
	});

	$effect(() => {
		if (!initialized) {
			return;
		}

		const filters = $cardsStore.filters;
		syncUrlFromStore(filters);
	});
</script>

<svelte:head>
	<title>Cards | Dune Svelte</title>
	<meta
		name="description"
		content="Catalog of Dune Imperium cards with filtering, searching and sorting."
	/>
</svelte:head>

<main class="page-main cards-page">
	<section class="container section">
		<div class="section-title">
			<p class="eyebrow">CardsStore Pipeline</p>
			<h1>Cards Catalog</h1>
			<p class="cards-page__meta">
				Showing {$cardsStore.stats.filtered} of {$cardsStore.stats.total} cards.
			</p>
		</div>

		<div class="cards-layout">
			<aside class="surface cards-filters">
				<div class="stack">
					<Input
						id="cards-search"
						label="Search card"
						placeholder="Name or english name..."
						value={$cardsStore.filters.searchQuery}
						oninput={(event) =>
							cardsStore.setSearchQuery((event.currentTarget as HTMLInputElement).value)}
					/>

					<Select
						id="cards-sort"
						label="Sort"
						value={currentSort}
						options={sortOptions}
						onchange={(event) => handleSortChange((event.currentTarget as HTMLSelectElement).value)}
					/>
				</div>

				<div class="stack">
					<h2>Sets</h2>
					<div class="cards-filters__tags">
						{#each $setsStore.sets as set (set.id)}
							<Tag
								selected={$cardsStore.filters.selectedSets.includes(set.id)}
								onclick={() => cardsStore.toggleSet(set.id as SetId)}
							>
								{set.name}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h2>Factions</h2>
					<div class="cards-filters__tags">
						{#each $factionsStore.factions as faction (faction.id)}
							<Tag
								selected={$cardsStore.filters.selectedFactions.includes(faction.id)}
								onclick={() => cardsStore.toggleFaction(faction.id as FactionId)}
							>
								{faction.name}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h2>Cells</h2>
					<div class="cards-filters__tags">
						{#each cellOptions as option (option.value)}
							<Tag
								selected={$cardsStore.filters.selectedCells.includes(option.value)}
								onclick={() => cardsStore.toggleCell(option.value)}
							>
								{option.label}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h2>Properties</h2>
					<div class="cards-filters__tags">
						{#each propertyOptions as option (option.value)}
							<Tag
								selected={$cardsStore.filters.selectedProperties.includes(option.value)}
								onclick={() => cardsStore.toggleProperty(option.value)}
							>
								{option.label}
							</Tag>
						{/each}
					</div>
				</div>

				<Button variant="secondary" onclick={() => cardsStore.resetFilters()} block={true}>
					Reset Filters
				</Button>
			</aside>

			<section class="cards-grid" aria-live="polite">
				{#if $cardsStore.filteredCards.length === 0}
					<article class="surface cards-empty">
						<h2>No cards found</h2>
						<p>Try changing filters or clear search query.</p>
					</article>
				{:else}
					{#each $cardsStore.filteredCards as card (card.id)}
						<Card title={card.name} description={card.text}>
							<div class="cards-grid__meta">
								<Badge tone={card.isOfficial ? 'primary' : 'info'}>
									{card.isOfficial ? 'official' : 'fan'}
								</Badge>
								<Badge tone="neutral">cost {card.cost}</Badge>
								<Badge tone="neutral">{setNameById.get(card.setId) ?? card.setId}</Badge>
							</div>
						</Card>
					{/each}
				{/if}
			</section>
		</div>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
