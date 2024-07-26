<script setup lang="ts">
import Upload from "@/components/upload/index.vue";

const upload = (files: File[]) => {
  console.log("父级-----------------");
  console.log(files);
}
</script>

<template>
    <!-- <EchartsDrag /> -->
    <Upload @upload="upload"/>
</template>

<style scoped lang="less">
.upload-container {
  margin: 10px auto 0;
}
</style>
