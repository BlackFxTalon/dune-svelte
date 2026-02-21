import { writable } from 'svelte/store';

export const setsStore = writable<unknown[]>([]);
