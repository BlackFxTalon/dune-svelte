<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Page not found</title>
</svelte:head>

<main class="page-main">
	<section class="container section">
		<article class="surface stack">
			<p class="eyebrow">404</p>
			<h1>Page not found</h1>
			<p>The page does not exist.</p>
			<a href={resolve('/')}>Go home</a>
		</article>
	</section>
</main>
