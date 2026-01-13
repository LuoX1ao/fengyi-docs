import type { PiniaPluginContext } from 'pinia'

// Pinia 持久化插件
const piniaPersistPlugin = (context: PiniaPluginContext) => {
  // 在 store 初始化时执行
  context.store.$subscribe((mutation, state) => {
    // 仅处理 user store
    if (mutation.storeId === 'user') {
      // 将 user store 的状态保存到 localStorage
      localStorage.setItem('userStore', JSON.stringify(state))
    }
  })

  // 初始化时从 localStorage 恢复状态
  const storedState = localStorage.getItem('userStore')
  if (storedState && context.store.$id === 'user') {
    try {
      const parsedState = JSON.parse(storedState)
      // 恢复状态
      context.store.$patch(parsedState)
    } catch (error) {
      console.error('Failed to parse user store from localStorage:', error)
    }
  }
}

export default piniaPersistPlugin