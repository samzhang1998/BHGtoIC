<template>
  <web-view :src="path"></web-view>
</template>

<script setup lang="ts">
const path = ref('')
onLoad((options) => {
  path.value = options?.web ? decodeURIComponent(options?.web) : ''
  console.log(path.value)
})
</script>
