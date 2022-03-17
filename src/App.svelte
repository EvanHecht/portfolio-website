<script>

    // Modules
    import {onMount} from 'svelte'
    import { writable } from 'svelte/store';
    import {current_page} from './stores.js'


    // Svelte Components
    import NavBar from "./svelte-components/NavBar.svelte";
    import HomePage from "./svelte-components/HomePage.svelte"
    import TitleSequence from "./svelte-components/TitleSequence.svelte";
    import InfoCard from "./svelte-components/InfoCard.svelte"
    import Projects from "./svelte-components/Projects.svelte"

    // Styles
    let in_text_link_style = 'text-decoration: none; color: var(--palette-color-1); transition: 1s; background-color: var(--palette-color-4); border-radius: 1rem; padding: .25rem'

    let page = current_page
    current_page.subscribe(value => {
        page = value
    })


</script>

<style>
 
</style>


<NavBar bind:page={page}/>
<div style="height: 8vh"></div>
<svelte:component id="PageComponent" this={page}/>
