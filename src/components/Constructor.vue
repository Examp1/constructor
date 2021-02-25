<template>
  <div class="constructor">
    <header :class="{bluur: isModal}">
      <div class="l">
        <a href="#" class="logo desk"><img src="/img/logo.png" alt="" /></a>
        <a href="#" class="logo mob"><img src="/img/pb_logo.svg" alt="" /></a>
        <a href="#">#ДаруюВесну</a>
        <div class="burger" @click="burgerSwitch"><div></div></div>
      </div>
      <nav>
        <ul class="nav__menu">
          <li
            @click="onUndoClick"
            :class="{ disabled: $store.state.states.length == 1 }"
          >
            <i class="ic-icon_5"></i>
          </li>
          <li :class="{ disabled: !$store.state.isSelectedItem}"
              @click="onCopyClick">
            <i class="ic-icon_7"></i>
          </li>
          <li :class="{ disabled: !$store.state.isSelectedItem}"
              @click="onDeleteClick">
            <i class="ic-icon_9"></i>
          </li>
          <li v-if="$store.state.canCrop">
            <a
              href="#"
              @click.prevent="toCanvas"
              class="download"
              download="your picture.png"
              >завантажити </a
            >
          </li>
          <li v-if="$store.state.canCrop">поділитися <i class="ic-icon_fb"></i></li>
        </ul>
      </nav>
    </header>
    <left-side :class="{bluur: isModal}"></left-side>
    <right-side :class="{bluur: isModal}"></right-side>

    <div class="modal_wrap" v-if="isModal">
      <photo-cropper v-if="$store.state.modalPhotoCropper"></photo-cropper>

      <div class="modal__content" v-if="$store.state.orientAlert">
        <p class="title">
          Увага!
        </p>
        <p class="descr">
          При зміні формату на даному етапі роботи положення всіх елементів зміниться.
        </p>
        <a href="#" class="btn" @click.prevent="onAcceptOrientAlert">Добре</a>
      </div>

      <div class="modal__content" v-if="false">
        <p class="title">
          Увага!
        </p>
        <p class="descr">
          Перевір, як твій дизайн буде відображатись  у “Faceboo
        </p>
        <a href="#" class="btn">Добре</a>
      </div>

      <div class="modal__content" v-if="$store.state.firstStepModal">
        <p class="title green">
          #ДаруюВесну на раз-два-три!
        </p>
        <div class="text">
          <p class="descr">
          1. Створи унікальну листівку. 
        </p>
        <p class="descr">
          2. Поділися нею у соцмережах. 
        </p>
        <p class="descr">
          3. Розмісти у тексті публікації хештег 
          #ДаруюВесну та відмічай трьох 
          друзів, кому ти передаєш естафету весни!
        </p>
        </div>
        <a href="#" class="btn" @click.prevent="$store.commit('SET_FIRSTSTEPMODAL', {val: false})">Добре</a>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import leftSide from "./leftSide.vue";
import rightSide from "./rightSide.vue";
import photoCropper from "./photoCropper.vue";
import Bus from "../main";
import canvg from "canvg";

export default {
  name: "constructor",
  components: {
    leftSide,
    rightSide,
    photoCropper,
  },
  computed: {
    isModal() {
      if(this.$store.state.firstStepModal || this.$store.state.orientAlert || this.$store.state.modalPhotoCropper)
        return true
      else
        return false
    }
  },
  mounted () {
    this.$store.commit('SET_FIRSTSTEPMODAL', {val: true});
    Bus.$on('toCanvas', this.toCanvas);
  },
  methods: {
    burgerSwitch(){
      Bus.$emit('burgerSwitch', {});
    },
    onUndoClick() {
      Bus.$emit("canvasUndo", {});
    },
    onCopyClick(){
      Bus.$emit("canvasCopy", {});
    },
    onDeleteClick(){
      Bus.$emit("canvasDelete", {});
    },
    onAcceptOrientAlert(){
      Bus.$emit("acceptOrientAlert", {});
       this.$store.commit('SET_ORIENTALERT', {val: false});
    },
    toCanvas(){
      // this.$store.commit('SET_ISRENDER', {
      //   val: true
      // });
      let canvClone = document.querySelector('.mCanvas').cloneNode(true);
      canvClone.classList.add('prerender');
      document.querySelector('.right').append(canvClone);
      let imgs = canvClone.querySelectorAll('img');
      let svgImgs = [];
      imgs.forEach(item => {
        if(item.getAttribute('src').indexOf('.svg') != -1)
          svgImgs.push(item)
      });
      svgImgs.forEach(item => {
        let canvas = document.createElement('canvas');
        canvas.style = item.getAttribute('style');
        let ctx = canvas.getContext('2d');
        canvas.width = item.offsetWidth;
        canvas.height = item.offsetHeight;
        ctx.drawImage(item, 0, 0, item.width, item.height,
                      0,0, canvas.width, canvas.height);
        item.src = canvas.toDataURL("image/png");
      });
      
      setTimeout(() => {
        let scale1 = 1200 / document.querySelector(".prerender").offsetWidth;
        html2canvas(document.querySelector(".prerender"), {
            logging: true,
            profile: true,
            useCORS: true,
            scale: scale1}).then(
          (canvas) => {
            const image = canvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream");
            let el = document.createElement("a");
            el.setAttribute("href", image);
            el.setAttribute("download", "DaruiuVesnu.jpg");
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
            this.$store.commit('SET_ISRENDER', {
              val: false
            });
          }
        );
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/ico.css";
* {
  box-sizing: border-box;
}
.bluur{
  filter: blur(3px);
}
.constructor {
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (max-width: 1024px) and (orientation: portrait) {
    flex-direction: column;
  }
}
header {
  background: #80bb30;
  width: 100%;
  padding: 10px 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1024px){
    padding: 0px 0px;
  }
  ul {
    display: flex;
    align-items: center
  }
  a:not(.logo, .download) {
    color: #fff;
    font-size: 34px;
    text-decoration: none;
    font-weight: 600;
    @media (max-width: 1024px){
      font-size: 18px;
    }
  }
  nav{
    @media (max-width: 1024px){
      display: none;
    }
  }
  .nav__menu {
    li {
      color: #fff;
      cursor: pointer;
      &:not(:last-of-type) {
        margin-right: 10px;
      }
      &.disabled {
        cursor: default;
        opacity: 0.5;
      }
    }
  }
  .l {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1024px) {
      width: 100%;
    }
    .mob{
      display: none;
      img{
        width: 67px;
      }
      @media (max-width: 1024px) {
        display: block;
      }
    }
    .desk{
      @media (max-width: 1024px) {
        display: none;
      }
    }
    a:first-of-type {
      margin-right: 200px;
      @media (max-width: 1210px) {
        margin-right: 80px;
      }
    }
    .burger{
      width: 26px;
      height: 20px;
      margin-right: 20px;
      position: relative;
      display: none;
      @media (max-width: 1024px) {
        display: block;
      }
      &:before{
        content: '';
        width: 26px;
        height: 3px;
        border-radius: 2px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
      }
      &:after{
        content: '';
        width: 26px;
        height: 3px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #fff;
      }
      div{
        width: 26px;
        height: 3px;
        background: #fff;
        border-radius: 2px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
      }
    }
  }
}
.constructor {
  display: flex;
  flex-wrap: wrap;
}
.modal_wrap {
  position: fixed;
  z-index: 100;
  // background-color: rgba(0, 0, 0, 0.364);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav__menu li i{
  font-size: 23px;
  margin-right: 15px;
}
.nav__menu li:not(:last-of-type){
  margin-right: 45px;
}
.nav__menu li:last-of-type{
  display: flex;
  align-items: center;
  i{
    margin-right: 0px;
    margin-left: 10px;
  }
}
.download{
  color: #fff;
  text-decoration: none;
}
.modal__content{
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 40px 30px 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 12px 0px rgba(102, 102, 102, 0.08);
  font-family: serif;
  max-width: 500px;
  text-align: center;
  .title{
    font-family: 'Geometria-Bold';
    font-size: 26px;
    margin-bottom: 10px;
    &.green{
      color: #74ae26;
    }
  }
  .descr{
    font-family: 'Geometria';
    font-size: 22px;
    margin-top: 0px;
  }
  .btn{
    background-color: #74ae26;
    color: #fff;
    padding: 10px 25px;
    border-radius: 5px;
    text-decoration: none;
    font-family: 'Geometria';
  }
  .text{
    text-align: left;
  }
}
</style>