import { derived, writable } from 'svelte/store';

interface UIState {
	isMobileMenuOpen: boolean;
	isFiltersPanelOpen: boolean;
	activeCardId: number | null;
}

const defaultState: UIState = {
	isMobileMenuOpen: false,
	isFiltersPanelOpen: false,
	activeCardId: null
};

export function createUIStore(initialState: UIState = defaultState) {
	const state = writable<UIState>({ ...initialState });

	const snapshot = derived(state, ($state) => $state);

	return {
		subscribe: snapshot.subscribe,
		openMobileMenu() {
			state.update((current) => ({ ...current, isMobileMenuOpen: true }));
		},
		closeMobileMenu() {
			state.update((current) => ({ ...current, isMobileMenuOpen: false }));
		},
		toggleMobileMenu() {
			state.update((current) => ({ ...current, isMobileMenuOpen: !current.isMobileMenuOpen }));
		},
		openFiltersPanel() {
			state.update((current) => ({ ...current, isFiltersPanelOpen: true }));
		},
		closeFiltersPanel() {
			state.update((current) => ({ ...current, isFiltersPanelOpen: false }));
		},
		toggleFiltersPanel() {
			state.update((current) => ({ ...current, isFiltersPanelOpen: !current.isFiltersPanelOpen }));
		},
		openCardModal(cardId: number) {
			state.update((current) => ({ ...current, activeCardId: cardId }));
		},
		closeCardModal() {
			state.update((current) => ({ ...current, activeCardId: null }));
		},
		reset() {
			state.set({ ...defaultState });
		}
	};
}

export const uiStore = createUIStore();
