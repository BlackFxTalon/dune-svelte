export function useScrollReveal(
  node: HTMLElement,
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      node.classList.add('visible');
      observer.disconnect();
    }
  }, options);

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}