import { writable } from 'svelte/store';

export const newsStore = writable<unknown[]>([]);
