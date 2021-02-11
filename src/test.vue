<template>
  <div id="app">
    <button @click="toCanvas">html2canvas</button>
    <a href="">скачать</a>
    <input type="color" v-model="color">
     <div class="container_canvas" :style="{backgroundColor:color}">
      123
     </div>
  </div>
</template>

<script>

import html2canvas from "html2canvas";
export default {
  name: 'App',
  components: {
    
  },
  data() {
    return{
      color: "#000",
    }
  },
  methods: {
    toCanvas(){
        html2canvas(document.querySelector('.container_canvas'), {scale: 10, width: 2048, height: 1080}).then(function(canvas) {
        document.body.appendChild(canvas);
        const image = document.querySelector('canvas').toDataURL("image/png").replace("image/png", "image/octet-stream");
        const t = document.querySelector('a');
        t.setAttribute('download', 'your picture.png')
        t.setAttribute('href', image)
        });
    },
  },
  mounted(){

  }
}
</script>

<style>
canvas{
  border: 1px solid red;
}
.container_canvas{
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
