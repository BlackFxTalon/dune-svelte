<script lang="ts">
	import { onMount } from 'svelte';

	import { Badge, Button, Select } from '$lib/components';
	import { factionsStore } from '$lib/stores/factions';
	import { type RatingMode, type RatingSortField,ratingStore } from '$lib/stores/rating';
	import { useScrollReveal } from '$lib/utils';

	import { page } from '$app/state';

	const modeTabs: { id: RatingMode; label: string; description: string }[] = [
		{ id: 'ladder', label: 'Ladder', description: 'All players in selected season' },
		{
			id: 'tournament',
			label: 'Tournament',
			description: 'High-performance cut by rating / match volume'
		}
	];

	const sortFieldOptions: { value: RatingSortField; label: string }[] = [
		{ value: 'rating', label: 'Rating' },
		{ value: 'wins', label: 'Wins' },
		{ value: 'gamesPlayed', label: 'Games played' },
		{ value: 'winRate', label: 'Win rate' }
	];

	const factionNameById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.name]))
	);
	const factionColorById = $derived(
		new Map($factionsStore.factions.map((faction) => [faction.id, faction.color]))
	);

	function seasonLabel(season: string): string {
		return season === 'all' ? 'All seasons' : season;
	}

	function formatWinRate(wins: number, gamesPlayed: number): string {
		if (gamesPlayed === 0) {
			return '0%';
		}

		return `${Math.round((wins / gamesPlayed) * 100)}%`;
	}

	function sortIndicator(field: RatingSortField): string {
		if ($ratingStore.filters.sortField !== field) {
			return '';
		}

		return $ratingStore.filters.sortDirection === 'desc' ? '↓' : '↑';
	}

	onMount(() => {
		ratingStore.loadPlayers();
		factionsStore.loadFactions();
	});
</script>

<svelte:head>
	<title>Rating | Dune Imperium</title>
	<meta
		name="description"
		content="Player rating leaderboard with season tabs, mode filters and sortable columns."
	/>
	<meta property="og:title" content="Rating | Dune Imperium" />
	<meta
		property="og:description"
		content="Season and mode-based leaderboard with sortable competitive metrics."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main rating-page">
	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title">
			<p class="eyebrow">Competitive Ladder</p>
			<h1>Rating</h1>
			<p class="rating-page__meta">
				Showing {$ratingStore.stats.visiblePlayers} of {$ratingStore.stats.totalPlayers} players. Average
				rating {$ratingStore.stats.averageRating}.
			</p>
		</div>

		<div class="surface rating-controls">
			<div>
				<h2>Season</h2>
				<div class="rating-tabs" role="tablist" aria-label="Season tabs">
					{#each $ratingStore.availableSeasons as season (season)}
						<button
							type="button"
							role="tab"
							aria-selected={$ratingStore.filters.season === season}
							class="rating-tab"
							class:is-active={$ratingStore.filters.season === season}
							onclick={() => ratingStore.setSeason(season)}
						>
							{seasonLabel(season)}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<h2>Mode</h2>
				<div class="rating-tabs" role="tablist" aria-label="Mode tabs">
					{#each modeTabs as mode (mode.id)}
						<button
							type="button"
							role="tab"
							aria-selected={$ratingStore.filters.mode === mode.id}
							class="rating-tab"
							class:is-active={$ratingStore.filters.mode === mode.id}
							onclick={() => ratingStore.setMode(mode.id)}
							title={mode.description}
						>
							{mode.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="rating-controls__sort">
				<Select
					id="rating-sort-field"
					label="Sort by"
					value={$ratingStore.filters.sortField}
					options={sortFieldOptions}
					onchange={(event) =>
						ratingStore.setSorting(
							(event.currentTarget as HTMLSelectElement).value as RatingSortField,
							$ratingStore.filters.sortDirection
						)}
				/>

				<Button
					size="sm"
					variant="secondary"
					onclick={() =>
						ratingStore.setSorting(
							$ratingStore.filters.sortField,
							$ratingStore.filters.sortDirection === 'desc' ? 'asc' : 'desc'
						)}
				>
					Direction: {$ratingStore.filters.sortDirection === 'desc' ? 'DESC' : 'ASC'}
				</Button>
			</div>
		</div>

		{#if $ratingStore.leaderboard.length === 0}
			<article class="surface rating-empty">
				<h2>No players in this view</h2>
				<p>Try switching mode or season.</p>
				<Button variant="secondary" onclick={() => ratingStore.resetFilters()}>Reset filters</Button>
			</article>
		{:else}
			<div class="surface rating-table-wrap">
				<table class="rating-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Player</th>
							<th>
								<button type="button" onclick={() => ratingStore.toggleSort('rating')}>
									Rating {sortIndicator('rating')}
								</button>
							</th>
							<th>
								<button type="button" onclick={() => ratingStore.toggleSort('wins')}>
									Wins {sortIndicator('wins')}
								</button>
							</th>
							<th>
								<button type="button" onclick={() => ratingStore.toggleSort('gamesPlayed')}>
									Games {sortIndicator('gamesPlayed')}
								</button>
							</th>
							<th>
								<button type="button" onclick={() => ratingStore.toggleSort('winRate')}>
									Win rate {sortIndicator('winRate')}
								</button>
							</th>
							<th>Faction</th>
						</tr>
					</thead>
					<tbody>
						{#each $ratingStore.leaderboard as player, index (player.id)}
							<tr>
								<td>{index + 1}</td>
								<td>
									<div class="rating-table__player">
										<strong>{player.nickname}</strong>
										<span>{player.season}</span>
									</div>
								</td>
								<td>{player.rating}</td>
								<td>{player.wins}</td>
								<td>{player.gamesPlayed}</td>
								<td>{formatWinRate(player.wins, player.gamesPlayed)}</td>
								<td>
									<Badge tone="neutral">
										<span
											class="rating-table__faction"
											style={`--faction-color: ${factionColorById.get(player.favoriteFaction) ?? '#f4cf8b'}`}
										>
											{factionNameById.get(player.favoriteFaction) ?? player.favoriteFaction}
										</span>
									</Badge>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
