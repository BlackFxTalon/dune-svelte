<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import cn from 'classnames';

	type Variant = 'primary' | 'secondary' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		block?: boolean;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		block = false,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<button
	class={cn('ui-button', `is-${variant}`, `is-${size}`, { 'is-block': block }, className)}
	{...rest}
>
	{@render children?.()}
</button>

<style lang="scss">
	@use '../../../styles/variables' as *;
	@use '../../../styles/mixins';

	.ui-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-sm;
		border: 1px solid transparent;
		border-radius: $radius-pill;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform $duration-fast $ease-standard,
			background-color $duration-fast $ease-standard,
			border-color $duration-fast $ease-standard,
			color $duration-fast $ease-standard;
	}

	.ui-button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.ui-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.ui-button:disabled {
		opacity: 0.56;
		cursor: not-allowed;
	}

	.ui-button.is-sm {
		min-height: 2.2rem;
		padding: 0 $spacing-md;
		font-size: $font-size-sm;
	}

	.ui-button.is-md {
		min-height: 2.7rem;
		padding: 0 $spacing-lg;
		font-size: $font-size-base;
	}

	.ui-button.is-lg {
		min-height: 3rem;
		padding: 0 $spacing-xl;
		font-size: $font-size-md;
	}

	.ui-button.is-primary {
		background: linear-gradient(180deg, $color-primary-light, $color-primary);
		color: #261704;
		box-shadow: $shadow-glow;
	}

	.ui-button.is-primary:hover:not(:disabled) {
		background: linear-gradient(180deg, #fff0c9, #f6d596);
	}

	.ui-button.is-secondary {
		border-color: $color-border;
		background: rgba(244, 207, 139, 0.1);
		color: $color-primary-light;
	}

	.ui-button.is-secondary:hover:not(:disabled) {
		background: rgba(244, 207, 139, 0.18);
	}

	.ui-button.is-ghost {
		border-color: transparent;
		color: $color-text-secondary;
	}

	.ui-button.is-ghost:hover:not(:disabled) {
		border-color: $color-border;
		color: $color-primary-light;
	}

	.ui-button.is-block {
		display: flex;
		width: 100%;
	}

	.ui-button:focus-visible {
		@include mixins.focus-ring;
	}
</style>
