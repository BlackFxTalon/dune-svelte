<script lang="ts">
	import cn from 'classnames';

	interface TabItem {
		id: string;
		label: string;
	}

	interface Props {
		items: TabItem[];
		active?: string;
		class?: string;
		onChange?: (id: string) => void;
	}

	let { items, active, class: className, onChange }: Props = $props();
	let internalActive = $derived(active ?? items[0]?.id ?? '');

	function selectTab(id: string) {
		internalActive = id;
		onChange?.(id);
	}
</script>

<div class={cn('ui-tabs', className)} role="tablist" aria-label="Tabs">
	{#each items as item (item.id)}
		<button
			class="ui-tabs__tab"
			class:is-active={internalActive === item.id}
			role="tab"
			aria-selected={internalActive === item.id}
			onclick={() => selectTab(item.id)}
			type="button"
		>
			{item.label}
		</button>
	{/each}
</div>

<style lang="scss">
	@use '../../../styles/mixins';
	@use '../../../styles/variables' as *;

	.ui-tabs {
		display: inline-flex;
		flex-wrap: wrap;
		gap: $spacing-sm;
		padding: $spacing-xs;
		border: 1px solid rgba(244, 207, 139, 0.2);
		border-radius: $radius-pill;
		background: rgba(10, 8, 4, 0.62);
	}

	.ui-tabs__tab {
		padding: $spacing-sm $spacing-md;
		border-radius: $radius-pill;
		color: $color-text-secondary;
		font-size: $font-size-sm;
		font-weight: 600;
		cursor: pointer;
		transition: all $duration-fast $ease-standard;
	}

	.ui-tabs__tab:hover {
		color: $color-primary-light;
	}

	.ui-tabs__tab.is-active {
		color: #261704;
		background: linear-gradient(180deg, $color-primary-light, $color-primary);
		box-shadow: 0 10px 22px -16px rgba(244, 207, 139, 0.9);
	}

	.ui-tabs__tab:focus-visible {
		@include mixins.focus-ring;
	}
</style>
