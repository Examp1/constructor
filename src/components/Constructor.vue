<template>
  <div class="constructor">
    <header>
      <div class="l">
        <a href="#" class="logo"><img src="/img/logo.png" alt="" /></a>
        <a href="#">#ДаруюВесну</a>
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
          <li v-if="$store.state.canCrop" @click="shareFB()">поділитися <i class="ic-icon_fb"></i></li>
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
import axios from "axios";

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
          }
        );
      }, 500);
    },
    shareFB(){

      let winWidth = 500;
      let winHeight = 600;

      let winTop = (screen.height / 2) - (winHeight / 2);
      let winLeft = (screen.width / 2) - (winWidth / 2);

      let w = window.open('/preloader', 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);

        let dataURLtoFile = function(dataurl, filename) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      }

      setTimeout(() => {
        let scale1 = 2048 / document.querySelector(".mCanvas").offsetWidth;
        html2canvas(document.querySelector(".mCanvas"), { scale: scale1 }).then(
                (canvas) => {
                  const pictureBase64 = canvas
                          .toDataURL("image/png");

                  let orient = 'h';
                  if(this.$store.state.origHeight > this.$store.state.origWidth){
                    orient = 'v';
                  }

                  let data = new FormData();
                  data.append('file',dataURLtoFile(pictureBase64,'temp.png'));
                  data.append('orient',orient);

                  axios.post('/share-fb', data)
                    .then(response => {
                      if (history.pushState) {
                        let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                        let newUrl = baseUrl + '?hash=' + response.data.hash;
                        history.pushState(null, null, newUrl);
                      }

                      w.location.href = response.data.redirect;
                    });
                }
        );
      }, 500);
    }
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
}
header {
  background: #80bb30;
  width: 100%;
  padding: 15px 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ul {
    display: flex;
    align-items: center
  }
  a:not(.logo, .download) {
    color: #fff;
    font-size: 43px;
    text-decoration: none;
    font-weight: 600;
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
    a:first-of-type {
      margin-right: 200px;
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