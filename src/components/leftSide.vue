<template>
  <div class="left">
    <ul class="tab__header">
      <li
        v-for="(item, index) in tabsH"
        :key="index"
        @click="tabClick($event, index, item.name)"
        :class="{ active: item.active }"
      >
        <i :class="item.icon"></i>
        {{ item.name }}
      </li>
    </ul>
    <ul class="tab__content" v-if="currentTabIndex != 4" :class="{ color: isColor }">
      <li
        v-for="(option, index) in tabs[currentTabIndex]"
        :key="index"
        draggable="true"
        @dragstart="onDragStart($event, index, option.type)"
        @click="onItemClick($event, index, option.type)"
        @drag="onDrag"
        @dragend="onDragEnd"
        v-images-loaded:on.progress="imageProgress"
      >
        <!-- <img src="../assets/igor.jpg" alt=""> -->
        <template v-if="!isColor">
          <!-- {{ option.name }}
          {{ option.isLoading }} -->
          <img :src="option.src" alt="" />
        </template>
        <template v-else>
          <!-- {{ option.color }} -->
          <div :style="{backgroundColor: option.color}"></div>
        </template>
      </li>
    </ul>
    <input type="file" hidden id="fileinput1" @change="onPhotoSelect" accept="image/jpeg,image/png"/>
    <div class="dragImgDiv" v-show="isDrag">
      <img
        v-if="isImg"
        :src="decoSrc"
        :style="dragImgStyle"
        alt="1"
        :class="{ active: dragOvered }"
        ref="dragGhost"
      />
    </div>

    <div class="mobcontrolbtns">
      <span
        @click="onUndoClick"
        :class="{ disabled: $store.state.states.length == 1 }"
      >
        <i class="ic-icon_5"></i>
      </span>
      <span :class="{ disabled: !$store.state.isSelectedItem}"
          @click="onCopyClick">
        <i class="ic-icon_7"></i>
      </span>
      <span :class="{ disabled: !$store.state.isSelectedItem}"
          @click="onDeleteClick">
        <i class="ic-icon_9"></i>
      </span>
    </div>
    <p class="copyright">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt tempore mollitia quaerat necessitatibus ad suscipit!</p>
  </div>
</template>

<script>
import imagesLoaded from "vue-images-loaded";
import Bus from "../main.js";
import axios from "axios";
export default {
  data() {
    return {
      ogeee: "",
      currentTabIndex: 0,
      tabs: [[]],
      tabsH: [
        {
          name: "Шаблон",
          active: false,
          icon: "ic-icon_11",
        },
        {
          name: "Елементи",
          active: false,
          icon: "ic-icon_2",
        },
        {
          name: "Цвет",
          active: false,
          icon: "ic-icon_3",
        },
        {
          name: "Текст",
          active: false,
          icon: "ic-icon_8",
        },
        {
          name: "Фото",
          active: false,
          icon: "ic-icon_10",
        },
      ],

      isDrag: false,
      dragOvered: false,
      decoSrc: "",
      dragX: null,
      dragY: null,
      dragInfo: null,
      url: "",
      isColor: false,
      isImg: true,
    };
  },
  directives: {
    imagesLoaded,
  },
  computed: {
    currentTab() {
      return this.tabs[this.currentTabIndex];
    },
    // координаты картинки (под курсором)
    dragImgStyle() {
      if (this.isDrag) {
        return {
          position: "absolute",
          top: `${this.dragY}px`,
          left: `${this.dragX}px`,
        };
      } else {
        return {
          display: "none",
        };
      }
    },
  },
  methods: {
    // toCanvas() {
    //   let scale1 = 2048 / document.querySelector(".mCanvas").offsetWidth;
    //   html2canvas(document.querySelector(".mCanvas"), { scale: scale1 }).then(
    //     function (canvas) {
    //       // document.body.appendChild(canvas);
    //       const image = canvas
    //         .toDataURL("image/png")
    //         .replace("image/png", "image/octet-stream");
    //         console.log(image);
    //       const t = document.querySelector(".download");
    //       t.setAttribute("download", "your picture.png");
    //       t.setAttribute("href", image);
    //     }
    //   );
    // },
    onUndoClick() {
      Bus.$emit("canvasUndo", {});
    },
    onCopyClick(){
      Bus.$emit("canvasCopy", {});
    },
    onDeleteClick(){
      Bus.$emit("canvasDelete", {});
    },
    imageProgress(instance, image) {
      const result = image.isLoaded ? "loaded" : "broken";
      const el = instance.elements[0];
      if (result == "loaded") {
        el.classList.add("loaded");
      } else {
        el.classList.add("broken");
      }
    },
    tabClick(e, index, name) {
      if(name == 'Фото'){
        document.querySelector('#fileinput1').click();
        return
      }
      this.currentTabIndex = index;
      this.tabsH.forEach((item) => (item.active = false));
      this.tabsH[index].active = true;
      // if (index == 2) {
      //   this.isColor = true;
      // } else {
      //   this.isColor = true;
      // }
      index == 2 ? (this.isColor = true) : (this.isColor = false);
      //   if (index  == 0) {
      //     if (this.tabs[0].length == 0) {
      //       this.url = `http://localhost:3000/template`;
      //     }
      //   }
      //   else if (index == 1) {
      //     if (this.tabs[1].length == 0) {
      //       this.url = `http://localhost:3000/text`;
      //     }
      //   }
      //   else if (index == 2) {
      //     if (this.tabs[2].length == 0) {
      //       this.url = `http://localhost:3000/color`;
      //     }
      //   } else if (index == 3) {
      //     if (this.tabs[3].length == 0) {
      //       this.url = `http://localhost:3000/sticker`;
      //     }
      //   }
      //   else {
      //     alert('photo')
      //   }
      //   console.log(index);

      //  if (this.url != '') {
      //     axios
      //     .get(this.url).then((response) => {
      //     this.tabs[index] = response.data;
      //     this.$set(this.tabs, this.tabs[index], response.data);
      //     this.tabs[index].forEach((item) => {
      //       // item.isLoading = true;
      //       item.img = new Image();
      //       item.img.src = item.src;
      //     });

      //     this.url = '';
      //   });
      //   // console.log(this.tabs[index]);
      //  }
    },

    // кликнул
    onItemClick(e, index, type){
      if (type == "sticker" || type == "text") {
        let decoSrc = this.currentTab[index].src;
        let dragInfo = {
          type: type,
          src: decoSrc,
          width: this.currentTab[index].img.width,
          height: this.currentTab[index].img.height,
          viewportWidth: 0,
          viewportHeight: 0,
        };
        let minSide = this.$store.state.origWidth > this.$store.state.origHeight ? this.$store.state.origHeight : this.$store.state.origWidth;
        let maxS = minSide * 0.3;
        // let maxS = 100 * 2;
        if (dragInfo.width > dragInfo.height) {
          dragInfo.viewportWidth = maxS;
          dragInfo.viewportHeight = Math.ceil(
            (dragInfo.height * maxS) / dragInfo.width
          );
        } else {
          dragInfo.viewportHeight = maxS;
          dragInfo.viewportWidth = Math.ceil(
            (dragInfo.width * maxS) / dragInfo.height
          );
        }
        Bus.$emit('addElementByClick', dragInfo);
      } else if (type == "template") {
        let curItem = this.tabs[0][index];
        let txtObjs = [];
        curItem.props.textItems.forEach((txtItem) => {
          let _txtObj = this.tabs[3].find((item) => item.name == txtItem.name);
          if (_txtObj) {
            let pushItem = { ...txtItem };
            pushItem.src = _txtObj.src;
            pushItem.orWidth = _txtObj.img.width;
            pushItem.orHeight = _txtObj.img.height;
            txtObjs.push(pushItem);
          } else alert("Текстовый спрайт из шаблона не найден");
        });
        let dragInfo = {
          type: type,
          group: this.currentTab[index].group,
          orient: curItem.orient,
          bgSrc: curItem.bg,
          texts: txtObjs,
        };
        Bus.$emit('setTemplateByClick', dragInfo);
      } else if(type == "color"){
        let curItem = this.tabs[this.currentTabIndex][index];
        Bus.$emit('setBgColorByClick', curItem.color);
      }
    },
    // начал тянуть
    onDragStart(e, index, type) {
      if (type == "sticker" || type == "text") {
        this.isImg = true;
        this.dragOvered = false;
        this.isDrag = true;
        var crt = e.target.cloneNode(true);
        crt.style.display = "none";
        document.body.appendChild(crt);
        e.dataTransfer.setDragImage(crt, 0, 0);
        this.decoSrc = this.currentTab[index].src;
        let dragGhost = this.$refs.dragGhost;
        this.dragInfo = {
          type: type,
          src: this.decoSrc,
          width: this.currentTab[index].img.width,
          height: this.currentTab[index].img.height,
          viewportWidth: dragGhost.width,
          viewportHeight: dragGhost.height,
        };
        let maxS = 100 * 1.5;
        if (this.dragInfo.width > this.dragInfo.height) {
          this.dragInfo.viewportWidth = maxS;
          this.dragInfo.viewportHeight = Math.ceil(
            (this.dragInfo.height * maxS) / this.dragInfo.width
          );
        } else {
          this.dragInfo.viewportHeight = maxS;
          this.dragInfo.viewportWidth = Math.ceil(
            (this.dragInfo.width * maxS) / this.dragInfo.height
          );
        }
        e.dataTransfer.setData("dragInfo", JSON.stringify(this.dragInfo));
      } else if (type == "template") {
        this.isImg = true;
        this.dragOvered = false;
        this.isDrag = true;
        var crt = e.target.cloneNode(true);
        crt.style.display = "none";
        document.body.appendChild(crt);
        e.dataTransfer.setDragImage(crt, 0, 0);
        this.decoSrc = this.currentTab[index].src;
        // let dragGhost = this.$refs.dragGhost;
        let curItem = this.tabs[0][index];
        let txtObjs = [];
        curItem.props.textItems.forEach((txtItem) => {
          let _txtObj = this.tabs[3].find((item) => item.name == txtItem.name);
          if (_txtObj) {
            let pushItem = { ...txtItem };
            pushItem.src = _txtObj.src;
            pushItem.orWidth = _txtObj.img.width;
            pushItem.orHeight = _txtObj.img.height;
            txtObjs.push(pushItem);
          } else alert("Текстовый спрайт из шаблона не найден");
        });
        this.dragInfo = {
          type: type,
          group: this.currentTab[index].group,
          orient: curItem.orient,
          bgSrc: curItem.bg,
          texts: txtObjs,
        };
        e.dataTransfer.setData("dragInfo", JSON.stringify(this.dragInfo));
      } else if(type == "color"){
        let curItem = this.tabs[this.currentTabIndex][index];
        this.isImg = false;
        this.hexVal = curItem.color;
        this.dragOvered = false;
        this.isDrag = true;
      
        this.dragInfo = {
          type: type,
          color: curItem.color,
        };
        e.dataTransfer.setData("dragInfo", JSON.stringify(this.dragInfo));
      }
    },
    // во время тоскания, координаты
    onDrag(e) {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    },
    // спрятать всё
    onDragEnd(e) {
      this.isDrag = false;
    },
    // changeStatus(tabInd, itemInd){
    //   this.$set(this.tabs[tabInd][itemInd], 'isLoading', false);
    // }

    onPhotoSelect(e) {
      let file = e.target.files[0];
      let fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = (e) => {
        let img = new Image();
        img.src = fr.result.replace("image/png", "image/octet-stream").replace("image/jpeg", "image/octet-stream");
        img.onload = () => {
          let c = document.createElement('canvas');
          if(img.width > img.height){
            c.width = 1000;
            c.height = +(1000 * img.height / img.width).toFixed(1);
          }
          else{
            c.height = 1000;
            c.width = +(1000 * img.width / img.height).toFixed(1);
          }
          c.getContext('2d').drawImage(img, 0, 0, img.width, img.height,  0,0, c.width, c.height);
          let minImgSrc = c.toDataURL('image/jpeg', 0.85);
          let minImg = new Image();
          minImg.src = minImgSrc;
          minImg.onload = () => {
            this.$store.commit('SER_ORIG_PHOTO', {
              photo: minImg
            });
          }
          document.querySelector('#fileinput1').value=null;
        }
      };
      fr.onerror = (e) => {
        alert("Image load error. See Console!");
        console.warn(e);
      };
    },
  },
  mounted() {
    this.tabsH[0].active = true;
    // события тоскания картинки над канвасом
    Bus.$on("canvasDropOvered", () => {
      this.dragOvered = true;
    });
    Bus.$on("canvasDropLeave", () => {
      this.dragOvered = false;
    });

    axios.post("/get-data").then((response) => {
      this.tabs = response.data;
      this.$store.commit('SET_TEMPLATES', {
        templates: this.tabs[0]
      });
      this.tabs.forEach((tab) => {
        // item.isLoading = true;
        tab.forEach((item) => {
          item.img = new Image();
          item.img.src = item.src;
        });
      });
    });
  },
};
</script>

<style scoped lang="scss">
.left {
  width: calc(500px - 10px);
  height: calc(100vh - 88px);
  background-color: #fff;
  display: flex;
  @media (max-width: 1024px) {
    width: 100%;
    height: calc(50vh);
    order: 3;
    flex-direction: column;
  }
}
.tab__header {
  display: flex;
  width: 120px;
  display: flex;
  flex-direction: column;
  margin: 0px;
  background-color: #e7e7e7;
  @media (max-width: 1024px) {
    flex-direction: row;
    width: 100%;
  }
}
.tab__header li {
  background-color: #e7e7e7;
  padding: 10px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.active {
    background-color: #fff;
  }
  i {
    margin-bottom: 6px;
    font-size: 40px;
  }
  @media (max-width: 1024px) {
    height: 32px;
    i{
      display: none;
    }
  }
  &.active{
    position: relative;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 10px;
      border-radius: 5px 0 0 5px;
      background-color: #75ae26;
      @media (max-width: 1024px) {
        height: 5px;
        width: 100%;
        transform: translate(0, -100%);
        z-index: 100;
        border-radius: 3px 3px 0 0;
      }
    }
  }
}
.tab__content {
  width: 100%;
  margin-top: 0px;
  padding: 20px 20px 40px 20px;
  overflow-y: overlay;
  height: 100%;
  position: relative;
  @media (max-width: 1024px) {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 0;
    padding: 20px 20px 20px 20px;
  }
  * {
    user-select: none;
  }
  &::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background: #e7e7e7;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d1d1;
  }
  li {
    transition: 0.3s;
    height: 150px;
    display: block;
    div{
      display: block;
      width: 100%;
      height: 100%;
    }
    &:hover {
      box-shadow: 0px 0px 1px 1px #80bb30;
    }
  }
  label{
    display: inline-block;
    padding: 10px 16px;
    color: #fff;
    background-color: #74ae26;
    font-size: 12px;
    border: none;
    outline: none;
    border-radius: 3px;
    cursor: pointer;
  }
}
.tab__content li {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  pointer-events: none;
  background-color: #f1f1f1;
  @media (max-width: 1024px) {
    position: relative;
    width: calc(33% - 10px);
    margin: 0 5px;
    height: 95px;
  }
}
.tab__content li:not(:last-of-type) {
  margin-bottom: 20px;
  @media (max-width: 1024px) {
    margin-bottom: 5px;
  }
}
.tab__content li img {
  max-width: 90%;
  max-height: 90%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // object-fit: contain;
  -webkit-user-drag: none;
}

.dragImgDiv {
  position: fixed;
  z-index: 1010;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  img {
    max-width: 100px;
    max-height: 100px;
    transform: translate(-50%, -50%);
    user-select: none;
    transition: transform 0.3s ease;
    opacity: 0.7;
    &.active {
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
}
.hide {
  opacity: 0;
}
.tab__content li.loaded, .color li {
  pointer-events: unset;
}
.mobcontrolbtns{
  display: flex;
  background-color: #77b128;
  justify-content: center;
  padding: 10px 0;
  span{
    margin: 0 10px;
    i{
      font-size: 21px;
    }
    &.disabled{
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
.copyright {
  font-size: 10px;
  color: rgb(163, 163, 163);
  line-height: 1.2;
  text-align: center;
  padding: 0 20px;
}
</style>