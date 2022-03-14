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
        console.log(paths_list)
        if(paths_list.length == 0) { 
            text_area.style.gridColumnStart = '1'
            header_ref.style.gridColumnStart = '1'
            text_area.style.textAlign = 'center'
            console.log("bruh")
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
        grid-template-rows: auto auto;
        grid-template-columns: fit-content(25%) fit-content(75%);
        background-color: var(--palette-color-3);
        gap: 1rem;
        padding: 1rem;
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
        overflow: hidden;
    }

    #header {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 2;
        grid-column-end: 3;
        min-width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: "Secular One";
        text-align: center;
        font-size: 500%;
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
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 2;
        grid-column-end: 3;
        font-family: "Rubik";
        text-align: left;
        width: 100%;
        font-size: 2.4rem;
        color: var(--palette-color-2);
        line-height: 3.25rem;
        margin: 0;
        vertical-align: top;
    }

</style>

<div id=container bind:this={container}>
    <h1 id=header style="color: {header_color}" bind:this={header_ref}> {header} </h1>
        <div id=image_area bind:this={image_area}> </div>
        <div id=text_area bind:this={text_area}> {@html text}</div>
</div>