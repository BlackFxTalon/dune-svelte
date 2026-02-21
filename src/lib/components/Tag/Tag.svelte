<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import cn from 'classnames';

	interface Props extends HTMLButtonAttributes {
		selected?: boolean;
		children?: Snippet;
	}

	let { selected = false, class: className, children, ...rest }: Props = $props();
</script>

<button class={cn('ui-tag', { 'is-selected': selected }, className)} type="button" {...rest}>
	{@render children?.()}
</button>

<style lang="scss">
	@use '../../../styles/mixins';
	@use '../../../styles/variables' as *;

	.ui-tag {
		display: inline-flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-sm $spacing-md;
		border-radius: $radius-pill;
		border: 1px solid rgba(244, 207, 139, 0.22);
		background: rgba(244, 207, 139, 0.06);
		color: $color-text-secondary;
		font-size: $font-size-sm;
		font-weight: 600;
		cursor: pointer;
		transition: all $duration-fast $ease-standard;
	}

	.ui-tag:hover {
		border-color: rgba(244, 207, 139, 0.44);
		color: $color-primary-light;
	}

	.ui-tag.is-selected {
		border-color: $color-primary;
		background: rgba(244, 207, 139, 0.16);
		color: $color-primary-light;
	}

	.ui-tag:focus-visible {
		@include mixins.focus-ring;
	}
</style>
