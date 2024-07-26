<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue';
// import EchartsDrag from "@/components/echartsDrag/index.vue";
// import EchartsDrag from "@/components/echartsDrag1/index.vue";
// import EchartsDrag from "@/components/echartsDrag2/index.vue";
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
