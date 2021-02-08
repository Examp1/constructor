<template>
  <div class="constructor">
      <left-side></left-side>
      <right-side></right-side>
  </div>
</template>

<script>

import leftSide from './leftSide.vue'
import rightSide from './rightSide.vue'

export default {
  name: 'constructor',
  components: {
    leftSide,
    rightSide
  },
}
</script>

<style>

</style>