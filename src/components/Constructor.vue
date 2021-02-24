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
    <!-- ориентация  -->
    <!-- <div class="modal_wrap">
        <div class="modal__content">
         <p class="title">
            Увага!
         </p>
          <p class="descr">
            При зміні формату на даному етапі роботи положення всі
          </p>
          <a href="#" class="btn">Добре</a>
        </div>
    </div> -->
    <!-- предупреждение фб -->
    <!-- <div class="modal_wrap">
        <div class="modal__content">
         <p class="title">
            Увага!
         </p>
          <p class="descr">
            Перевір, як твій дизайн буде відображатись  у “Faceboo
          </p>
          <a href="#" class="btn">Добре</a>
        </div>
    </div> -->
    <!-- step -->
    <div class="modal_wrap">
        <div class="modal__content">
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
          <a href="#" class="btn">Добре</a>
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
.modal__content{
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 40px 30px 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px #666;
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