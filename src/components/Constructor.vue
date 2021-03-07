<template>
  <div class="constructor">
    <header :class="{ bluur: isModal }">
      <div class="l">
        <a href="/" class="logo desk"><img src="/img/logo.svg" alt="" /></a>
        <a href="/" class="logo mob"><img src="/img/logo.svg" alt="" /></a>
        <a href="https://owlweb.com.ua/" target="_blank" class="dv">#8-OwlWeb-69 ❤️</a>
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
          <li
            :class="{ disabled: !$store.state.isSelectedItem }"
            @click="onCopyClick"
          >
            <i class="ic-icon_7"></i>
          </li>
          <li
            :class="{ disabled: !$store.state.isSelectedItem }"
            @click="onDeleteClick"
          >
            <i class="ic-icon_9"></i>
          </li>
          <li v-if="$store.state.canCrop">
            <a
              href="#"
              @click.prevent="toCanvas"
              class="download"
              download="your picture.png"
              >завантажити
            </a>
          </li>
          <li v-if="$store.state.canCrop">
            поділитися <i class="ic-icon_fb"></i>
          </li>
        </ul>
      </nav>
    </header>
    <left-side :class="{ bluur: isModal }"></left-side>
    <right-side :class="{ bluur: isModal }"></right-side>

    <div class="modal_wrap" v-if="isModal">
      <photo-cropper v-if="$store.state.modalPhotoCropper"></photo-cropper>

      <div class="modal__content" v-if="$store.state.orientAlert">
        <p class="title">Увага!</p>
        <p class="descr">
          При зміні формату на даному етапі роботи положення всіх елементів
          зміниться.
        </p>
        <div class="btnwrp">
          <a href="#" class="back" @click.prevent="onCancelOrientAlert"
            >Назад</a
          >
          <a href="#" class="btn" @click.prevent="onAcceptOrientAlert">Добре</a>
        </div>
      </div>

      <div class="modal__content" v-if="false">
        <p class="title">Увага!</p>
        <p class="descr">
          Перевір, як твій дизайн буде відображатись у “Faceboo
        </p>
        <a href="#" class="btn">Добре</a>
      </div>

      <div class="modal__content" v-if="$store.state.firstStepModal">
        <p class="title green">#ОбираєшТи на раз-два-три!</p>
        <div class="text">
          <div class="text-wrap">
            <img src="/img/ico/icon-3.svg" alt="" />
            <p class="descr">1. Створи унікальну листівку.</p>
          </div>
          <div class="text-wrap">
            <img src="/img/ico/icon-2.svg" alt="" />
            <p class="descr">2. Поділися нею у соцмережах.</p>
          </div>
          <div class="text-wrap">
            <img src="/img/ico/icon-1.svg" alt="" />
            <p class="descr">
              3. Розмісти у тексті публікації хештег #ОбираєшТи та відмічай
              трьох друзів, кому ти даруєш унікальну листівку.
            </p>
          </div>
        </div>
        <a
          href="#"
          class="btn"
          @click.prevent="firstModalAccept"
          >Добре</a
        >
      </div>
    </div>
    <div class="modal-landscape">
      <div class="modal__content">
        <p class="title">Увага!</p>
        <p class="descr">Вибачте, але конструктор не підтримує режим пейзажу</p>
        <a href="#" class="btn">Добре</a>
      </div>
    </div>
    <div class="overlay" v-if="hints">
      <div class="modal__content">
        <div class="step1 step" :class="{ active: hintCounter == 0 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_1.gif">
            <img src="gif/desktop/1.gif" alt="">
          </picture>
          <p>Обери листівку із запропонованих шаблонів АБО</p>
          <p>Створи унікальну листівку</p>
        </div>
        <div class="step2 step" :class="{ active: hintCounter == 1 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_2.gif">
            <img src="gif/desktop/2.gif" alt="">
          </picture>
          <p>Обери колір фону</p>
        </div>
        <div class="step3 step" :class="{ active: hintCounter == 2 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_3.gif">
            <img src="gif/desktop/3.gif" alt="">
          </picture>
          <p>Додай святкових елементів</p>
        </div>
        <div class="step4 step" :class="{ active: hintCounter == 3 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_4.gif">
            <img src="gif/desktop/4.gif" alt="">
          </picture>
          <p>Напиши текст (із запропонованих написів)</p>
        </div>
        <div class="step5 step" :class="{ active: hintCounter == 4 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_5.gif">
            <img src="gif/desktop/5.gif" alt="">
          </picture>
          <p>Завантаж свое найкраще фото та здивуй її</p>
        </div>
        <!-- <div class="step6 step" :class="{ active: hintCounter == 5 }">
           <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_6.gif">
            <img src="gif/desktop/step_6.gif" alt="">
          </picture>
          <p>Можеш помістити своє фото</p>
        </div>
        <div class="step7 step" :class="{ active: hintCounter == 6 }">
          <picture>
            <source media="(max-width: 1023px)" srcset="gif/mobile/step_7.gif">
            <img src="gif/desktop/step_7.gif" alt="">
          </picture>
          <p>Тут ти можеш повернутися до старого дизайну</p>
        </div> -->
        <div class="btns">
          <button class="btn-skip btn" @click="closeHints">Пропустити</button>
          <button class="btn-next btn" @click="nextHints">Далі</button>
        </div>
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
  data() {
    return {
      hints: false,
      hintCounter: 0,
      hintLength: 4,
    };
  },
  computed: {
    isModal() {
      if (
        this.$store.state.firstStepModal ||
        this.$store.state.orientAlert ||
        this.$store.state.modalPhotoCropper
      )
        return true;
      else return false;
    },
  },
  mounted() {
    this.$store.commit("SET_FIRSTSTEPMODAL", { val: true });
    Bus.$on("toCanvas", this.toCanvas);
  },
  methods: {
    firstModalAccept() {
      this.$store.commit('SET_FIRSTSTEPMODAL', { val: false })
      if (window.localStorage.getItem("hints") == null) {
        this.hints = true;
      } else {
        this.hints = false;
      }
    },
    nextHints() {
      if (this.hintLength == this.hintCounter) {
        this.hints = false;
        window.localStorage.setItem("hints", true);
      } else {
        this.hintCounter++;
      }
    },
    closeHints() {
      this.hints = false;
      window.localStorage.setItem("hints", true);
    },
    burgerSwitch() {
      Bus.$emit("burgerSwitch", {});
    },
    onUndoClick() {
      Bus.$emit("canvasUndo", {});
    },
    onCopyClick() {
      Bus.$emit("canvasCopy", {});
    },
    onDeleteClick() {
      Bus.$emit("canvasDelete", {});
    },
    onAcceptOrientAlert() {
      Bus.$emit("acceptOrientAlert", {});
      this.$store.commit("SET_ORIENTALERT", { val: false });
    },
    onCancelOrientAlert() {
      this.$store.commit("SET_ORIENTALERT", { val: false });
    },
    toCanvas() {
      this.$store.commit("SET_ISRENDER", {
        val: true,
      });
      let canvClone = document.querySelector(".mCanvas").cloneNode(true);
      canvClone.classList.add("prerender");
      document.querySelector(".right").append(canvClone);
      let scale1 = 1200 / document.querySelector(".prerender").offsetWidth;

      canvClone.style.width = `${
        +canvClone.style.width.replace("px", "") * scale1
      }px`;
      canvClone.style.height = `${
        +canvClone.style.height.replace("px", "") * scale1
      }px`;
      let wt = canvClone.querySelector(".waterm");
      wt.style.width = `${+wt.style.width.replace("px", "") * scale1}px`;
      wt.style.height = `${+wt.style.height.replace("px", "") * scale1}px`;
      wt.style.top = `${+wt.style.top.replace("px", "") * scale1}px`;
      wt.style.right = `${+wt.style.right.replace("px", "") * scale1}px`;

      canvClone.querySelectorAll(".drr").forEach((item) => {
        item.style.width = `${+item.style.width.replace("px", "") * scale1}px`;
        item.style.height = `${
          +item.style.height.replace("px", "") * scale1
        }px`;
        item.style.top = `${+item.style.top.replace("px", "") * scale1}px`;
        item.style.left = `${+item.style.left.replace("px", "") * scale1}px`;
      });

      let imgs = canvClone.querySelectorAll("img");
      let svgImgs = [];
      imgs.forEach((item) => {
        if (item.getAttribute("src").indexOf(".svg") != -1) svgImgs.push(item);
      });
      svgImgs.forEach((item) => {
        let canvas = document.createElement("canvas");
        canvas.style = item.getAttribute("style");
        let ctx = canvas.getContext("2d");
        canvas.width = item.offsetWidth;
        canvas.height = item.offsetHeight;
        ctx.drawImage(
          item,
          0,
          0,
          item.width,
          item.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        item.src = canvas.toDataURL("image/png");
      });
      canvClone.style.transform = "";
      canvClone.style.top = "";
      canvClone.style.left = "";

      setTimeout(() => {
        html2canvas(document.querySelector(".prerender"), {
          logging: true,
          profile: true,
          useCORS: true,
          scale: 1,
        }).then((canvas) => {
          const image = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          let el = document.createElement("a");
          el.setAttribute("href", image);
          el.setAttribute("download", "8March-OwlWeb_Team-69.jpg");
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
          this.$store.commit("SET_ISRENDER", {
            val: false,
          });
          document.querySelector(".prerender").remove();
        });
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
.bluur {
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
  background: #b953aa;
  width: 100%;
  padding: 10px 20px 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1024px) {
    padding: 10px 0px;
  }
  ul {
    display: flex;
    align-items: center;
  }
  a.dv {
    color: #fff;
    font-size: 34px;
    text-decoration: none;
    font-weight: 600;
    @media (max-width: 1024px) {
      font-size: 18px;
    }
  }
  nav {
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
    .mob {
      display: none;
      img {
        width: 67px;
      }
      @media (max-width: 1024px) {
        display: block;
      }
    }
    .desk {
      @media (max-width: 1024px) {
        display: none;
      }
    }
    .logo{
      img{
        width: 81px;
      }
    }
    a:first-of-type {
      margin-right: 390px;
      @media (max-width: 1210px) {
        margin-right: 80px;
      }
    }
    .burger {
      width: 26px;
      height: 20px;
      margin-right: 20px;
      position: relative;
      display: none;
      @media (max-width: 1024px) {
        display: block;
      }
      &:before {
        content: "";
        width: 26px;
        height: 3px;
        border-radius: 2px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
      }
      &:after {
        content: "";
        width: 26px;
        height: 3px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #fff;
      }
      div {
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
.nav__menu li i {
  font-size: 23px;
  margin-right: 15px;
}
.nav__menu li:not(:last-of-type) {
  margin-right: 45px;
}
.nav__menu li:last-of-type {
  display: flex;
  align-items: center;
  i {
    margin-right: 0px;
    margin-left: 10px;
  }
}
.download {
  color: #fff;
  text-decoration: none;
}
.text-wrap {
  display: flex;
  align-items: center;
}
.modal__content {
  overflow: hidden;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 40px 30px 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 12px 0px rgba(102, 102, 102, 0.08);
  font-family: serif;
  max-width: 700px;
  text-align: center;
  .title {
    font-family: "Geometria-Bold";
    font-size: 26px;
    margin-bottom: 10px;
    &.green {
      color: #b953aa;
    }
  }
  .descr {
    font-family: "Geometria";
    font-size: 22px;
    margin-top: 0px;
    margin-bottom: 30px;
    color: #4a4a4a;
    &:first-of-type {
      margin-top: 20px;
    }
    a {
      color: #b953aa;
      text-decoration: none;
    }
  }
  img {
    width: 50px;
    height: 55px;
    object-fit: contain;
    margin-right: 20px;
    @media (max-width: 375px) {
      width: 30px;
    }
  }
  .btnwrp {
    display: flex;
  }
  .back {
    background-color: rgb(208, 208, 208);
    color: rgb(36, 36, 36);
    padding: 10px 25px;
    border-radius: 5px;
    text-decoration: none;
    font-family: "Geometria";
    margin-right: 15px;
  }
  .btn {
    background-color: #b953aa;
    color: #fff;
    padding: 10px 25px;
    border-radius: 5px;
    text-decoration: none;
    font-family: "Geometria";
  }
  .text {
    text-align: left;
  }
}
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(#000, 0.6);
  z-index: 90;
  color: #fff;
  font-family: "Geometria";
  font-size: 18px;
  .step {
    transition: 0.3s;
    display: none;
    &.active{
      display: flex;
      flex-direction: column;
    }
  }
  //   p::before {
  //     position: absolute;
  //     content: "";
  //     background-repeat: no-repeat;
  //     background-size: contain;
  //   }
  //   &.active {
  //     opacity: 1;
  //   }
  // }
  // .step1 {
  //   position: absolute;
  //   top: 10%;
  //   left: 170px;
  //   p:first-of-type::before {
  //     width: 60px;
  //     height: 60px;
  //     background-image: url(/img/ico/arrow-1.svg);
  //     left: -70px;
  //     top: 50%;
  //     transform: translateY(-50%);
  //   }
  //   p:last-of-type::before {
  //     width: 200px;
  //     height: 200px;
  //     background-image: url(/img/ico/arrow-2.svg);
  //     right: 20px;
  //     top: 90px;
  //   }
  //   @media (max-width: 1536px) {
  //     left: 15%;
  //     top: 13%;
  //   }
  //   @media (max-width: 768px) {
  //     top: 40%;
  //     left: 0%;
  //     display: flex;
  //     justify-content: space-around;
  //     width: 100%;
  //     font-size: 14px;
  //     text-align: center;
  //     p {
  //       max-width: 180px;
  //       &::before {
  //         background-image: url(/img/ico/arrow-1.svg) !important;
  //         width: 60px !important;
  //         height: 60px !important;

  //         transform: rotate(-90deg) !important;
  //       }
  //       &:last-of-type::before {
  //         transform: rotate(90deg) !important;
  //         right: unset;
  //         top: -50px;
  //       }
  //       &:first-of-type::before {
  //         left: 22% !important;
  //         top: 70px;
  //       }
  //     }
  //   }
  // }
  // .step2 {
  //   position: absolute;
  //   bottom: 2%;
  //   left: 30%;
  //   p::before {
  //     background-image: url(/img/ico/arrow-3.svg);
  //     width: 200px;
  //     height: 60px;
  //     right: -200px;
  //     top: -10px;
  //   }
  //   @media (max-width: 1536px) {
  //     left: 18%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 10%;
  //     top: 20%;
  //     width: 100%;
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 40%;
  //       top: 80px;
  //     }
  //   }
  // }
  // .step3 {
  //   position: absolute;
  //   left: 10%;
  //   top: 35%;
  //   p {
  //     text-align: center;
  //   }
  //   p::before {
  //     width: 60px;
  //     height: 60px;
  //     background-image: url(/img/ico/arrow-1.svg);
  //     left: -70px;
  //     top: 40%;
  //     // transform: translateY(-50%);
  //   }
  //   @media (max-width: 1536px) {
  //     left: 15%;
  //     top: 40%;
  //   }
  //   @media (max-width: 1280px) {
  //     top: 47%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 0%;
  //     top: 41%;
  //     width: 100%;
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 65%;
  //       top: 40px;
  //     }
  //   }
  //   @media (max-width: 425px) {
  //     left: 13%;
  //   }
  // }
  // .step4 {
  //   position: absolute;
  //   left: 10%;
  //   top: 25%;
  //   p::before {
  //     width: 60px;
  //     height: 60px;
  //     background-image: url(/img/ico/arrow-1.svg);
  //     left: -70px;
  //     top: 40%;
  //     // transform: translateY(-50%);
  //   }
  //   @media (max-width: 1536px) {
  //     left: 35%;
  //     top: 30%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 0%;
  //     top: 41%;
  //     width: 100%;
  //     p {
  //       text-align: center;
  //     }
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 50%;
  //       top: 40px;
  //     }
  //   }
  // }
  // .step5 {
  //   position: absolute;
  //   left: 10%;
  //   top: 50%;
  //   p::before {
  //     width: 60px;
  //     height: 60px;
  //     background-image: url(/img/ico/arrow-1.svg);
  //     left: -70px;
  //     top: 40%;
  //     // transform: translateY(-50%);
  //   }
  //   @media (max-width: 1536px) {
  //     left: 15%;
  //     top: 55%;
  //   }
  //   @media (max-width: 1280px) {
  //     top: 64%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 0%;
  //     top: 60%;
  //     width: 100%;
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 40%;
  //       top: 40px;
  //     }
  //   }
  //   @media (max-width: 425px) {
  //     p::before {
  //       left: 36%;
  //     }
  //   }
  // }
  // .step6 {
  //   position: absolute;
  //   left: 10%;
  //   top: 60%;
  //   p::before {
  //     width: 60px;
  //     height: 60px;
  //     background-image: url(/img/ico/arrow-1.svg);
  //     left: -70px;
  //     top: 40%;
  //     // transform: translateY(-50%);
  //   }
  //   @media (max-width: 1536px) {
  //     left: 15%;
  //     top: 70%;
  //   }
  //   @media (max-width: 1280px) {
  //     top: 81%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 20%;
  //     top: 60%;
  //     width: 100%;
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 40%;
  //       top: 40px;
  //     }
  //   }
  // }
  // .step7 {
  //   position: absolute;
  //   left: 55%;
  //   top: 12%;
  //   p::before {
  //     width: 200px;
  //     height: 200px;
  //     background-image: url(/img/ico/arrow-4.svg);
  //     right: -200px;
  //     top: -60px;
  //     // transform: translateY(-50%);
  //   }
  //   @media (max-width: 1600px) {
  //     left: 45%;
  //   }
  //   @media (max-width: 1536px) {
  //     left: 40%;
  //   }
  //   @media (max-width: 1280px) {
  //     left: 32%;
  //   }
  //   @media (max-width: 768px) {
  //     left: 0%;
  //     top: 79%;
  //     width: 100%;
  //     p::before {
  //       background-image: url(/img/ico/arrow-1.svg);
  //       transform: rotate(-90deg);
  //       width: 60px;
  //       height: 60px;
  //       left: 40%;
  //       top: 40px;
  //     }
  //   }
  //   @media (max-width: 425px) {
  //     top: 75%;
  //   }
  // }
  .btn {
    position: absolute;
    bottom: 40px;
    background: transparent;
    outline: none;
    right: 40px;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 4px;
    padding: 15px 30px;
    text-decoration: none;
    &:first-of-type {
      right: 220px;
    }
    @media (max-width: 768px) {
      top: 30px;
      bottom: unset;
    }
  }
}
.modal-landscape {
  display: none;
  position: fixed;
  width: 100%;
  z-index: 1001;
  top: 0px;
  left: 0px;
  height: 100%;
  background-color: rgba(#000, 0.4);
  @media (max-width: 812px) and (orientation: landscape) {
    display: block;
  }
  .modal__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.overlay{
  .modal__content{
    max-width: 700px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0px;
    padding-bottom: 20px;  
  }
  .btn{
    position: static;
    background-color: #b953aa;
    color: #fff;
    padding: 10px 25px;
    border-radius: 5px;
    text-decoration: none;
    font-family: "Geometria";
  }
  p{
    color: #000;
    font-family: 'Geometria';
    margin-bottom: 0px;
    text-align: left;
    padding: 0px 20px;
  }
  img{
    width: 100%;
    height: unset;
    @media (max-width: 576px){
      height: auto;
      object-fit: cover;
    }
  }
  .btns{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0px 20px;
    .btn{
      cursor: pointer;
      font-size: 16px;
      &:last-of-type{
        padding: 10px 55px;
      }
    }
  }
  .btn-skip{
    border: 2px solid #ccc;
    background-color: transparent;
    color: #ccc;
  }
}
</style>