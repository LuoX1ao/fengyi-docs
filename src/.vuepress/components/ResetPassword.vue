<template>
  <div class="reset-password-container">
    <div class="step-bar">
      <el-steps style="width: 780px" :active="activeStep" finish-status="success" align-center>
        <el-step title="验证手机号"  />
        <el-step title="设置新密码"  />
        <el-step title="修改密码成功"  />
      </el-steps>
    </div>

    <!-- 第一步：验证手机号 -->
    <div v-if="activeStep === 0" class="step-content">
      <el-form
        :model="phoneForm"
        :rules="phoneRules"
        ref="phoneFormRef"
        class="reset-form"
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
        
        <el-form-item class="step-btn-item">
          <el-button type="primary" @click="handleStepOneNext" class="step-btn" :disabled="!phoneForm.verificationCode" :loading="nextBtnLoading">
            下一步
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第二步：设置新密码 -->
    <div v-if="activeStep === 1" class="step-content">
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        class="reset-form"
        label-position="top"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model.trim="passwordForm.newPassword"
            type="password"
            placeholder="请输入密码（8~20位字符，至少包含字母、数字、特殊符号其中2种）"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model.trim="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item class="step-btn-item">
          <el-button type="primary" @click="handleStepTwoNext" class="step-btn" :disabled="!passwordForm.newPassword || !passwordForm.confirmPassword" :loading="nextBtnLoading">
            下一步
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第三步：修改密码成功 -->
    <div v-if="activeStep === 2" class="step-content success-content">
      <div class="success-icon">
        <el-icon class="el-icon--success"><CircleCheckFilled /></el-icon>
      </div>
      <div class="success-title">密码修改成功</div>
      <div class="success-desc">
        您的密码已成功修改，
        <span class="countdown-text">将在 {{ redirectCountdown }} 秒后自动跳转至登录页</span>
        <el-button link @click="redirectToLogin" class="redirect-link">立即跳转</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import api from '../api'

// 创建路由实例
const router = useRouter()

// 当前步骤
const activeStep = ref(0)

// 第一步：手机号和验证码表单
const phoneForm = reactive({
  phone: '',
  verificationCode: ''
})

// 手机号表单验证规则
const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 表单引用
const phoneFormRef = ref()
const passwordFormRef = ref()

// 获取验证码相关
const disabledGetCode = ref(true)
const countdown = ref(0)

// 跳转倒计时
const redirectCountdown = ref(3)
let redirectTimer = null

// 开始跳转倒计时
const startCountdown = () => {
  redirectCountdown.value = 3
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer)
      redirectToLogin()
    }
  }, 1000)
}

// 跳转到登录页
const redirectToLogin = () => {
  if (redirectTimer) {
    clearInterval(redirectTimer)
  }
  router.push('/login')
}

// 验证手机号格式
const handlePhoneInput = () => {
  const phonePattern = /^1[3-9]\d{9}$/
  disabledGetCode.value = !phonePattern.test(phoneForm.phone)
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
    // 调用API获取验证码，type=3表示重置密码
    const response = await api.getVerificationCode({ phone: phoneForm.phone, type: '3' })
    if (response.success) {
      ElMessage.success('验证码发送成功')
    } else {
      ElMessage.error(response.errorMessage || response.obj?.message || '验证码发送失败，请稍后重试')
      return
    }
    
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

// 第二步：新密码表单
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 新密码表单验证规则
const passwordRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^(?![a-zA-Z]+$)(?![\d]+$)(?![!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$).{8,20}$/, message: '8～20位字符，至少包含字母、数字、特殊符号其中两种', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 下一步按钮是否禁用
const nextBtnLoading = ref(false)

// 第一步：下一步
const handleStepOneNext = () => {
  nextBtnLoading.value = true
  phoneFormRef.value.validate((valid) => {
    if (valid) {
      // 验证验证码
      api.verifyVerificationCode({
        phone: phoneForm.phone,
        verificationCode: phoneForm.verificationCode,
        type: '3'
      })
        .then((res) => {
          nextBtnLoading.value = false
          if (res.success) {
            activeStep.value += 1
          } else {
            ElMessage.error(res.errorMessage || res.obj?.message || '验证码验证失败，请重新输入')
          }
        })
        .catch(error => {
          nextBtnLoading.value = false
          ElMessage.error('验证码验证失败，请重新输入')
        })
    } else {
      nextBtnLoading.value = false
      ElMessage.warning('请填写完整信息')
      return false
    }
  })
}

// 第二步：下一步
const handleStepTwoNext = () => {
  nextBtnLoading.value = true
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // 调用重置密码接口
      api.resetPassword({
        phone: phoneForm.phone,
        verificationCode: phoneForm.verificationCode,
        password: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      })
        .then((res) => {
          nextBtnLoading.value = false
          if (res.success) {
            ElMessage.success('密码重置成功')
            activeStep.value += 1
            startCountdown()
          } else {
            ElMessage.error(res.errorMessage || res.obj?.message || '密码重置失败，请重新输入')
          }
        })
        .catch(error => {
          nextBtnLoading.value = false
          ElMessage.error('密码重置失败：' + error.message)
        })
    } else {
      nextBtnLoading.value = false
      ElMessage.warning('请填写完整信息')
      return false
    }
  })
}
</script>
<style scoped lang="scss">
.reset-password-container {
  width: 1200px;
  margin: 0 auto;

  .step-bar {
    height: 152px;
    margin-top: 20px;
    background-color: #ffffff;
    display: flex;
    /* width: 100%; */
    justify-content: center;
    align-items: center;
  }

  .step-content {
    background-color: #ffffff;
    padding: 50px;
    margin-top: 20px;
    border-radius: 8px;
  }

  .reset-form {
    width: 480px;
    margin: 0 auto;

    .code-input-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .code-btn {
      width: 112px;;
    }

    .step-btn-item {
      margin-top: 40px;
    }

    .step-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
    }
  }

  .success-content {
    text-align: center;
    padding: 100px 0;

    .success-icon {
      margin-bottom: 20px;

      .el-icon {
        font-size: 80px;
        color: #67c23a;
      }
    }

    .success-title {
      font-size: 24px;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 16px;
    }

    .success-desc {
      font-size: 16px;
      color: #86909c;
      margin-bottom: 40px;

      .countdown-text {
        color: #b91818;
        font-weight: 500;
      }

      .redirect-link {
        color: #b91818;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style>
.reset-password-container {
  .el-step__icon {
    width: 36px;
    height: 36px;
    color: #7D8899;
    border: none;
    background-color: #E2E5EB;
  }

  .is-process .el-step__icon {
    color: #ffffff;
    background-color: #B91818;
  }

  .el-step__title {
    color: #86909C;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    margin-top: 8px;
  }
  .el-step__title.is-process {
    color: #1D2129;
  }

  .el-step.is-horizontal .el-step__line {
    top: 17px;
    background-color: #E2E5EB;
  }

  .el-step.is-center .el-step__line {
    left: calc(50% + 18px + 10px);
    right: calc(-50% + 18px + 10px);
  }

  .is-success .el-step__icon {
    border: 1px solid #B91818;
    background-color: #ffffff;
    color: #B91818;

    .el-icon {
      height: 1.5em;
      line-height: 1.5em;
      width: 1.5em;
    }
    .el-icon svg {
      width: 1.5em;
      height: 1.5em;
    }
  } 

  .el-step__head.is-success {
    border-color: #E2E5EB;
    color: #E2E5EB;
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