import { writable } from 'svelte/store';

export const factionsStore = writable<unknown[]>([]);
