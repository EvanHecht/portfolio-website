<script>
    import NavBar from "./svelte-components/NavBar.svelte";
    import TitleSequence from "./svelte-components/TitleSequence.svelte";
    import InfoCard from "./svelte-components/InfoCard.svelte"

    let in_text_link_style = 'text-decoration: none; color: var(--palette-color-1); transition: 1s; background-color: var(--palette-color-4); border-radius: 1rem; padding: .25rem'

</script>

<style>
 
</style>

<NavBar/>
<div style="height: 20rem"></div>
<TitleSequence/>
<div style="height: 10rem"></div>

<InfoCard
image_paths="resources/images/picture_of_me.jpg"
header="Welcome to my Site!" 
text = "My name is Evan Hecht. I am a senior at the Milwaukee School of Engineering where I am currently pursing
a bachelor's degree in Software Engineering. I built this site using Node.js and the Svelte framework, and intend to use it as a hub to display all
of my work. I enjoy programming both inside and outside of school, and you can take a look at what I've been up to under the
<a style='{in_text_link_style}' href=''><b>Projects</b></a>
tab. Alternatively, continue scrolling down to learn more about me."/>

<InfoCard
image_paths="resources/images/young_me.jpg"
header="As a Kid" 
text = "As a kid, when I wasn't rocking those sweet shades, I was most likely playing video games. For equally as long, I've been intrigued with how they worked. This curiosity is what
initially steered me towards computer science. My parents got me my first laptop when I was 10 and for better or worse, I've had unrestricted access to the
internet since. Right away I wanted to learn about programming, but it was a bit daunting of a task for 10 year old me. Lucky for me, a small game called Minecraft came out around the same time.
It allowed for the creation of custom maps within the game which I utilized extensively."/>

<InfoCard
header="High School" 
image_paths="resources/images/faze_crew.jpg resources/images/grompula_art.jpg"
text = "High school is where I really began pursuing computer science in a more serious way. I took all of the available computer science and programming courses, and even attended programming competitions.
The instructor for these classes really encouraged us to pursue what we were interested in and gave us the class periods to do whatever we wanted, granted it was CS related. I chose to learn more
about game development, and began messing with the GameMaker: Studio game engine. I would make small projects that would focus on a specific area of game dev that I wanted to learn about.
One of these projects was a 2d wave-based shooter game I called 'Grompula'. During my senior year I would revisit this project and begin to expand upon it. I ended up working on it through the summer between high school
and college, often for 12+ hours a day. I eventually published it to Steam, where it is currently available to play for free. While its nothing groundbreaking, its humbling to look back upon and see
how much I've learned since, and is one of my favorite projects made to this date. You can check it out under the 
<a style='{in_text_link_style}' href=''><b>Projects</b></a>
tab if you are interested.
"
/>

<InfoCard
header="College (Present day)" 
text = "After my exposure to programming in high school, I was confident that I wanted to pursue programming as a career. At the time, my brother was attending a nearby university called
The Milwaukee School of Engineering, or MSOE for short. I decided I would apply to their Software Engineering program, and I was accepted. I shared a dorm with a friend from high school until
Covid hit, and since then have been living off campus near the school.Throughout my time here, I've learned more about software engineering that I ever expected to, and I believe it has more
than adequately prepared for my future career. I continue to work on projects (mostly games) in my free time, and I am as eagar to continue as I was when I first began."/>
