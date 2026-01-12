import { defineStore } from 'pinia'

// 定义用户信息的类型
export interface UserInfo {
  phone: string
  token: string
  userId: string
  userName: string
  userCode: string
  email: string
  [key: string]: any
}

// 定义用户 store
export const useUserStore = defineStore('user', {
  // 状态定义
  state: () => ({
    userInfo: null as UserInfo | null,
    isLoggedIn: false
    //  userInfo: {
    //   phone: '13800000000',
    //   token: '123456',
    //   userId: '123456',
    //   userName: '张三',
    //   email: 'zhangsan@example.com',
    //  },
    // isLoggedIn: true
  }),

  // 计算属性
  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
    // 获取登录状态
    getLoginStatus: (state) => state.isLoggedIn
  },

  // 操作方法
  actions: {
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
    },
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null
      this.isLoggedIn = false
    },
    // 更新用户信息
    updateUserInfo(updates: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updates }
      }
    },
    // 退出登录
    logout() {
      this.clearUserInfo()
    }
  }
})