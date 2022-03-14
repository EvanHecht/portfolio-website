<script>

</script>

<style>
    
    @keyframes appear-from-top {
        from {opacity: 0%;
              transform: translateY(-10rem);}
        to {opacity: 100%;
              transform: translateY(0rem);}
    }

    @keyframes appear-from-bottom {
        from {opacity: 0%;
              transform: translateY(10rem);}
        to {opacity: 100%;
              transform: translateY(0rem);}
    }

    @keyframes arrow-animation {
        
        0% {
            opacity: 0%;
        }
        10% {
            opacity: 100%;
            transform: translateY(0rem);
        }
        20% {
            opacity: 100%;
            transform: translateY(2rem);
        }
        30% {
            transform: translateY(0rem);
            opacity: 100%
        }
        40% {
            transform: translateY(2rem);
            opacity: 100%
        }
        50% {
            transform: translateY(0rem);
            opacity: 100%
        }
        60% {
            transform: translateY(2rem);
            opacity: 100%
        }
        70% {
            transform: translateY(0rem);
            opacity: 100%
        }
        80% {
            transform: translateY(2rem);
            opacity: 100%
        }
        90% {
            transform: translateY(0rem);
            opacity: 100%
        }
        100% {
            transform: translateY(2rem);
            opacity: 0%
        }
    }


    h1 {
        text-align: center;
        color: silver;
        font-family: "Rubik";
        font-weight: 1;
        font-size: 80px;
        margin: 8rem 0 0 0;
        opacity: 0;
        animation: appear-from-top 1s .5s forwards;
    }

    h2 {
        text-align: center;
        color: grey;
        font-family: "Rubik";
        font-weight: 1;
        font-size: 40px;
        margin: 0 0 2rem;
        opacity: 0;
        animation: appear-from-bottom 1s 1.5s forwards;

    }

    #arrow {
        width: 3%;
        image-rendering: crisp-edges;
        margin: 3rem 48.5%;
        opacity: 0;
        animation: arrow-animation 5s 2.5s forwards;
    }


</style>

<h1 id=title>Hi, I'm Evan</h1>
<h2>Thanks for stopping by</h2>
<img id=arrow src="resources/images/arrow.png" alt="arrow"/>

