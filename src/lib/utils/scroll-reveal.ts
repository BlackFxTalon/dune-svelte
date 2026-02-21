interface ScrollRevealOptions extends IntersectionObserverInit {
	once?: boolean;
	revealClass?: string;
}

export function useScrollReveal(
	node: HTMLElement,
	{
		threshold = 0.14,
		root = null,
		rootMargin = '0px',
		once = true,
		revealClass = 'is-visible'
	}: ScrollRevealOptions = {}
) {
	if (typeof window === 'undefined') {
		return {};
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add(revealClass);
		return {};
	}

	if (!('IntersectionObserver' in window)) {
		node.classList.add(revealClass);
		return {};
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) {
				return;
			}

			node.classList.add(revealClass);
			if (once) {
				observer.disconnect();
			}
		},
		{
			threshold,
			root,
			rootMargin
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
