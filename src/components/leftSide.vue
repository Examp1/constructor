<template>
  <div class="left">
    <ul class="tab__header">
      <li
        v-for="(item, index) in tabsH"
        :key="index"
        @click="tabClick($event, index)"
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
          {{ option.name }}
          {{ option.isLoading }}
          <img :src="option.src" alt="" />
        </template>
        <template v-else>
          {{ option.color }}
          <div :style="{backgroundColor: option.color}"></div>
        </template>
      </li>
    </ul>
    <ul class="tab__content" v-if="currentTabIndex == 4">
      <input type="file" hidden id="fileinput1" @change="onPhotoSelect" accept="image/jpeg,image/png"/>
      <label for="fileinput1" style="background-color: #fafafa; cursor: pointer"
        >Click to select photo</label
      >
    </ul>
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

    <!-- <button @click="toCanvas">to canvas</button>
    <a href="" class="download">скачать</a> -->
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
    imageProgress(instance, image) {
      const result = image.isLoaded ? "loaded" : "broken";
      const el = instance.elements[0];
      if (result == "loaded") {
        el.classList.add("loaded");
      } else {
        el.classList.add("broken");
      }
    },
    tabClick(e, index) {
      // debugger
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
        let maxS = 100 * 2;
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
        // console.log(fr.result);
        // this.$store.commit("SER_ORIG_PHOTO", {
        //   photo: fr.result,
        // });
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
  height: calc(100vh - 81px);
  background-color: #fff;
  display: flex;
}
.tab__header {
  display: flex;
  width: 120px;
  display: flex;
  flex-direction: column;
  margin: 0px;
  background-color: #e7e7e7;
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
}
.tab__content {
  width: 100%;
  margin-top: 0px;
  padding: 20px 20px 40px 20px;
  overflow-y: scroll;
  height: 100%;
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
}
.tab__content li {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  pointer-events: none;
  background-color: #f1f1f1;
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
</style>