<template>
  <div class="left">
    <ul class="tab__header">
        
      <li v-for="(item, index) in tabsH" :key="index" @click="tabClick($event, index)">
        {{ item.name }}
      </li>
    </ul>
    <ul class="tab__content">
      <li v-for="(option, index) in currentTab" :key="index">
        {{ option.name }}
        <img :src="option.src" alt="" />
        <!-- <img src="../assets/igor.jpg" alt=""> -->
      </li>
    </ul>
  </div>
</template>

<script>
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
    };
  },
  computed: {
      currentTab() {
          return this.tabs[this.currentTabIndex] 
      },

  },
  methods: {
      tabClick(e, index) {
       this.currentTabIndex = index;
      }
  },
  mounted() {
      //TODO axios tabsContent[0]
      axios
      .get('http://localhost:3000/tabsContent')
      .then(response => (this.tabs = response.data));
        // this.tabs = [...info]
  },
};
</script>

<style scoped>
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
}
</style>