# vue-files-upload

This template should help get you started developing with Vue 3 in Vite.

该组件是基于 vue3 + vite + element plus 的文件上传组件，功能如下：
* 可以实现多文件和文件夹按钮上传和拖动上传功能，
* 支持文件类型和大小限制，支持回调事件获取筛选后符合要求的文件列表，
* 获取文件列表后，用户可以进行后续处理。

组件基于版本
```javascript
"dependencies": {
  "@element-plus/icons-vue": "^2.3.1",
  "element-plus": "^2.7.4",
  "vue": "^3.4.21",
  ...
},
"devDependencies": {
  "@rushstack/eslint-patch": "^1.8.0",
  "@tsconfig/node20": "^20.1.4",
  "@types/node": "^20.12.5",
  "@vitejs/plugin-vue": "^5.0.4",
  "@vue/eslint-config-typescript": "^13.0.0",
  "@vue/tsconfig": "^0.5.1",
  "eslint": "^8.57.0",
  "eslint-plugin-vue": "^9.23.0",
  "less": "^4.2.0",
  "npm-run-all2": "^6.1.2",
  "typescript": "~5.4.0",
  "unocss": "^0.60.4",
  "vite": "^5.2.8",
  "vite-plugin-dts": "^3.9.1",
  "vue-tsc": "^2.0.11"
}
```

## 1.案例演示
**注：** 演示案例中使用了LICEcap软件进行录屏操作。

* 1.初始版本案例

![演示案例](./demo1.gif)

## 2. 安装及使用方法
**注：** 该组件暂时仅支持在内部局域网中使用。
### 2.1 安装组件
```bash
# 安装依赖
npm install @baosight/vue-files-upload
or
pnpm install @baosight/vue-files-upload

# 全局安装组件
import VueFilesUpload from "@baosight/vue-files-upload";
import "@baosight/vue-files-upload/dist/style.css";
...
const app = createApp(App);
app.use(VueFilesUpload);

# 按需引入组件
import { VueFilesUpload } from "@baosight/vue-files-upload";
import "@baosight/vue-files-upload/dist/style.css";
```

### 2.2 使用组件
```html
<template>
  <div>
    <VueFilesUpload
      :fileTypes="['jpg', 'jpeg', 'bmp', 'webp', 'gif', 'png']"
      :maxFileSize="2 * 1024 * 1024"
      :showFileUploadBtn="true"
      :showDirectoryUploadBtn="true"
      @upload="handleUpload"
    />
  </div>
</template>

<script setup>
  import { VueFilesUpload } from "@baosight/vue-files-upload";
  import "@baosight/vue-files-upload/dist/style.css";
  ...
  const handleUpload = (files: File[]) => {
    console.log(files);
    // 处理上传文件逻辑
    ...
  }
</script>
```


## 3. 属性说明

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| fileTypes | `Array<string>` | 接受的文件类型，字符串数组 | ['jpg', 'jpeg', 'bmp', 'webp', 'gif', 'png'] |
| maxFileSize | `Number` | 最大文件大小，单位为字节 | 2M |
| showFileUploadBtn | `Boolean` | 是否显示上传文件按钮；true：显示，false：不显示 | true |
| showDirectoryUploadBtn | `Boolean` | 是否显示上传文件夹按钮；true：显示，false：不显示  | true |

## 4. 事件说明

| 事件名 | 说明 | 参数 | 类型 |
| --- | --- | --- | --- |
| upload | 文件上传成功时触发 | 文件列表 | `File[]` |