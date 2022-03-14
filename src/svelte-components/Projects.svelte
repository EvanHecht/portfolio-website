<script>
    import ProjectCard from "./ProjectCard.svelte";
</script>

<style>

    @keyframes intro_animation{
        0% {
            opacity: 0%;
            transform: translateY(-10rem);
        }
        100% {
             opacity: 100%;
             transform: translateY(0rem);
        }
    }


    h1 {
        text-align: center;
        font-family: 'Secular One';
        font-size: 3.5rem;
        color: var(--palette-color-2);
        text-shadow: 0.35rem 0.35rem black;
        margin-bottom: 7rem;
        animation: forwards intro_animation .5s
    }

    #ProjectGrid {
        width: 75%;
        height: fit-content;
        margin: 0 12.5% 50rem 12.5%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: max-content max-content max-content;
        gap: 7%;
    }

    .green {
        color: var(--palette-color-4)
    }

</style>

<h1><span class="green">[ </span>P R O J E C T S <span class="green"> ]</span></h1>
<div id="ProjectGrid">

    <ProjectCard
    title="GROMPULA"
    image_path="../resources/images/grompula_art.jpg"
    button_text="STEAM PAGE"
    button_path="https://store.steampowered.com/app/904500/Grompula/"
    project_description="A game I independently developed and published in 2018.
    I used the GameMaker: Studio 2 engine in tandum with their custom language, GML (similar to JavaScript).
    It is currently available for free on Steam."/>

    <ProjectCard
    title="PORTFOLIO SITE"
    image_path="../resources/images/portfolio_icon.png"
    button_text="GO TO REPO"
    button_path="https://github.com/EvanHecht/portfolio-website"
    project_description="The very website you are currently on! I made it using Node.js and the Svelte framework. This was my first
    project using Svelte and I am really enjoying it! You can take a look at this site's source code below."/>

    <ProjectCard
    title="TETRAGUN"
    image_path="../resources/images/tetragun_art.jpg"
    button_text="WATCH VIDEO"
    button_path="https://www.youtube.com/watch?v=Ck9jCnDNaOE"
    project_description="A top down shooter game where you play as a stationary turret. Each wave you survive you gain upgrades but so do your enemies. I've
    currently paused it's development but I intend to resume in the next few months."/>

    <ProjectCard
    title="OCTO TOWER"
    image_path="../resources/images/octo_tower.png"
    button_text="GO TO REPO"
    button_path="https://github.com/EvanHecht/Octo-Tower"
    project_description="A 'Rouge-Like' game I made inspired by Asteroids. Each level is randomly generated and contains randomized enemies and power-ups.
    It is more of a prototype than a finished game, but I am proud with how it turned out! I made this in 2019 using GameMaker: Studio 2 and GML."/>

    <ProjectCard
    title="FIGHT STYLE"
    image_path="../resources/images/skinny_genius.png"
    button_text="GO TO REPO"
    button_path="https://github.com/EvanHecht/Fight-Style"
    project_description="A small fighting game prototype I made in 2018. Two players fight each other using your character's four abilities. You can download
    and play it by visiting the repo."/>


    <ProjectCard
    title="CHIX 4 A CAUSE IOS APP"
    image_path="../resources/images/chix4acause_logo.png"
    button_text="VISIT"
    button_path="https://www.chix4acause.org/"
    project_description="An iOS app I worked on with my SDL team for school. Users can purchase gift boxes for loved ones struggling with cancer, or apply to be sent one. Was
    inherited by the next SDL team to continue development. You can visit the Chix 4 a Cause site below."
    />

    <ProjectCard
    title="RAIDER RUMBLE"
    image_path="../resources/images/raider_rumble_logo.png"
    button_text="MSOE SENIOR THESIS SITE"
    button_path="https://www.msoe.edu/academics/senior-project-showcase/"
    project_description="My Senior Thesis project currently in development. It is an MSOE themed platform fighting game that we are developing and building an arcade cabinet for.
    I serve as the lead gameplay programmer on a team of 4 other students. I am not allowed to share any code currently, but will once the project ends."
    />

    <ProjectCard
    title="CARROTS"
    image_path="../resources/images/carrot.png"
    button_text="GODOT GAME ENGINE"
    button_path="https://godotengine.org/"
    project_description="An investment simulator app I am currently developing using the Godot game engine. Players will be able to buy and sell simulated stocks.
    I would not like to reveal the source code as I plan to publish the game in the near future,
    and would not like to compromise the security of it's networking features."
    />


</div>