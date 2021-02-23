<template>
  <div class="constructor">
    <header>
      <div class="l">
        <a href="#" class="logo desk"><img src="/img/logo.png" alt="" /></a>
        <a href="#" class="logo mob"><img src="/img/pb_logo.svg" alt="" /></a>
        <a href="#">#ДаруюВесну</a>
        <div class="burger"><div></div></div>
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
          <!-- <li v-if="$store.state.canCrop"> -->
          <li>
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
    <left-side></left-side>
    <right-side></right-side>

    <div class="modal_wrap" v-if="$store.state.modalPhotoCropper">
      <photo-cropper></photo-cropper>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import leftSide from "./leftSide.vue";
import rightSide from "./rightSide.vue";
import photoCropper from "./photoCropper.vue";
import Bus from "../main";

export default {
  name: "constructor",
  components: {
    leftSide,
    rightSide,
    photoCropper,
  },
  methods: {
    onUndoClick() {
      Bus.$emit("canvasUndo", {});
    },
    onCopyClick(){
      Bus.$emit("canvasCopy", {});
    },
    onDeleteClick(){
      Bus.$emit("canvasDelete", {});
    },
    toCanvas() {
      this.$store.commit('SET_ISRENDER', {
        val: true
      });
      setTimeout(() => {
        let scale1 = 2048 / document.querySelector(".mCanvas").offsetWidth;
        html2canvas(document.querySelector(".mCanvas"), { scale: scale1 }).then(
          (canvas) => {
            const image = canvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream");
            let el = document.createElement("a");
            el.setAttribute("href", image);
            el.setAttribute("download", "your picture.png");
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
  font-family: sans-serif;
  box-sizing: border-box;
}
.constructor {
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
}
header {
  background: #80bb30;
  width: 100%;
  padding: 15px 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1024px) {
    padding: 0px 0px;
  }
  ul {
    display: flex;
    align-items: center
  }
  a:not(.logo, .download) {
    color: #fff;
    font-size: 43px;
    text-decoration: none;
    font-weight: 600;
    @media (max-width: 1024px) {
      font-size: 18px;
    }
  }
  nav{
    @media (max-width: 1024px) {
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
    }
    .burger{
      width: 26px;
      height: 20px;
      margin-right: 20px;
      position: relative;
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
  background-color: rgba(0, 0, 0, 0.364);
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
  margin-right: 45px;
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
</style>