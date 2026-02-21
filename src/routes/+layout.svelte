<script lang="ts">
	import { Breadcrumbs, Footer, Header } from '$lib/components';

	import { page } from '$app/state';

	import '../styles/global.scss';

	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:title" content="Dune Imperium Fan Site" />
	<meta
		property="og:description"
		content="Cards, leaders, sets, ratings and news for Dune Imperium players."
	/>
	<meta property="og:site_name" content="Dune Imperium Fan Site" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
	<link rel="icon" href="/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

<div class="app-shell">
	<a class="skip-link" href="#main-content">Skip to content</a>
	<Header />
	<Breadcrumbs />
	<div id="main-content" tabindex="-1">
		{@render children()}
	</div>
	<Footer />
</div>

<style lang="scss">
	@use '../styles/mixins';
	@use '../styles/variables' as *;

	.app-shell {
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}

	.skip-link {
		position: absolute;
		top: -3rem;
		left: $spacing-md;
		z-index: 90;
		padding: $spacing-sm $spacing-md;
		border-radius: $radius-md;
		background: $color-primary-light;
		color: #261704;
		font-weight: 700;
		text-decoration: none;
		transition: top $duration-fast $ease-standard;
	}

	.skip-link:focus {
		top: $spacing-sm;
		@include mixins.focus-ring;
	}
</style>
