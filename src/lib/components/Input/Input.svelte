<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import cn from 'classnames';

	interface Props extends HTMLInputAttributes {
		label?: string;
		hint?: string;
		error?: string;
	}

	let { label, hint, error, class: className, ...rest }: Props = $props();
</script>

<div class="ui-field">
	{#if label}
		<label class="ui-field__label" for={rest.id}>
			{label}
		</label>
	{/if}

	<input class={cn('ui-input', { 'has-error': Boolean(error) }, className)} {...rest} />

	{#if error}
		<small class="ui-field__error">{error}</small>
	{:else if hint}
		<small class="ui-field__hint">{hint}</small>
	{/if}
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

	.ui-input {
		min-height: 2.75rem;
		padding: 0 $spacing-md;
		border: 1px solid rgba(244, 207, 139, 0.25);
		border-radius: $radius-md;
		background: rgba(10, 8, 4, 0.7);
		color: $color-text-primary;
		transition: border-color $duration-fast $ease-standard;
	}

	.ui-input::placeholder {
		color: $color-text-secondary;
	}

	.ui-input:hover {
		border-color: rgba(244, 207, 139, 0.5);
	}

	.ui-input:focus-visible {
		@include mixins.focus-ring;
	}

	.ui-input.has-error {
		border-color: rgba(196, 30, 58, 0.66);
	}

	.ui-field__hint {
		color: $color-text-secondary;
	}

	.ui-field__error {
		color: #ffbdc7;
	}
</style>
