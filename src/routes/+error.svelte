<script lang="ts">
	import { Button } from '$lib/components';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page not found | Dune Imperium</title>
	<meta
		name="description"
		content="The requested page could not be found. Return to the home page or open the cards catalog."
	/>
	<meta property="og:title" content="Page not found | Dune Imperium" />
	<meta
		property="og:description"
		content="The requested page does not exist. Continue from the cards catalog or home page."
	/>
	<meta property="og:url" content={page.url.href} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="page-main error-page">
	<section class="container section">
		<article class="surface stack error-card">
			<p class="eyebrow">404</p>
			<h1>Page not found</h1>
			<p>
				The requested page does not exist or has been moved. Use one of the actions below to continue
				browsing.
			</p>
			<div class="error-card__actions">
				<Button onclick={() => goto(resolve('/cards'))}>Open cards catalog</Button>
				<Button variant="secondary" onclick={() => goto(resolve('/'))}>Go to home page</Button>
			</div>
		</article>
	</section>
</main>

<style lang="scss">
	@use '../styles/variables' as *;

	.error-page {
		display: grid;
		align-items: center;
	}

	.error-card {
		max-width: 38rem;
		margin-inline: auto;
		text-align: center;
		justify-items: center;
	}

	.error-card h1,
	.error-card p {
		margin: 0;
	}

	.error-card p {
		color: $color-text-secondary;
	}

	.error-card__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: $spacing-sm;
	}
</style>
