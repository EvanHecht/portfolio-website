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
image_path="resources/images/picture_of_me.jpg"
header="Welcome to my Site!" 
text = "My name is Evan Hecht. I am a senior at the Milwaukee School of Engineering, where I am currently pursing
a bachelor's degree in Software Engineering. I built this site using Node.js and the Svelte framework, and intend to use it as a hub to display all
of my work. I enjoy programming both inside and outside of school, and you can take a look at what I've been up to under the
<a style='{in_text_link_style}' href=''><b>Projects</b></a>
tab. Alternatively, continue scrolling down to learn more about me."/>

<InfoCard 
image_path="resources/images/picture_of_me.jpg"
header="Welcome to my Site!" 
text = "My name is Evan Hecht. I am a senior at the Milwaukee School of Engineering where I am currently pursuing
a bachelor's degree in Software Engineering. I built this site using Node.js and the Svelte framework, and intend to use it as a hub to display all
of my work. I enjoy programming both inside and outside of school, and you can take a look at what I've been up to under the
<a style='{in_text_link_style}' href=''><b>Projects</b></a>
tab. Alternatively, you can continue scrolling down to learn more about me."/>
