import { createPinia } from 'pinia'
import piniaPersistPlugin from './persist'
import { useUserStore } from './user'

// 创建 pinia 实例
const pinia = createPinia()

// 使用持久化插件（插件内部会检查浏览器环境）
pinia.use(piniaPersistPlugin)

export {
  pinia,
  useUserStore
}