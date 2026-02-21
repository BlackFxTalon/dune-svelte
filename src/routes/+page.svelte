<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Dune Svelte</title>
  <meta name="description" content="Dune Imperium fan site scaffold." />
</svelte:head>

<main class="page">
  <h1>Dune Imperium</h1>
  <p>Stage 0 scaffold is ready.</p>
  <nav aria-label="Primary sections">
    <ul>
      <li><a href={resolve('/cards')}>Cards</a></li>
      <li><a href={resolve('/leaders')}>Leaders</a></li>
      <li><a href={resolve('/sets')}>Sets</a></li>
      <li><a href={resolve('/rating')}>Rating</a></li>
      <li><a href={resolve('/factions')}>Factions</a></li>
      <li><a href={resolve('/faq')}>FAQ</a></li>
      <li><a href={resolve('/news')}>News</a></li>
    </ul>
  </nav>
</main>
