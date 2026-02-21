<footer class="site-footer">
	<div class="container site-footer__inner">
		<p>Dune Imperium fan project scaffold.</p>
		<small>Stage 1: design system foundation</small>
	</div>
</footer>

<style lang="scss">
	@use '../../../styles/variables' as *;

	.site-footer {
		border-top: 1px solid rgba(244, 207, 139, 0.18);
		background: rgba(26, 18, 6, 0.7);
	}

	.site-footer__inner {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-sm;
		align-items: center;
		justify-content: space-between;
		padding-block: $spacing-lg;
		color: $color-text-secondary;
	}
</style>
