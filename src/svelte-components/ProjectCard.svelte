<script>
    
    import { onMount } from "svelte"
    
    export let title = "PROJECT TITLE"
    export let image_path = "./resources/images/octo_tower.png"
    export let project_description = "This is the project description, its super long and im just trying to take up space with all of these words "
    export let button_text = "DOWNLOAD"
    export let button_path = "https://www.google.com/"//"../resources/downloads/carrots_app.zip"

    let button

    onMount(async () => {

        
            button.innerHTML = button_text
            button.onclick = () => {window.location.href = button_path}

    })


</script>

<style>

    @keyframes intro_animation{
        0% {
            opacity: 0%;
            transform: translateY(10rem);
        }
        100% {
            opacity: 100%;
            transform: translateY(0rem);
        }
    }

    #Container {
        background-color: var(--palette-color-3);
        height: fit-content;
        max-height: 55rem;
        margin: 0;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: 1fr 2fr 2fr 1fr;
        border-radius: 3rem 3rem;
        padding: 2.5%;
        box-shadow: 0 1.5rem 1rem;
        border-style: outset;
        border-radius: 3rem;
        border-width: .25rem;
        border-color: var(--palette-color-4);
        animation: forwards intro_animation .5s;
        padding-bottom: 1rem;
        min-height: 100%;
    }

    #Header {
        text-align: center;
        font-family: 'Rubik';
        color: var(--palette-color-2);
        font-weight: bold;
        font-size: 3.25rem;
        grid-row: 1;
        margin: auto;
    }

    #Image {
        grid-row: 2;
        grid-column: 1;
        max-width:100%;
        width: auto;
        height: auto;
        margin: auto;
        padding-bottom: 5%;
        padding-top: 5%;
        border-radius: 3rem;
    }

    #Text {
        grid-row: 3;
        grid-column: 1;
        text-align: center;
        font-family: 'Rubik';
        color: var(--palette-color-2);
        font-size: 1.7rem;
        margin: auto;

    }

    #Button {
        grid-row: 4;
        grid-column: 1;
        height: 90%;
        width: 90%;
        margin: auto;
        border-radius: 2rem;
        background-color: var(--palette-color-4);
        font-size: 2rem;
        font-family: 'Rubik';
        transition: .35s;
        border-style:solid;
        border-color: var(--palette-color-3);
    }

    #Button:hover {
        color: var(--palette-color-2);
        border-style:solid;
        border-width: 1rem;
        border-color: var(--palette-color-3);
        width: 70%;
        cursor: pointer;
    }

</style>

<div id="Container">
    <h1 id="Header">{title}</h1>
    <img id="Image" src={image_path} alt="Project Art"/>
    <p id="Text">{project_description}</p>
    <button id=Button bind:this={button}></button>
</div>