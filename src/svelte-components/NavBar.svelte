<script>
    import {current_page} from "../stores.js"
    import {onMount} from "svelte"
    import HomePage from "./HomePage.svelte"
    import ProjectsPage from "./Projects.svelte"
    import ContactPage from "./Contact.svelte"

    onMount(async () => {
        document.getElementById("HomeLink").onclick = ()=> {
            window.scrollTo(0, 0)
            current_page.set(HomePage)  
            return false
        }

        document.getElementById("ProjectsLink").onclick = ()=> {
            window.scrollTo(0, 0)
            current_page.set(ProjectsPage)
            return false
        }


        document.getElementById("ContactLink").onclick = ()=> {
            window.scrollTo(0, 0)
            current_page.set(ContactPage)
            return false
        }

    })


    document.addEventListener('scroll', function(e) {
        console.log(window.scrollY)
        if (window.scrollY > 0) {
            document.getElementById("container").style.backgroundColor = "var(--palette-color-3)"
        }

        else if (window.scrollY == 0) {
            document.getElementById("container").style.backgroundColor = "transparent"
        }

    });
    

</script>

<style>

    @keyframes appear-from-top {
        from {opacity: 0%;
              transform: translateY(-5rem);}
        to {opacity: 100%;
              transform: translateY(0rem);}
    }

    @keyframes appear-from-left {
        from {opacity: 0%;
              transform: translateX(-10rem);}
        to {opacity: 100%;
              transform: translateX(0rem);}
    }

    #container {
        width: 100%;
        position: fixed;
        z-index: 10;
        transition: .5s;
    }
    ul {
        list-style-type: none;
        overflow: hidden;
        text-align: right;
        height: 4rem;
        line-height: 4rem;
        padding: 0.5rem 0 0.5rem 0;
    }
    li {
        display: inline-block;
        height: 100%;
        padding: 0rem 1rem;
        opacity: 0;

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
    
    img {
        display: inline-block;
        height: 100%;
    }

    #logo {
        float: left;
        padding-left: 1rem;
        animation: appear-from-left 0.5s 0s forwards;
    }

    #link_1 {
        animation: appear-from-top 0.5s 0s forwards;
    }

    #link_2 {
        animation: appear-from-top 0.5s 0.1s forwards;
    }

    #link_3 {
        animation: appear-from-top 0.5s 0.2s forwards;
    }

</style>

<div id=container>
<ul>
    <li id=logo><img src="resources/images/EvanHecht.png" alt="Greeb Games logo"></li>
    <li id=link_1><a id="HomeLink" href="#">HOME</a></li>
    <li id=link_2><a id="ProjectsLink" href="#">PROJECTS</a></li>
    <li id=link_3><a id="ContactLink" href="#">CONTACT</a></li>
</ul>
</div>

