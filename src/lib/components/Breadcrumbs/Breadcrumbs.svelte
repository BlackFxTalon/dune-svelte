<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';

	const labelBySegment: Record<string, string> = {
		cards: 'Cards',
		leaders: 'Leaders',
		sets: 'Sets',
		rating: 'Rating',
		factions: 'Factions',
		faq: 'FAQ',
		news: 'News'
	};

	interface BreadcrumbItem {
		href: Pathname;
		label: string;
	}

	function toLabel(segment: string): string {
		const decodedSegment = decodeURIComponent(segment);
		return (
			labelBySegment[decodedSegment] ??
			decodedSegment
				.split('-')
				.filter(Boolean)
				.map((part) => part[0]?.toUpperCase() + part.slice(1))
				.join(' ')
		);
	}

	function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
		const segments = pathname.split('/').filter(Boolean);
		const breadcrumbs: BreadcrumbItem[] = [{ href: '/' as Pathname, label: 'Home' }];
		let currentPath = '';

		for (const segment of segments) {
			currentPath += `/${segment}`;
			breadcrumbs.push({
				href: currentPath as Pathname,
				label: toLabel(segment)
			});
		}

		return breadcrumbs;
	}

	const breadcrumbs = $derived(buildBreadcrumbs(page.url.pathname));
</script>

{#if breadcrumbs.length > 1}
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<ol class="container breadcrumbs__list">
			{#each breadcrumbs as breadcrumb, index (breadcrumb.href)}
				<li class="breadcrumbs__item">
					{#if index === breadcrumbs.length - 1}
						<span aria-current="page">{breadcrumb.label}</span>
					{:else}
						<a href={resolve(breadcrumb.href)}>{breadcrumb.label}</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style lang="scss">
	@use '../../../styles/mixins';
	@use '../../../styles/variables' as *;

	.breadcrumbs {
		padding-top: $spacing-md;
	}

	.breadcrumbs__list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: $spacing-xs;
		color: $color-text-secondary;
		font-size: $font-size-xs;
	}

	.breadcrumbs__item {
		display: inline-flex;
		align-items: center;
		gap: $spacing-xs;
	}

	.breadcrumbs__item:not(:last-child)::after {
		content: '/';
		color: rgba(244, 207, 139, 0.35);
	}

	.breadcrumbs a {
		color: $color-text-secondary;
		text-decoration: none;
		transition: color $duration-fast $ease-standard;
	}

	.breadcrumbs a:hover {
		color: $color-primary-light;
	}

	.breadcrumbs a:focus-visible {
		@include mixins.focus-ring;
	}

	.breadcrumbs [aria-current='page'] {
		color: $color-primary;
		font-weight: 600;
	}
</style>
