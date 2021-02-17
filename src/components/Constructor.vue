<template>
  <div class="constructor">
      <header>
        <div class="l">
          <a href="#" class="logo"><img src="/img/logo.png" alt=""></a>
          <a href="#">#ДаруюВесну</a>
        </div>
        <nav>
          <ul class="nav__menu">
            <li @click="onUndoClick" :class="{disabled: $store.state.states.length == 1}">
                <i class="ic-icon_5"></i>
            </li>
            <li>
                 <i class="ic-icon_7"></i>
            </li>
            <li>
                <i class="ic-icon_9"></i>
            </li>
            <li>
              download
            </li>
            <li>поділитися <i class="ic-icon_fb"></i></li>
          </ul>
        </nav>
      </header>
      <left-side></left-side>
      <right-side></right-side>
  </div>
</template>

<script>

import leftSide from './leftSide.vue'
import rightSide from './rightSide.vue'
import Bus from '../main'

export default {
  name: 'constructor',
  components: {
    leftSide,
    rightSide
  },
  methods: {
    onUndoClick() {
      Bus.$emit('canvasUndo', {});
    }
  },
}
</script>

<style scoped lang="scss">
  @import '../assets/ico.css';
  *{
    font-family: sans-serif;
    box-sizing: border-box;
  }
  .constructor{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  header{
    background: #80bb30;
    width: 100%;
    padding: 15px 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ul{
      display: flex;
    }
    a:not(.logo){
      color: #fff;
      font-size: 43px;
      text-decoration: none;
      font-weight: 600;
    }
    .nav__menu{
      li{
        color: #fff;
        cursor: pointer;
        &:not(:last-of-type) {
          margin-right: 10px;
        }
        &.disabled{
          cursor: default;
          opacity: 0.5;
        }
      }
    }
    .l{
      display: flex;
      justify-content: space-between;
      align-items: center;
      a:first-of-type{
        margin-right: 200px;
      }
    }
  }
  .constructor{
    display: flex;
    flex-wrap: wrap;
  }
</style>