<script lang="ts">
  import '../styles/global.scss';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

{@render children()}