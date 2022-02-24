<script>

let container;
let is_visible;

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom - rect.height/2 <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


//is_visible = isInViewport(container);

document.addEventListener('scroll', function(e) {
    is_visible = isInViewport(container)
    console.log("Visible: " + is_visible)
    console.log(typeof container)
    if(typeof container !== "undefined" && is_visible) {
        container.style.animation = 'appear 1s 0s forwards'
    }

    else if(typeof container !== "undefined" && !is_visible) {
        container.style.animation = 'disappear 1s 0s forwards'
    }
});




</script>

<style>
    
    @keyframes appear {
        from {
            opacity: 0%
        }
        to {
            opacity: 100%
        }
    }

    @keyframes disappear {
        from {
            opacity: 100%
        }
        to {
            opacity: 0%
        }
    }


    #container {
        background-color: var(--palette-color-2);
        height: 30rem;
        width: 80%;
        margin: 0 10%;
        border-radius: 3rem;

    }

</style>

<div id=container bind:this={container}>

</div>