<template>
  <div class="left">
    <ul class="tab__header">
        
      <li v-for="(item, index) in tabsH" :key="index" @click="tabClick($event, index)">
        {{ item.name }}
      </li>
    </ul>
    <ul class="tab__content">
      <li v-for="(option, index) in currentTab" :key="index" draggable="true" @dragstart="onDragStart($event, index)" @drag="onDrag" @dragend="onDragEnd">
        {{ option.name }}
        <img :src="option.src" alt="" />
        <!-- <img src="../assets/igor.jpg" alt=""> -->
      </li>
    </ul>
    
    <div class="dragImgDiv" v-if="isDrag">
      <img :src="decoSrc" :style="dragImgStyle" alt="1" :class="{active: dragOvered}">
    </div>
  </div>
</template>

<script>
import Bus from '../main.js'
import axios from 'axios'
export default {
  data() {
    return {
      currentTabIndex: 0,
      tabs: {},
      tabsH: [
        {
          name: "Шаблон",
        },
        {
          name: "Фото",
        },
        {
          name: "Текст",
        },
        {
          name: "Стикер",
        },
      ],

      isDrag: false,
      dragOvered: false,
      decoSrc: '',
      dragX: null,
      dragY: null,
    };
  },
  computed: {
      currentTab() {
          return this.tabs[this.currentTabIndex] 
      },
      // координаты картинки (под курсором)
      dragImgStyle(){
        if(this.isDrag){
          return{
            position: 'absolute',
            top: `${this.dragY}px`,
            left: `${this.dragX}px`,
          }
        }
        else{
          return{
            display: 'none'
          }
        }
      }
  },
  methods: {
    tabClick(e, index) {
      this.currentTabIndex = index;
    },

    // начал тянуть
    onDragStart(e, index){
      this.dragOvered = false;
      this.isDrag = true;
      var crt = e.target.cloneNode(true);
      crt.style.display = "none";
      document.body.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 0, 0);
      this.decoSrc = this.currentTab[index].src;
      let obj = {
        src: this.decoSrc,
        //TODO: размеры надо знать перед тем как делать драг&дроп
        width: 600, // заменить
        height: 600,// заменить
      }
      e.dataTransfer.setData('obj', JSON.stringify(obj));
    },
    // во время тоскания, координаты
    onDrag(e){
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    },
    // спрятать всё
    onDragEnd(e){
      this.isDrag = false;
    }
  },
  mounted() {
    // события тоскания картинки над канвасом
    Bus.$on('canvasDropOvered', () => {
      this.dragOvered = true;
    });
    Bus.$on('canvasDropLeave', () => {
      this.dragOvered = false;
    });
    //TODO axios tabsContent[0]
    axios
    .get('http://localhost:3000/tabsContent')
    .then(response => (this.tabs = response.data));
      // this.tabs = [...info]
  },
};
</script>

<style scoped lang="scss">
.left {
  width: calc(30% - 10px);
  height: 100vh;
  background-color: #f0f0f0;
  padding: 0px 20px;
}
.tab__header {
  display: flex;
  justify-content: space-evenly;
}
.tab__header li {
  background-color: #ccc;
  padding: 10px;
  cursor: pointer;
}
.tab__content{
  *{
    user-select: none;
  }
}
.tab__content li {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 10px;
}
.tab__content li:not(:last-of-type) {
  margin-bottom: 20px;
}
.tab__content li img {
  width: 200px;
  height: 100px;
  object-fit: contain;
  -webkit-user-drag: none;
}

.dragImgDiv{
  position: fixed;
  z-index: 1010;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  img{
    max-width: 100px;
    max-height: 100px;
    transform: translate(-50%, -50%);
    user-select: none;
    transition: transform 0.3s ease;
    opacity: 0.7;
    &.active{
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
}
.hide{
  opacity: 0;
}
</style>