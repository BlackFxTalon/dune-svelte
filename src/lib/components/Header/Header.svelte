<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import './Header.scss';

	const navItems = [
		{ href: '/cards', label: 'Cards' },
		{ href: '/leaders', label: 'Leaders' },
		{ href: '/sets', label: 'Sets' },
		{ href: '/rating', label: 'Rating' }
	] as const;
</script>

<header class="site-header">
	<div class="container site-header__inner">
		<a class="site-header__brand" href={resolve('/')}>
			<span class="site-header__brand-mark" aria-hidden="true">DI</span>
			<span>Dune Imperium</span>
		</a>

		<nav aria-label="Primary" class="site-header__nav">
			{#each navItems as item (item.href)}
				<a
					class="site-header__link"
					class:is-active={page.url.pathname === item.href}
					href={resolve(item.href)}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>
</header>
