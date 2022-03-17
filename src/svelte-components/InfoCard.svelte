<script>

    import { onMount } from 'svelte';

    // Props
    export let image_paths
    export let header
    export let header_color
    export let text

    let container
    let header_ref
    let image_area
    let text_area
    

    let paths_list = []
    if(typeof image_paths != "undefined") {
        paths_list = image_paths.split(" ")
    }

    onMount(async () => {
        if(paths_list.length == 0) { 
            text_area.style.gridColumnStart = '1'
            header_ref.style.gridColumnStart = '1'
            text_area.style.textAlign = 'center'
        }

        // Add images
        let i = 1
        paths_list.forEach(element => {
                
                // If there is at least 1 image, resize the image area
                let img = document.createElement('img')
                img.src = element
                img.classList.add('image')
                if(i < paths_list.length) img.style.marginBottom = '1rem'
                image_area.appendChild(img)
                i++
            });
        

    });

    document.addEventListener('scroll', function(e) {
        if(ShouldReveal(container)) {
            container.style.opacity = '100%'
            container.style.transform = 'translateX(0rem)'
        } else if(container !== null) {
        container.style.opacity = '0%'
        container.style.transform = 'translateX(-10rem)'
        }
    })

    function ShouldReveal(element) {
        if (element == null) return null
    	const rect = element.getBoundingClientRect();
    	return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }

</script>

<style>

    #container {
        display: grid;
        grid-template-rows: min-content auto;
        grid-template-columns: fit-content(25%) fit-content(75%);
        background-color: var(--palette-color-3);
        gap: 1vw;
        padding: 1vw;
        width: 80%;
        margin: 0 10% 8vw 10%;
        border-radius: 3vw;
        opacity: 0%;
        transform: translateX(-10rem);
        transition: 0.75s;
        box-shadow: 0 1.5vw 1vw #000000c0;
        border-style: outset;
        border-radius: 3vw;
        border-width: .5vw;
        border-color: var(--palette-color-4);
        overflow: hidden;
    }

    #header {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 2;
        grid-column-end: 3;
        min-width: 100%;
        height: fit-content;
        overflow: hidden;
        font-family: "Secular One";
        text-align: center;
        font-size: 3vw;
        margin: 0;
        color: var(--palette-color-2);
        font-weight: lighter;
    }

    #image_area {
        grid-row-start: 1;
        grid-row-end: 3;
        grid-column-start: 1;
        grid-column-end: 2;
        width: 100%;
        margin: auto;
    }

    #text_area {
        display: inline;
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 2;
        grid-column-end: 3;
        font-family: "Rubik";
        text-align: left;
        width: 100%;
        font-size: 1.75vw;
        color: var(--palette-color-2);
        margin: 0;
        vertical-align: top;
        line-height: 2vw;
    }

</style>

<div id=container bind:this={container}>
    <h1 id=header style="color: {header_color}" bind:this={header_ref}> {header} </h1>
        <div id=image_area bind:this={image_area}> </div>
        <div id=text_area bind:this={text_area}> {@html text}</div>
</div>