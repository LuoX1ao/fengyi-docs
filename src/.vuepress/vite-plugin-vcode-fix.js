import { resolve } from 'path'

export default function vcodeFixPlugin() {
  return {
    name: 'vcode-fix-plugin',
    resolveId(source, importer) {
      if (source === './dist/main.vue' && importer?.includes('vue3-puzzle-vcode')) {
        // 将./dist/main.vue重定向到正确的入口文件
        return resolve(__dirname, 'node_modules/vue3-puzzle-vcode/dist/vue3-puzzle-vcode.es.js')
      }
      return null
    }
  }
}