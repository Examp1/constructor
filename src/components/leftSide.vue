<template>
  <div class="left">
    <ul class="tab__header">
        
      <li v-for="(item, index) in tabsH" :key="index" @click="tabClick($event, index)">
        {{ item.name }}
      </li>
    </ul>
    <ul class="tab__content">
      <li v-for="(option, index) in currentTab" :key="index" draggable="true" @dragstart="onDragStart($event, index)" @drag="onDrag" @dragend="onDragEnd" v-images-loaded:on.progress="imageProgress">
        {{ option.name }}
        {{ option.isLoading }}
        <img :src="option.src" alt="" />
        <!-- <img src="../assets/igor.jpg" alt=""> -->
      </li>
    </ul>
    <div class="dragImgDiv" v-show="isDrag">
      <img :src="decoSrc" :style="dragImgStyle" alt="1" :class="{active: dragOvered}" ref="dragGhost">
    </div>
    
    <button @click="toCanvas">to canvas</button>
    <a href="" class="download">скачать</a>

  </div>
</template>

<script>
import html2canvas from "html2canvas";
import imagesLoaded from 'vue-images-loaded'
import Bus from '../main.js'
import axios from 'axios'
export default {
  data() {
    return {
      currentTabIndex: 0,
      tabs: {},
      tabs2: [],
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
      dragInfo: null,
    };
  },
  directives: {
        imagesLoaded
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
    toCanvas(){
        let scale1 = 2048 / document.querySelector('.mCanvas').offsetWidth
        html2canvas(document.querySelector('.mCanvas'), {scale: scale1}).then(function(canvas) {
        document.body.appendChild(canvas);
        const image = document.querySelector('canvas').toDataURL("image/png").replace("image/png", "image/octet-stream");
        const t = document.querySelector('.download');
        t.setAttribute('download', 'your picture.png')
        t.setAttribute('href', image)
        });
    },
    imageProgress(instance, image) {
        const result = image.isLoaded ? 'loaded' : 'broken';
        const el = ( instance.elements[0] );
        if (result == 'loaded') {
         el.classList.add('loaded')
        } else {
          el.classList.add('broken')
        }
    },
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
      let dragGhost = this.$refs.dragGhost;
      this.dragInfo = {
        src: this.decoSrc,
        width: this.currentTab[index].img.width,
        height: this.currentTab[index].img.height,
        viewportWidth: dragGhost.width,
        viewportHeight: dragGhost.height,
      }
      let maxS = 100 * 1.5;
      if(this.dragInfo.width > this.dragInfo.height){
        this.dragInfo.viewportWidth = maxS;
        this.dragInfo.viewportHeight = Math.ceil(this.dragInfo.height * maxS / this.dragInfo.width);
      }
      else{
        this.dragInfo.viewportHeight = maxS;
        this.dragInfo.viewportWidth = Math.ceil(this.dragInfo.width * maxS / this.dragInfo.height);
      }
      e.dataTransfer.setData('dragInfo', JSON.stringify(this.dragInfo));
    },
    // во время тоскания, координаты
    onDrag(e){
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    },
    // спрятать всё
    onDragEnd(e){
      this.isDrag = false;
    },
    changeStatus(tabInd, itemInd){
      this.$set(this.tabs[tabInd][itemInd], 'isLoading', false);
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

    axios
    .get('http://localhost:3000/tabsContent')
    .then(response => {
        this.tabs = response.data;
        this.tabs.forEach((tab, tabIndex) => {
          tab.forEach((item, itemIndex) => {
            item.isLoading = true;
            item.img = new Image();
            item.img.src = item.src;
            item.img.onload = () => {
              this.changeStatus(tabIndex, itemIndex);
            }
          })
        })
      });
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
  pointer-events: none;
  background-color: red;
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
.tab__content li.loaded{
  pointer-events: unset;
  background-color: #fff;
}
</style>