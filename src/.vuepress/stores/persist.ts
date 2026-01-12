import type { PiniaPluginContext } from 'pinia'

// Pinia 持久化插件
const piniaPersistPlugin = (context: PiniaPluginContext) => {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined'

  // 在 store 初始化时执行
  context.store.$subscribe((mutation, state) => {
    // 仅处理 user store
    if (mutation.storeId === 'user' && isBrowser) {
      // 将 user store 的状态保存到 localStorage
      localStorage.setItem('userStore', JSON.stringify(state))
    }
  })

  // 初始化时从 localStorage 恢复状态
  if (isBrowser && context.store.$id === 'user') {
    const storedState = localStorage.getItem('userStore')
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState)
        // 恢复状态
        context.store.$patch(parsedState)
      } catch (error) {
        console.error('Failed to parse user store from localStorage:', error)
      }
    }
  }
}

export default piniaPersistPlugin