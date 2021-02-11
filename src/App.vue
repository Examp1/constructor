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
  body{
    overflow: hidden;
    padding: 0px;
    margin: 0px;
    font-family: sans-serif;
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