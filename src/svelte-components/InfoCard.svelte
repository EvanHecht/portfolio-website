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

    let resizeCard = function() {
        let new_size = container.clientHeight//container.clientHeight
        image_area.style.maxWidth = (new_size).toString() + 'px'

    }

    onMount(async () => {

        resizeCard();

        // Add images
        paths_list.forEach(element => {
                
                // If there is at least 1 image, resize the image area
                container.style.background_color = "blue"
                container.style.gap = "0 1rem";
                console.log(container)
                let img = document.createElement('img')
                img.src = element
                img.classList.add('image')
                image_area.appendChild(img)
            });
        

    });

    window.onresize = function() {
        resizeCard()
    }

    function ShouldReveal(element) {
        const rect = element.getBoundingClientRect()
        return (
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }

    document.addEventListener('scroll', function(e) {
        if(ShouldReveal(container)) {
            container.style.opacity = '100%'
            container.style.transform = 'translateX(0rem)'
        } else {
        container.style.opacity = '0%'
        container.style.transform = 'translateX(-10rem)'
        }
    })

</script>

<style>

    #container {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr;
        gap: 1rem 1rem;
        background-color: var(--palette-color-2);
        width: 80%;
        margin: 0 10% 8rem 10%;
        border-radius: 3rem;
        opacity: 0%;
        transform: translateX(-10rem);
        transition: 0.75s;
        box-shadow: 0 1.5rem 1rem #000000c0;
        border-style:outset;
        border-radius: 3rem;
        border-width: .5rem;
        border-color: var(--palette-color-4);
        font-size: 100%;
        padding: 1rem;
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
        text-align: left;
        font-size: 500%;
        margin: 0;
        padding: 0 0 0 1rem;
        color: var(--palette-color-1);
        font-weight: lighter;
    }

    #image_area {
        grid-row-start: 1;
        grid-row-end: 3;
        grid-column-start: 1;
        grid-column-end: 2;
        margin: auto;
    }

    #text_area {
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 2;
        grid-column-end: 3;
        font-family: "Rubik";
        height: fit-content;
        max-height: fit-content;
        text-align: left;
        width: 100%;
        font-size: 2.4rem;
        color: var(--palette-color-1);
        line-height: 3.25rem;
        vertical-align: top;
        margin: 0;
        padding: 0rem 1rem;
    }

</style>

<div id=container bind:this={container}>
    <h1 id=header style="color: {header_color}" bind:this={header_ref}> {header} </h1>
        <div id=image_area bind:this={image_area}> </div>
        <div id=text_area bind:this={text_area}> {@html text} </div>
</div>