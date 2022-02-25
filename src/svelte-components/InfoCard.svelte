<script>

    // Props
    export let image_path;
    
    
    export let header;
    export let header_color;
    export let text;


    let container;

    function ShouldReveal(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    document.addEventListener('scroll', function(e) {
        if(ShouldReveal(container)) {
            container.style.opacity = '100%'
            container.style.transform = 'translateX(0rem)';
        } else {
        container.style.opacity = '0%'
        container.style.transform = 'translateX(-10rem)';
        }
    });

</script>

<style>

    #container {
        display: flex;
        background-color: var(--palette-color-2);
        height: fit-content;
        width: 80%;
        margin: 0 10% 8rem 10%;
        border-radius: 3rem;
        opacity: 0%;
        transform: translateX(-10rem);
        transition: 0.75s;
        padding: 1%;
        box-shadow: 0 1.5rem 1rem #000000c0;
        border-style:outset;
        border-radius: 3rem;
        border-width: .75rem;
        border-color: var(--palette-color-4);
    }

    #image {
        display: inline-block;
        height: 100%;
        border-radius: 3rem;

    }

    #text_area {
        flex-grow: 100;
        padding: 0;
        margin: 0 3rem;
        float: right;
        font-family: "Rubik";
        width: auto;

    }

    #header {
        text-align: center;
        float: right;
        width: 100%;
        font-size: 5rem;
        margin: 0 0 2rem 0;
        color: var(--palette-color-1);
    }

    #text {
        text-align: left;
        float: right;
        margin: 0;
        font-size: 2.4rem;
        color: var(--palette-color-1);
        line-height: 3.25rem;
    }

    a {
        color: var(--palette-color-2);
        display: inline-block;
        font-size: x-large;
        font-family: 'Rubik';
        text-decoration: none;
        height: 100%;
        padding: 0 1rem;
        border-radius: 1rem;
        border: 1rem;
        transition: 0.5s;
        opacity: 1;

    }

    a:hover {
        background-color: var(--palette-color-4);
        color: var(--palette-color-1);
        transform: translateX(-1rem);
    }

</style>

<div id=container bind:this={container}>
    <img id=image src={image_path} alt="card visual"/>
    <div id=text_area>
        <h1 id=header style="color: {header_color}"> {header} </h1>
        <p id=text> {@html text} </p>
    </div>
</div>