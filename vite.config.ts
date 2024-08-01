import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      // ts配置文件路径
      tsconfigPath: './tsconfig.build.json',
      // 动态导入改为静态导入
      staticImport: true,
      // 是否创建类型入口文件
      insertTypesEntry: true,
      // 类型入口文件输出目录，默认为lib.outDir配置的目录
      outDir: 'dist',
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    outDir: 'dist',
    // assetsDir: 'assets',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueFilesUpload',
      // formats: ['es'],
      // the proper extensions will be added
      fileName: 'vue-files-upload',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 解决在混合模式下（全局引入+按需引入）的警告
        exports: 'named',
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
});
