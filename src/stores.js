import { writable } from 'svelte/store';
import HomePage from "./svelte-components/HomePage.svelte"
import ProjectsPage from "./svelte-components/Projects.svelte"

export const current_page = writable(HomePage);