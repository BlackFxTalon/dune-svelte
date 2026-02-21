import { writable } from 'svelte/store';

export const leadersStore = writable<unknown[]>([]);
