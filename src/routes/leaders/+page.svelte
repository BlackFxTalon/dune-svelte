<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	import { Badge, Button, Input, Select, Tag } from '$lib/components';
	import { factionsStore } from '$lib/stores/factions';
	import { type LeadersGroupBy,leadersStore } from '$lib/stores/leaders';
	import { setsStore } from '$lib/stores/sets';
	import type { FactionId } from '$lib/types/faction';
	import type { LeaderComplexity } from '$lib/types/leader';
	import type { SetId } from '$lib/types/set';

	const groupByOptions: { value: LeadersGroupBy; label: string }[] = [
		{ value: 'none', label: 'Flat grid' },
		{ value: 'faction', label: 'Group by faction' }
	];

	const complexityToneByValue: Record<LeaderComplexity, 'info' | 'neutral' | 'danger'> = {
		low: 'info',
		medium: 'neutral',
		high: 'danger'
	};

	const complexityLabelByValue: Record<LeaderComplexity, string> = {
		low: 'Low complexity',
		medium: 'Medium complexity',
		high: 'High complexity'
	};

	let isFiltersOpen = $state(false);

	const setOptions = $derived([
		{ value: 'all', label: 'All sets' },
		...$setsStore.sets.map((set) => ({ value: set.id, label: set.name }))
	]);

	const factionNameById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.name]))
	);
	const factionColorById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.color]))
	);
	const factionDescriptionById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.description]))
	);
	const setNameById = $derived(new Map($setsStore.sets.map((set) => [set.id, set.name])));
	const setOfficialById = $derived(new Map($setsStore.sets.map((set) => [set.id, set.official])));

	const visibleGroupedLeaders = $derived(
		$leadersStore.groupedLeaders.filter((group) => group.leaders.length > 0)
	);

	const activeFiltersCount = $derived(
		($leadersStore.filters.searchQuery.trim().length > 0 ? 1 : 0) +
			($leadersStore.filters.faction !== 'all' ? 1 : 0) +
			($leadersStore.filters.setId !== 'all' ? 1 : 0) +
			($leadersStore.filters.groupBy !== 'none' ? 1 : 0)
	);

	function closeFilters() {
		isFiltersOpen = false;
	}

	function parseGroupBy(value: string): LeadersGroupBy {
		return value === 'faction' ? 'faction' : 'none';
	}

	function parseSetId(value: string): SetId | 'all' {
		return value === 'all' ? 'all' : (value as SetId);
	}

	function setFaction(faction: FactionId | 'all') {
		leadersStore.setFaction(faction);
	}

	function resetFilters() {
		leadersStore.resetFilters();
	}

	onMount(() => {
		leadersStore.loadLeaders();
		factionsStore.loadFactions();
		setsStore.loadSets();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isFiltersOpen) {
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
		if (typeof document === 'undefined') {
			return;
		}

		document.body.style.overflow = isFiltersOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>Leaders | Dune Imperium</title>
	<meta
		name="description"
		content="Browse Dune Imperium leaders with faction filters and grouped faction views."
	/>
</svelte:head>

<main class="page-main leaders-page">
	<section class="container section">
		<div class="section-title">
			<p class="eyebrow">Leader Roster</p>
			<h1>Leaders</h1>
			<p class="leaders-page__meta">
				Showing {$leadersStore.filteredLeaders.length} of {$leadersStore.leaders.length} leaders.
			</p>
		</div>

		<div class="leaders-mobile-actions">
			<Button variant="secondary" onclick={() => (isFiltersOpen = true)}>
				Filters
				{#if activeFiltersCount > 0}
					<span class="leaders-mobile-actions__count">{activeFiltersCount}</span>
				{/if}
			</Button>
			<Button variant="ghost" onclick={resetFilters} disabled={activeFiltersCount === 0}>Reset</Button>
		</div>

		<div class="leaders-layout">
			{#if isFiltersOpen}
				<button
					class="leaders-filters__backdrop"
					type="button"
					aria-label="Close leaders filters panel"
					onclick={closeFilters}
				></button>
			{/if}

			<aside id="leaders-filters" class="surface leaders-filters" class:is-open={isFiltersOpen}>
				<div class="leaders-filters__header">
					<h2>Filters</h2>
					<button
						type="button"
						class="leaders-filters__close"
						aria-label="Close leaders filters panel"
						onclick={closeFilters}
					>
						Close
					</button>
				</div>

				<div class="stack">
					<Input
						id="leaders-search"
						label="Search leader"
						placeholder="Name, house, or ability..."
						value={$leadersStore.filters.searchQuery}
						oninput={(event) =>
							leadersStore.setSearchQuery((event.currentTarget as HTMLInputElement).value)}
					/>

					<Select
						id="leaders-set"
						label="Set"
						value={$leadersStore.filters.setId}
						options={setOptions}
						onchange={(event) =>
							leadersStore.setSet(parseSetId((event.currentTarget as HTMLSelectElement).value))}
					/>

					<Select
						id="leaders-group"
						label="Grouping"
						value={$leadersStore.filters.groupBy}
						options={groupByOptions}
						onchange={(event) =>
							leadersStore.setGroupBy(parseGroupBy((event.currentTarget as HTMLSelectElement).value))}
					/>
				</div>

				<div class="stack">
					<h3>Factions</h3>
					<div class="leaders-filters__tags">
						<Tag
							selected={$leadersStore.filters.faction === 'all'}
							aria-pressed={$leadersStore.filters.faction === 'all'}
							onclick={() => setFaction('all')}
						>
							All factions
						</Tag>
						{#each $factionsStore.factions as faction (faction.id)}
							<Tag
								selected={$leadersStore.filters.faction === faction.id}
								aria-pressed={$leadersStore.filters.faction === faction.id}
								onclick={() => setFaction(faction.id)}
							>
								{faction.name}
							</Tag>
						{/each}
					</div>
				</div>

				<div class="leaders-filters__footer">
					<Button variant="secondary" onclick={resetFilters} disabled={activeFiltersCount === 0} block={true}>
						Reset filters
					</Button>
					<div class="leaders-filters__apply">
						<Button onclick={closeFilters} block={true}>
							Show {$leadersStore.filteredLeaders.length} leaders
						</Button>
					</div>
				</div>
			</aside>

			<section class="leaders-results" aria-live="polite">
				{#if $leadersStore.filteredLeaders.length === 0}
					<article class="surface leaders-empty">
						<h2>No leaders found</h2>
						<p>Try changing faction filters or clear the search query.</p>
						<Button variant="secondary" onclick={resetFilters}>Reset filters</Button>
					</article>
				{:else if $leadersStore.filters.groupBy === 'faction'}
					{#each visibleGroupedLeaders as group (group.faction)}
						<article class="surface-soft leaders-group">
							<header class="leaders-group__header">
								<div class="leaders-group__title">
									<h2>{factionNameById.get(group.faction) ?? group.faction}</h2>
									<p>{factionDescriptionById.get(group.faction) ?? ''}</p>
								</div>
								<Badge tone="neutral">{group.leaders.length} leaders</Badge>
							</header>

							<div class="leaders-grid">
								{#each group.leaders as leader (leader.id)}
									<article class="leader-card" animate:flip={{ duration: 220 }}>
										<div class="leader-card__image">
											<img src={leader.imageUrl} alt={leader.name} loading="lazy" />
										</div>
										<div class="leader-card__content">
											<div class="leader-card__meta">
												<span
													class="leader-card__faction"
													style={`--faction-color: ${factionColorById.get(leader.faction) ?? '#f4cf8b'}`}
												>
													{factionNameById.get(leader.faction) ?? leader.faction}
												</span>
												<Badge tone={setOfficialById.get(leader.setId) ? 'primary' : 'info'}>
													{setNameById.get(leader.setId) ?? leader.setId}
												</Badge>
											</div>
											<div>
												<h3>{leader.name}</h3>
												<p class="leader-card__house">{leader.house}</p>
											</div>
											<p class="leader-card__ability">{leader.ability}</p>
											<div class="leader-card__meta">
												<Badge tone={complexityToneByValue[leader.complexity]}>
													{complexityLabelByValue[leader.complexity]}
												</Badge>
											</div>
										</div>
									</article>
								{/each}
							</div>
						</article>
					{/each}
				{:else}
					<div class="leaders-grid">
						{#each $leadersStore.filteredLeaders as leader (leader.id)}
							<article class="leader-card" animate:flip={{ duration: 220 }}>
								<div class="leader-card__image">
									<img src={leader.imageUrl} alt={leader.name} loading="lazy" />
								</div>
								<div class="leader-card__content">
									<div class="leader-card__meta">
										<span
											class="leader-card__faction"
											style={`--faction-color: ${factionColorById.get(leader.faction) ?? '#f4cf8b'}`}
										>
											{factionNameById.get(leader.faction) ?? leader.faction}
										</span>
										<Badge tone={setOfficialById.get(leader.setId) ? 'primary' : 'info'}>
											{setNameById.get(leader.setId) ?? leader.setId}
										</Badge>
									</div>
									<div>
										<h3>{leader.name}</h3>
										<p class="leader-card__house">{leader.house}</p>
									</div>
									<p class="leader-card__ability">{leader.ability}</p>
									<div class="leader-card__meta">
										<Badge tone={complexityToneByValue[leader.complexity]}>
											{complexityLabelByValue[leader.complexity]}
										</Badge>
									</div>
								</div>
							</article>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
