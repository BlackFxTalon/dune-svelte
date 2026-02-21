<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Page not found</title>
</svelte:head>

<main class="page">
  <h1>Not found</h1>
  <p>The page does not exist.</p>
  <a href={resolve('/')}>Go home</a>
</main>
