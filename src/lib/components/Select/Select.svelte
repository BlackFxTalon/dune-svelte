<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import cn from 'classnames';

	interface Option {
		label: string;
		value: string;
	}

	interface Props extends HTMLSelectAttributes {
		label?: string;
		options?: Option[];
	}

	let { label, options = [], class: className, ...rest }: Props = $props();
</script>

<div class="ui-field">
	{#if label}
		<label class="ui-field__label" for={rest.id}>
			{label}
		</label>
	{/if}

	<div class="ui-select-wrap">
		<select class={cn('ui-select', className)} {...rest}>
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<span class="ui-select-wrap__arrow" aria-hidden="true">&#9662;</span>
	</div>
</div>

<style lang="scss">
	@use '../../../styles/mixins';
	@use '../../../styles/variables' as *;

	.ui-field {
		display: grid;
		gap: $spacing-xs;
	}

	.ui-field__label {
		font-size: $font-size-sm;
		font-weight: 600;
		color: $color-text-primary;
	}

	.ui-select-wrap {
		position: relative;
	}

	.ui-select-wrap__arrow {
		position: absolute;
		top: 50%;
		right: $spacing-md;
		transform: translateY(-50%);
		pointer-events: none;
		color: $color-primary;
		font-size: $font-size-sm;
	}

	.ui-select {
		width: 100%;
		min-height: 2.75rem;
		padding: 0 calc(#{$spacing-xl} + #{$spacing-xs}) 0 $spacing-md;
		border: 1px solid rgba(244, 207, 139, 0.25);
		border-radius: $radius-md;
		background: rgba(10, 8, 4, 0.7);
		color: $color-text-primary;
		appearance: none;
		transition: border-color $duration-fast $ease-standard;
	}

	.ui-select:hover {
		border-color: rgba(244, 207, 139, 0.5);
	}

	.ui-select:focus-visible {
		@include mixins.focus-ring;
	}
</style>
