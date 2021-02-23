<template>
  <div id="app">
    <constructor></constructor>
  </div>
</template>

<script>
import constructor from './components//Constructor.vue'
export default {
  name: 'App',
  components: {
    constructor
  }
}
</script>

<style>
  @font-face {
    font-family: "Geometria";
    src: url("assets/fonts/Geometria.otf") format("woff2");
  }
  @font-face {
    font-family: "Geometria-Bold";
    src: url("assets/fonts/Geometria-Bold.ttf") format("woff2");
  }
  body{
    /* overflow: hidden; */
    padding: 0px;
    margin: 0px;
    font-family: 'Geometria';
  }
  *{
    box-sizing: border-box;
  }
  ul,ol{
    list-style: none;
    padding-left: 0px;
  }
  a[href^="http"]:empty::before {
    content: attr(href);
  }
  
</style>