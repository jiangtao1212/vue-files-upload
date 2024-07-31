<script setup lang="ts">
// import Upload from "@/components/upload/index.vue";
import { VueFilesUpload } from "@baosight/vue-files-upload";
import "@baosight/vue-files-upload/dist/style.css";

const upload = (files: File[]) => {
  console.log("父级-----------------");
  console.log(files);
}
</script>

<template>
  <!-- <Upload @upload="upload"/> -->
  <VueFilesUpload @upload="upload" />
</template>

<style scoped lang="less">
.upload-container {
  margin: 10px auto 0;
}
</style>
