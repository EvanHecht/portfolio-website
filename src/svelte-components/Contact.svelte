<script>

</script>

<style>

    @keyframes intro_animation{
        0% {
            opacity: 0%;
            transform: translateY(-10vw);
        }
        100% {
             opacity: 100%;
             transform: translateY(0vw);
        }
    }


    h1 {
        text-align: center;
        font-family: 'Secular One';
        font-size: 3.5vw;
        color: var(--palette-color-2);
        text-shadow: 0.5vw 0.5vw black;
        margin-bottom: 5vw;
        animation: forwards intro_animation .5s
    }

    h2 {
        text-align: center;
        font-family: 'Rubik';
        font-size: 2vw;
        color: var(--palette-color-2);
        text-shadow: 0.5vw 0.5vw black;
        margin-bottom: 5vw;
    }

    .green {
        color: var(--palette-color-4)
    }

    #contact_area {
        display: block;
        width: 70%;
        height: 100%;
        margin: 5vw auto;
        animation: forwards intro_animation .5s
    }

    h3 {
        font-size: 2vw;
        text-align: center;
        color: var(--palette-color-2);
        font-family: 'Rubik';
    }

    a {
        color: var(--palette-color-2);
    }


</style>

<h1><span class="green">[ </span> C O N T A C T <span class="green"> ]</span></h1>
<div id="contact_area">
    <h2>Feel free to contact me at any of the following:</h2>
    <h3><span class="green">EMAIL:</span> evanhecht01@gmail.com</h3>
    <h3><span class="green">PHONE:</span> (414)-336-8237</h3>
    <h3><span class="green">LINKEDIN: </span><a href="https://www.linkedin.com/in/hechtevan/">linkedin.com/in/hechtevan/</a></h3>
</div>
