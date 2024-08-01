import type { App } from 'vue'
import './assets/main.css'
import 'uno.css'
import VueFilesUpload from '@/components/upload/index.vue';

/**
 * 1.按需引入组件
 * ...
 * import { VueFilesUpload } from '@baosight/vue-files-upload';
 * import "@baosight/vue-files-upload/dist/style.css";
 */
export { VueFilesUpload };

/**
 * 2.全局注册组件
 * 这里默认导出一个vue支持的install方法
 * 可以在main.ts中使用以下方式全局导入组件
 *
 * import VueFilesUpload from '@baosight/vue-files-upload';
 * import "@baosight/vue-files-upload/dist/style.css";
 * .....
 * app.use(VueFilesUpload);
 */
export default {
  install(app: App) {
    app.component("VueFilesUpload", VueFilesUpload);
    // 如果还有更多的组件需要注册，可以在这里继续添加
    //  app.component("XXX1", XXX1);
    //  app.component("XXX2", XXX2);
  }
}

// 声明全局组件
// declare module "vue" {
//   export interface GlobalComponents {
//     VueFilesUpload: typeof VueFilesUpload
//   }
// }


