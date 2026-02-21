import { writable } from 'svelte/store';

export const ratingStore = writable<unknown[]>([]);
