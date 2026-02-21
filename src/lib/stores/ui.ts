import { writable } from 'svelte/store';

export const uiStore = writable<unknown[]>([]);
