<template>
  <div class="register-container">
    <h2 class="register-title">账号注册</h2>
    <p class="register-desc">填写以下信息完成企业账号注册</p>

    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="register-form">
      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="form.phone" placeholder="请输入手机号" type="tel" maxlength="11" @input="validatePhone">

        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" placeholder="请输入密码（8~20位字符，至少包含字母、数字、特殊符号其中2种
）" type="password" show-password>

        </el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model.trim="form.confirmPassword" placeholder="请再次输入密码" type="password" show-password>

        </el-input>
      </el-form-item>

      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="contact">
        <el-input v-model.trim="form.contact" placeholder="请输入真实姓名" maxlength="50">

        </el-input>
      </el-form-item>

      <!-- 绑定邮箱 -->
      <el-form-item label="绑定邮箱" prop="email">
        <el-input v-model.trim="form.email" placeholder="请输入邮箱地址" maxlength="100">

        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item label="验证码" prop="verificationCode">
        <div class="code-input-wrapper">
          <el-input v-model.trim="form.verificationCode" placeholder="请输入验证码" style="width: 344px;">

          </el-input>
          <el-button plain type="primary" class="get-code-btn" @click="getVerificationCode"
            :disabled="disabledGetCode || countdown > 0">
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>



      <!-- 提交按钮 -->
      <el-form-item class="submit-btn-item">
        <el-button type="primary" @click="submitForm" class="submit-btn" :disabled="disabledSubmit">
          提交注册
        </el-button>
      </el-form-item>

      <div class="register-footer">
        <!-- 隐私协议 -->
        <el-form-item prop="agreement" class="agreement-item">
          <el-checkbox v-model="form.agreement">
            <span style="color: #374151;">我已阅读并同意</span><a href="javascript:void(0)" class="privacy-link"
              @click="handleAgreementClick">《隐私协议》</a>
          </el-checkbox>
        </el-form-item>
        <!-- 登录链接 -->
        <el-form-item class="login-link">
          <!-- 所有必填项填写完毕且同意隐私协议后，登录按钮才会启用 -->
          已有账号？<router-link to="/login" class="login-btn">立即登录</router-link>
        </el-form-item>
      </div>

    </el-form>
    <!-- 隐私协议弹窗组件 -->
    <PrivacyAgreement ref="privacyAgreementRef" />
  </div>
</template>

<script setup lang="js">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
// import { Mobile, Lock, User, Message, Key } from '@element-plus/icons-vue'
import api from '../api'
import { useRouter } from 'vue-router'
import PrivacyAgreement from './PrivacyAgreement.vue'

// 创建路由实例
const router = useRouter()



// 表单引用
const formRef = ref()

// 表单数据
const form = reactive({
  phone: '',
  password: '',
  confirmPassword: '',
  contact: '',
  email: '',
  verificationCode: '',
  agreement: false
})

// 验证码倒计时
const countdown = ref(0)
// 禁用获取验证码按钮
const disabledGetCode = ref(true)

// 隐私协议弹窗组件ref
const privacyAgreementRef = ref()

// 处理隐私协议点击事件
const handleAgreementClick = () => {
  privacyAgreementRef.value.open()
}

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  /**
     8~20位，字母、数字、特殊符号，至少包含其中两种
   * 
   */
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^(?![a-zA-Z]+$)(?![\d]+$)(?![!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$).{8,20}$/, message: '8～20位字符，至少包含字母、数字、特殊符号其中两种', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, message: '两次输入密码不一致', trigger: 'blur' }
  ],
  /**
     上限50位字符，中文、英文、数字、特殊符号
   * 
   */
  contact: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  /**
   * 必填，仅支持数字
   */
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
  ],
  // agreement: [
  //   { validator: validateAgreement, trigger: 'change' }
  // ]
}

const validatePhone = async () => {
  formRef.value.validateField('phone', (valid) => {
    disabledGetCode.value = !valid || countdown.value > 0
  })
}

// 验证确认密码
function validateConfirmPassword(rule, value, callback) {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 验证隐私协议
function validateAgreement(rule, value, callback) {
  if (!value) {
    callback(new Error('请阅读并同意隐私协议'))
  } else {
    callback()
  }
}

// 获取验证码
async function getVerificationCode() {
  // 验证手机号
  if (!form.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号格式')
    return
  }

  try {
    // 调用API获取验证码，注册类型使用type="1"
    const res = await api.getVerificationCode({ phone: form.phone, type: '1' })
    if (!res.success) {
      ElMessage.error(res.errorMessage || res.obj?.message || '获取验证码失败')
      return
    }
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
    console.error('获取验证码失败:', error)
    // 错误信息已经在axios拦截器中处理，这里可以根据需要添加额外处理
  }
}

// 计算登录按钮是否禁用
const disabledSubmit = computed(() => {
  console.log('disabledSubmit:', !form.agreement || !form.phone || !form.password || !form.confirmPassword || !form.contact || !form.email || !form.verificationCode)
  return !form.agreement || !form.phone || !form.password || !form.confirmPassword || !form.contact || !form.email || !form.verificationCode
})

// 提交表单
async function submitForm() {
  try {
    const valid = await formRef.value.validate()
    if (!valid) {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
    console.log('表单数据:', form)
    const res = await api.register(form)
    if (!res.success) {
      ElMessage.error(res.errorMessage || res.obj?.message || '注册失败')
      return false
    }
    ElMessage.success('注册成功')
    // 注册成功后，跳转到登录页面
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
    return false
  }
}

</script>

<style lang="scss">
.register-container {
  width: 480px;
  margin: 0 auto;

  .el-form-item {
    margin-bottom: 30px;

    &.is-error {
      margin-bottom: 52px;
    }
  }

  .el-input {
    height: 40px;
  }

  .el-form-item__label {
    color: #383838;
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    font-family: "PingFang SC";
    line-height: 24px;
  }

  .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1px #B91818 inset;
  }

  .el-form-item.is-error .el-form-item__content .el-input__wrapper {
    box-shadow: 0 0 0 1px #B91818 inset;
    background-color: rgba(185, 24, 24, 0.04);
  }

  .el-form-item__error {
    color: #B91818;
    font-size: 16px;
    margin-top: 4px;
  }

  .register-title {
    margin: 40px 0 10px;
    color: #111827;
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    font-family: "PingFang SC";
    line-height: 36px;
    border-bottom: none;
  }

  .register-desc {
    margin: 0 0 30px;
    color: #383838;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    font-family: "PingFang SC";
    line-height: 20px;
  }

  .register-form {}

  .code-input-wrapper {
    display: flex;
    align-items: center;
  }

  .agreement-item {
    margin-bottom: 20px;
  }

  .privacy-link {
    color: #2563EB;
    text-decoration: none;
  }

  .privacy-link:hover {
    text-decoration: underline;
  }

  .submit-btn {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    height: 48px;
  }

  .login-link {
    text-align: center;
    font-size: 14px;
    color: #606266;
  }

  .login-btn {
    color: #409eff;
    text-decoration: none;
  }

  .login-btn:hover {
    text-decoration: underline;
  }

  .get-code-btn {
    width: 112px;
    height: 40px;
    margin-left: 24px;
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

  // .submit-btn.el-button {
  //   background-color: #B91818;
  //   color: #fff;
  //   border: none;

  //    &:hover {
  //     background-color: #EB6565;
  //     color: #fff;
  //     border: none;
  //   }
  // }

  // .submit-btn.el-button.is-disabled {
  //   background-color: rgba(185, 24, 24, 0.2);
  //   color: #fff;
  //   border: none;

  //   &:hover {
  //     background-color: rgba(185, 24, 24, 0.2);
  //     color: #fff;
  //     border: none;
  //   }
  // }

  .register-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .login-btn {
    color: #D01B1B;
    text-decoration: none;

    &:hover,
    &:active {
      color: #EB6565;
      text-decoration: none;
    }
  }


  .submit-btn-item {
    padding-top: 10px;
    margin-bottom: 0;
  }

}

/* 隐私协议弹窗样式 */
.agreement-content {

  max-height: 360px;
  overflow: auto;
  margin: 0 0 30px;
  padding: 0 20px 30px;

  .agreement-content-inner {

    h3 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin-bottom: 10px;
      line-height: 1.6;
    }
  }

}

:deep(.el-dialog__footer) {
  text-align: center;
  padding-bottom: 20px;
}

.get-code-btn.el-button--primary.is-plain.is-disabled {
  background-color: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
