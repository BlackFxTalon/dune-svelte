<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	import { Badge, Button, Input, Select, Tag } from '$lib/components';
	import { cardFiltersToSearchParams, cardsStore, defaultCardFilters } from '$lib/stores/cards';
	import { factionsStore } from '$lib/stores/factions';
	import { setsStore } from '$lib/stores/sets';
	import type {
		Card as GameCard,
		CardCell,
		CardFilters,
		CardProperty,
		CardSortField,
		SortDirection
	} from '$lib/types/card';
	import type { FactionId } from '$lib/types/faction';
	import type { SetId } from '$lib/types/set';
	import { useScrollReveal } from '$lib/utils';

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
		{ value: 'purchase_bonus', label: 'Purchase bonus' },
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

	const cellLabelByValue: Record<CardCell, string> = {
		landsraad: 'Landsraad',
		city: 'City',
		desert: 'Desert',
		spy: 'Spy',
		other: 'Other'
	};

	const propertyLabelByValue: Record<CardProperty, string> = {
		purchase_bonus: 'Purchase bonus',
		trash: 'Trash',
		graft: 'Graft',
		tleilaxu: 'Tleilaxu',
		command: 'Command',
		teamwork: 'Teamwork',
		choam: 'CHOAM'
	};

	let initialized = $state(false);
	let isFiltersOpen = $state(false);
	let selectedCard = $state<GameCard | null>(null);
	let lastFocusedElement: HTMLElement | null = null;

	const currentSort = $derived(
		`${$cardsStore.filters.sortField}.${$cardsStore.filters.sortDirection}`
	);
	const setNameById = $derived(new Map($setsStore.sets.map((set) => [set.id, set.name])));
	const factionNameById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.name]))
	);
	const activeFiltersCount = $derived(
		$cardsStore.filters.selectedSets.length +
			$cardsStore.filters.selectedFactions.length +
			$cardsStore.filters.selectedCells.length +
			$cardsStore.filters.selectedProperties.length +
			($cardsStore.filters.searchQuery.trim().length > 0 ? 1 : 0) +
			($cardsStore.filters.sortField !== defaultCardFilters.sortField ||
			$cardsStore.filters.sortDirection !== defaultCardFilters.sortDirection
				? 1
				: 0)
	);

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

	function openCard(card: GameCard, event: Event) {
		if (event.currentTarget instanceof HTMLElement) {
			lastFocusedElement = event.currentTarget;
		}
		selectedCard = card;
	}

	function closeCardModal() {
		selectedCard = null;
		lastFocusedElement?.focus();
	}

	function closeFilters() {
		isFiltersOpen = false;
	}

	function resetFilters() {
		cardsStore.resetFilters();
	}

	onMount(() => {
		cardsStore.loadCards();
		syncStoreFromUrl();
		initialized = true;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') {
				return;
			}

			if (selectedCard) {
				event.preventDefault();
				closeCardModal();
				return;
			}

			if (isFiltersOpen) {
				event.preventDefault();
				closeFilters();
			}
		};

		const desktopMedia = window.matchMedia('(min-width: 992px)');
		const handleDesktopSwitch = (event: MediaQueryListEvent) => {
			if (event.matches) {
				isFiltersOpen = false;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		desktopMedia.addEventListener('change', handleDesktopSwitch);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			desktopMedia.removeEventListener('change', handleDesktopSwitch);
		};
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

		syncUrlFromStore($cardsStore.filters);
	});

	$effect(() => {
		if (typeof document === 'undefined') {
			return;
		}

		const shouldLockScroll = isFiltersOpen || selectedCard !== null;
		document.body.style.overflow = shouldLockScroll ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>Cards Catalog | Dune Imperium</title>
	<meta
		name="description"
		content="Catalog of Dune Imperium cards with filtering by sets, factions and card properties."
	/>
	<meta property="og:title" content="Cards Catalog | Dune Imperium" />
	<meta
		property="og:description"
		content="Filter Dune Imperium cards by sets, factions, properties and sorting."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main cards-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">CardsStore Pipeline</p>
			<h1>Cards Catalog</h1>
			<p class="cards-page__meta">
				Showing {$cardsStore.stats.filtered} of {$cardsStore.stats.total} cards.
			</p>
		</div>

		<div class="cards-mobile-actions">
			<Button variant="secondary" onclick={() => (isFiltersOpen = true)}>
				Filters
				{#if activeFiltersCount > 0}
					<span class="cards-mobile-actions__count">{activeFiltersCount}</span>
				{/if}
			</Button>
			<Button variant="ghost" onclick={resetFilters} disabled={activeFiltersCount === 0}>Reset</Button>
		</div>

		<div class="cards-layout">
			{#if isFiltersOpen}
				<button
					class="cards-filters__backdrop"
					type="button"
					aria-label="Close filters panel"
					onclick={closeFilters}
				></button>
			{/if}

			<aside id="cards-filters" class="surface cards-filters" class:is-open={isFiltersOpen}>
				<div class="cards-filters__header">
					<h2>Filters</h2>
					<button
						type="button"
						class="cards-filters__close"
						aria-label="Close filters panel"
						onclick={closeFilters}
					>
						Close
					</button>
				</div>

				<div class="stack">
					<Input
						id="cards-search"
						label="Search card"
						placeholder="Name or English name..."
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
					<h3>Sets</h3>
					<div class="cards-filters__tags">
						{#each $setsStore.sets as set (set.id)}
							<Tag
								selected={$cardsStore.filters.selectedSets.includes(set.id)}
								aria-pressed={$cardsStore.filters.selectedSets.includes(set.id)}
								onclick={() => cardsStore.toggleSet(set.id as SetId)}
							>
								{set.name}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h3>Factions</h3>
					<div class="cards-filters__tags">
						{#each $factionsStore.factions as faction (faction.id)}
							<Tag
								selected={$cardsStore.filters.selectedFactions.includes(faction.id)}
								aria-pressed={$cardsStore.filters.selectedFactions.includes(faction.id)}
								onclick={() => cardsStore.toggleFaction(faction.id as FactionId)}
							>
								{faction.name}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h3>Cells</h3>
					<div class="cards-filters__tags">
						{#each cellOptions as option (option.value)}
							<Tag
								selected={$cardsStore.filters.selectedCells.includes(option.value)}
								aria-pressed={$cardsStore.filters.selectedCells.includes(option.value)}
								onclick={() => cardsStore.toggleCell(option.value)}
							>
								{option.label}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="stack">
					<h3>Properties</h3>
					<div class="cards-filters__tags">
						{#each propertyOptions as option (option.value)}
							<Tag
								selected={$cardsStore.filters.selectedProperties.includes(option.value)}
								aria-pressed={$cardsStore.filters.selectedProperties.includes(option.value)}
								onclick={() => cardsStore.toggleProperty(option.value)}
							>
								{option.label}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="cards-filters__footer">
					<Button variant="secondary" onclick={resetFilters} disabled={activeFiltersCount === 0} block={true}>
						Reset filters
					</Button>
					<div class="cards-filters__apply">
						<Button onclick={closeFilters} block={true}>Show {$cardsStore.stats.filtered} cards</Button>
					</div>
				</div>
			</aside>

			<section class="cards-grid" aria-live="polite">
				{#if $cardsStore.filteredCards.length === 0}
					<article class="surface cards-empty">
						<h2>No cards found</h2>
						<p>Try changing filters or clear the search query.</p>
						<Button variant="secondary" onclick={resetFilters}>Reset filters</Button>
					</article>
				{:else}
					{#each $cardsStore.filteredCards as card (card.id)}
						<article class="card-tile" animate:flip={{ duration: 220 }}>
							<button
								type="button"
								class="card-tile__button"
								onclick={(event) => openCard(card, event)}
								aria-label={`Open ${card.name} details`}
							>
								<div class="card-tile__image">
									<img src={card.imageUrl} alt={card.name} loading="lazy" />
								</div>

								<div class="card-tile__content">
									<div class="card-tile__meta">
										<Badge tone={card.isOfficial ? 'primary' : 'info'}>
											{card.isOfficial ? 'official' : 'fan'}
										</Badge>
										<Badge tone="neutral">cost {card.cost}</Badge>
									</div>

									<h2>{card.name}</h2>
									<p>{card.text}</p>

									<div class="card-tile__meta">
										<Badge tone="neutral">{setNameById.get(card.setId) ?? card.setId}</Badge>
										{#if card.faction}
											<Badge tone="neutral">{factionNameById.get(card.faction) ?? card.faction}</Badge>
										{/if}
										<Badge tone="neutral">{cellLabelByValue[card.cell]}</Badge>
									</div>

									{#if card.properties.length > 0}
										<ul class="card-tile__properties">
											{#each card.properties.slice(0, 3) as property (`${card.id}-${property}`)}
												<li>{propertyLabelByValue[property]}</li>
											{/each}
											{#if card.properties.length > 3}
												<li>+{card.properties.length - 3}</li>
											{/if}
										</ul>
									{/if}
								</div>
							</button>
						</article>
					{/each}
				{/if}
			</section>
		</div>
	</section>
</main>

{#if selectedCard}
	<div
		class="card-modal__backdrop"
		role="presentation"
		onclick={(event) => {
			if (event.target === event.currentTarget) {
				closeCardModal();
			}
		}}
	>
		<div
			class="card-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="card-modal-title"
			aria-describedby="card-modal-description"
		>
			<button
				type="button"
				class="card-modal__close"
				aria-label="Close card details"
				onclick={closeCardModal}
			>
				Close
			</button>

			<div class="card-modal__image">
				<img src={selectedCard.imageUrl} alt={selectedCard.name} loading="lazy" />
			</div>

			<div class="card-modal__content">
				<h2 id="card-modal-title">{selectedCard.name}</h2>
				<p class="card-modal__subtitle">{selectedCard.nameEn}</p>

				<div class="card-modal__meta">
					<Badge tone={selectedCard.isOfficial ? 'primary' : 'info'}>
						{selectedCard.isOfficial ? 'official set' : 'fan set'}
					</Badge>
					<Badge tone="neutral">cost {selectedCard.cost}</Badge>
					<Badge tone="neutral">{setNameById.get(selectedCard.setId) ?? selectedCard.setId}</Badge>
					{#if selectedCard.faction}
						<Badge tone="neutral">
							{factionNameById.get(selectedCard.faction) ?? selectedCard.faction}
						</Badge>
					{/if}
					<Badge tone="neutral">{cellLabelByValue[selectedCard.cell]}</Badge>
				</div>

				<p id="card-modal-description" class="card-modal__text">{selectedCard.text}</p>

				{#if selectedCard.properties.length > 0}
					<div class="card-modal__properties">
						<h3>Properties</h3>
						<div class="card-modal__property-list">
							{#each selectedCard.properties as property (`modal-${selectedCard.id}-${property}`)}
								<Badge tone="neutral">{propertyLabelByValue[property]}</Badge>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@use './+page.scss' as *;
</style>
