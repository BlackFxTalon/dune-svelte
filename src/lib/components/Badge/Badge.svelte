<script lang="ts">
	import type { Snippet } from 'svelte';
	import cn from 'classnames';

	type Tone = 'neutral' | 'primary' | 'danger' | 'info';

	interface Props {
		tone?: Tone;
		class?: string;
		children?: Snippet;
	}

	let { tone = 'neutral', class: className, children }: Props = $props();
</script>

<span class={cn('ui-badge', `is-${tone}`, className)}>
	{@render children?.()}
</span>

<style lang="scss">
	@use '../../../styles/variables' as *;

	.ui-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem $spacing-sm;
		border-radius: $radius-pill;
		font-size: $font-size-xs;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		border: 1px solid transparent;
	}

	.ui-badge.is-neutral {
		color: $color-text-secondary;
		background: rgba(168, 152, 120, 0.12);
		border-color: rgba(168, 152, 120, 0.3);
	}

	.ui-badge.is-primary {
		color: #261704;
		background: linear-gradient(180deg, $color-primary-light, $color-primary);
		border-color: rgba(244, 207, 139, 0.7);
	}

	.ui-badge.is-danger {
		color: #ffd7de;
		background: rgba(196, 30, 58, 0.2);
		border-color: rgba(196, 30, 58, 0.55);
	}

	.ui-badge.is-info {
		color: #d8ebff;
		background: rgba(74, 144, 217, 0.2);
		border-color: rgba(74, 144, 217, 0.55);
	}
</style>
