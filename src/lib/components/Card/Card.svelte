<script lang="ts">
	import type { Snippet } from 'svelte';
	import cn from 'classnames';

	interface Props {
		title?: string;
		description?: string;
		highlight?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { title, description, highlight = false, class: className, children }: Props = $props();
</script>

<article class={cn('ui-card', { 'is-highlight': highlight }, className)}>
	{#if title}
		<h3>{title}</h3>
	{/if}
	{#if description}
		<p>{description}</p>
	{/if}
	{@render children?.()}
</article>

<style lang="scss">
	@use '../../../styles/variables' as *;

	.ui-card {
		display: grid;
		gap: $spacing-sm;
		padding: $spacing-lg;
		border: 1px solid $color-border;
		border-radius: $radius-lg;
		background: linear-gradient(160deg, rgba(51, 35, 6, 0.95), rgba(22, 16, 8, 0.92));
		box-shadow: $shadow-card;
	}

	.ui-card h3 {
		margin: 0;
		font-size: $font-size-md;
	}

	.ui-card p {
		margin: 0;
		color: $color-text-secondary;
	}

	.ui-card.is-highlight {
		box-shadow: $shadow-glow;
		border-color: rgba(244, 207, 139, 0.55);
	}
</style>
