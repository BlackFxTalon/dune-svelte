<script lang="ts">
	import { Footer, Header } from '$lib/components';

	import '../styles/global.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

<div class="app-shell">
	<Header />
	{@render children()}
	<Footer />
</div>

<style lang="scss">
	.app-shell {
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
