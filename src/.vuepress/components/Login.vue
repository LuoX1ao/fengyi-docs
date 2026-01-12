<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <el-tabs v-model="activeTab" class="login-tabs">
        <!-- 账号密码登录 -->
        <el-tab-pane label="账号密码登录" name="password">
          <el-form
            :model="passwordForm"
            :rules="passwordRules"
            ref="passwordFormRef"
            class="login-form"
            label-position="top"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model.trim="passwordForm.phone"
                placeholder="请输入手机号"
                maxLength="11"
                type="tel"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <div style="position: relative; width: 100%;">
                <el-input
                  v-model.trim="passwordForm.password"
                  type="password"
                  placeholder="请输入密码"
                />
                <div class="forget-password">
                  <el-button link @click="handleForgetPassword">忘记密码？</el-button>
                </div>
              </div>
            </el-form-item>
           
            
            <el-form-item class="login-btn-item">
              <el-button type="primary" @click="handlePasswordLogin" class="login-btn" :disabled="disabledLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 手机号登录 -->
        <el-tab-pane label="手机号登录" name="phone">
          <el-form
            :model="phoneForm"
            :rules="phoneRules"
            ref="phoneFormRef"
            class="login-form"
            label-position="top"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model.trim="phoneForm.phone"
                placeholder="请输入手机号"
                maxLength="11"
                @input="handlePhoneInput"
                type="tel"
              />
            </el-form-item>
            
            <el-form-item label="验证码" prop="verificationCode">
              <div class="code-input-wrapper">
                <el-input
                  v-model.trim="phoneForm.verificationCode"
                  placeholder="请输入验证码"
                  style="width: 344px"
                />
                <el-button
                  plain
                  type="primary"
                  @click="handleGetVerificationCode"
                  :disabled="disabledGetCode || countdown > 0"
                  class="code-btn"
                >
                  {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            
            <el-form-item class="login-btn-item">
              <el-button type="primary" @click="handlePhoneLogin" class="login-btn" :disabled="disabledLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="login-footer">
        <!-- 隐私协议 -->
        <el-form-item prop="agreement" class="agreement-item">
          <el-checkbox v-model="agreement">
            <span style="color: #374151;">我已阅读并同意</span><a href="javascript:void(0)" class="privacy-link" @click="handleAgreementClick">《隐私协议》</a>
          </el-checkbox>
        </el-form-item>
        <div class="register-link">
          还没有账号？
          <router-link to="/register" class="register-btn">立即注册</router-link>
        </div>
      </div>
    </div>
    <!-- 隐私协议弹窗组件 -->
    <PrivacyAgreement ref="privacyAgreementRef" />

    <Vcode ref="vcodeRef" :show="showVcode" @success="onValidSuccess" @close="onValidClose" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '../api'
import PrivacyAgreement from './PrivacyAgreement.vue'
import Vcode from 'vue3-puzzle-vcode'
// 引入用户 store
import { useUserStore } from '../stores/user'

// 创建路由实例
const router = useRouter()

// 创建用户 store 实例
const userStore = useUserStore()

// 选项卡状态
const activeTab = ref('password')

// 隐私协议
const agreement = ref(false)

const disabledGetCode = ref(true)

// 隐私协议弹窗组件ref
const privacyAgreementRef = ref()

// 处理隐私协议点击事件
const handleAgreementClick = () => {
  privacyAgreementRef.value.open()
}

// 验证码弹窗组件ref
const vcodeRef = ref()

// 验证码弹窗是否显示
const showVcode = ref(false)

// 处理验证码成功事件
const onValidSuccess = () => {
  showVcode.value = false
  if (activeTab.value === 'password') {
    passwordLogin()
  } else if (activeTab.value === 'phone') {
    phoneLogin()  
  }
}

// 处理验证码关闭事件
const onValidClose = () => {
  showVcode.value = false
}



// 账号密码登录表单
const passwordFormRef = ref()
const passwordForm = reactive({
  phone: '',
  password: '',
})

// 手机号登录表单
const phoneFormRef = ref()
const phoneForm = reactive({
  phone: '',
  verificationCode: '',
})

// 验证码倒计时
const countdown = ref(0)

// 表单验证规则
const passwordRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^(?![a-zA-Z]+$)(?![\d]+$)(?![!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$).{8,20}$/, message: '8～20位字符，至少包含字母、数字、特殊符号其中两种', trigger: 'blur' }
  ],
})

const phoneRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          callback(new Error('验证码仅支持数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 登录按钮是否禁用
const disabledLogin = computed(() => {
  if (activeTab.value === 'password') {
    return !passwordFormRef.value || passwordForm.password === '' || passwordForm.phone === '' || !agreement.value
  } else {
    return !phoneFormRef.value || phoneForm.verificationCode === '' || phoneForm.phone === '' || !agreement.value
  }
})

// 处理手机号输入
const handlePhoneInput = (value) => {
  // 移除所有非数字字符
  phoneFormRef.value.validateField('phone', (valid) => {
    disabledGetCode.value = !valid || countdown.value > 0
  })
}



// 获取验证码
const handleGetVerificationCode = async () => {
  // 验证手机号格式
  if (!phoneForm.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  try {
    // 调用API获取验证码，type=2表示登录
    await api.getVerificationCode({ phone: phoneForm.phone, type: '2' })
    ElMessage.success('验证码发送成功')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
    console.error('发送验证码失败:', error)
  }
}

const handleForgetPassword = () => {
  console.log('忘记密码')
  router.push('/reset-password')
}

// 账号密码登录
const handlePasswordLogin = async () => {
  if (!agreement.value) {
    ElMessage.warning('请阅读并同意隐私协议和服务条款')
    return
  }
  
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      // 显示验证码弹窗
      showVcode.value = true
      return
    }
  })
}

const passwordLogin = async () => {
  try {
    // 调用登录API
    const res = await api.login(passwordForm)
    if (res.success) {
      ElMessage.success('登录成功')
      console.log('登录成功:', res)
      // 存储用户信息到 Pinia
      userStore.setUserInfo({
        phone: res.obj?.phone || '',
        userId: res.obj?.userId || '',
        userName: res.obj?.userName || '',
        token: res.obj?.token || '',
        email: res.obj?.email || '',
        userCode: res.obj?.userCode || '',
      })
      // 登录成功后跳转到首页或其他页面
      router.push('/')
    } else {
      ElMessage.error(res.errorMessage || '登录失败，请检查账号密码是否正确')
      console.error('登录失败:', res)
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查账号密码是否正确')
    console.error('登录失败:', error)
  }
}

// 手机号登录
const handlePhoneLogin = async () => {
  if (!agreement.value) {
    ElMessage.warning('请阅读并同意隐私协议和服务条款')
    return
  }
  
  if (!phoneFormRef.value) return
  
  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      // 显示验证码弹窗
      showVcode.value = true
    }
  })
}

const phoneLogin = async () => {
  try {
    // 调用手机号登录API
    const res = await api.phoneLogin(phoneForm)
    if (res.success) {
      ElMessage.success('登录成功')
      console.log('登录成功:', res)
      // 存储用户信息到 Pinia
      userStore.setUserInfo({
        phone: res.obj?.phone || '',
        userId: res.obj?.userId || '',
        userName: res.obj?.userName || '',
        token: res.obj?.token || '',
        email: res.obj?.email || '',
        userCode: res.obj?.userCode || '',
      })
      // 登录成功后跳转到首页或其他页面
      router.push('/')
    } else {
      ElMessage.error(res.errorMessage || '登录失败，请检查手机号和验证码是否正确')
      console.error('登录失败:', res)
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查手机号和验证码是否正确')
    console.error('登录失败:', error)
  }
}
</script>

<style scoped lang="scss">
.login-container {
  background-color: #fff;
  width: 1200px;
  margin: 20px auto;
}

.login-form-wrapper {
  width: 480px;
  padding: 40px 0;
  margin: 0 auto;
  background-color: #fff;

}

.login-form-wrapper h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.login-tabs {
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 18px;
}

.code-input-wrapper {
  display: flex;
  align-items: center;
  gap: 24px;
}

  .code-btn {
    width: 112px;
    height: 40px;
    color: #B91818;
    border: 1px solid #B91818;
    background-color: #fff;

    &:hover,
    &:active {
      color: #EB6565;
      border: 1px solid #EB6565;
      background-color: #ffffff;
    }
  }


  .login-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

.agreement {
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}


.register-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-bottom: 30px;
  line-height: 40px;
}

.register-btn {
  color: #B91818;
  text-decoration: none;
  margin-left: 5px;
}

.register-btn:hover {
  text-decoration: underline;
}

.privacy-link {
  color: #2563EB;
  text-decoration: none;
}

.privacy-link:hover {
  text-decoration: underline;
}


</style>
<style lang="scss">
  .login-tabs {
  font-family: 'PingFang SC';

  .el-tabs__item {
    height: 55px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(56, 56, 56, 0.6);

    &.is-active {
      color: rgba(56, 56, 56, 1);
    }
  }
  .el-tabs__active-bar {
    height: 4px;
    background-color: #B91818;
  }

  .el-form-item__label {
    font-size: 16px;
    color: #383838;
  }

  .el-tabs__item.is-active, .el-tabs__item:hover {
    color: rgba(56, 56, 56, 1);
  }

  .login-btn-item {
    padding-top: 10px;
    margin-bottom: 10px;
  }

  .forget-password {
    position: absolute;
    top: 44px;
    right: 0;
    line-height: 20px;
    font-size: 12px;
    color: #2563EB;

    .el-button.is-link {
      color: #2563EB;
    }
  }



  .code-btn.el-button--primary.is-plain.is-disabled {
    background-color: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.2);
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
}

</style>