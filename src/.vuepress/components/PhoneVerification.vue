<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :width="dialogWidth"
    center
    class="phone-verify-dialog"
  >
    <!-- 自定义标题 -->
    <div slot="header" class="dialog-header">
      <h3 class="dialog-title">{{ title }}</h3>
    </div>
    <div class="dialog-content">
      <p class="verify-text">{{ verifyText }} <span style="color: #2563EB;">{{ phoneMask(phoneNumber) }}</span></p>
      <el-form :model="verifyPhoneForm" :rules="verifyPhoneRules" ref="verifyPhoneFormRef" label-position="top" class="verify-form">
        <el-form-item label="验证码" prop="verificationCode">
          <div class="code-input-wrapper">
            <el-input
              v-model.trim="verifyPhoneForm.verificationCode"
              placeholder="请输入"
              style="width: 344px"
            />
            <el-button
              plain
              type="primary"
              @click="handleGetVerifyCode"
              :disabled="countdown > 0"
              class="code-btn"
            >
              {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!verifyPhoneForm.verificationCode" class="confirm-btn">确认</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../api';

// 定义组件名称（用于调试）
defineOptions({
  name: "PhoneVerification"
});

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: "手机验证"
  },
  verifyText: {
    type: String,
    default: "点击获取验证码，将有一条包含验证码的短信发送至您绑定的手机号"
  },
  dialogWidth: {
    type: String,
    default: '552px'
  },
  // 验证码类型，用于API调用
  codeType: {
    type: String,
    default: '3'
  },
  // 验证码验证类型，用于API调用
  verifyType: {
    type: String,
    default: '3'
  }
});

// 定义事件
const emit = defineEmits(['success', 'cancel', 'close']);

// 弹窗可见性
const dialogVisible = ref(props.visible);

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

// 表单数据
const verifyPhoneForm = reactive({
  verificationCode: ''
});
const verifyPhoneFormRef = ref();
const countdown = ref(0);

// 表单验证规则
const verifyPhoneRules = reactive({
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error('验证码仅支持数字'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
});

// 手机号脱敏显示
const phoneMask = (phone) => {
  if (!phone) {
    return '';
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 获取验证码
const handleGetVerifyCode = async () => {
  try {
    // 调用API获取验证码
    await api.getVerificationCode({ phone: props.phoneNumber, type: props.codeType });
    ElMessage.success('验证码发送成功');
    
    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试');
    console.error('发送验证码失败:', error);
  }
};

// 取消
const handleCancel = () => {
  emit('cancel');
  resetForm();
};

// 确认
const handleConfirm = async () => {
  if (!verifyPhoneFormRef.value) return;
  
  await verifyPhoneFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 验证验证码
        const res = await api.verifyVerificationCode({
          phone: props.phoneNumber,
          verificationCode: verifyPhoneForm.verificationCode,
          type: props.verifyType
        });
        
        if (res.success) {
          // 验证成功
          emit('success', {
            phoneNumber: props.phoneNumber,
            verificationCode: verifyPhoneForm.verificationCode
          });
          resetForm();
        } else {
          ElMessage.error(res.obj?.message || '验证码验证失败，请重试');
        }
      } catch (error) {
        ElMessage.error('验证码验证失败，请重试');
        console.error('验证失败:', error);
      }
    }
  });
};

// 关闭弹窗回调
const handleClose = () => {
  emit('close');
  resetForm();
};

// 重置表单
const resetForm = () => {
  verifyPhoneForm.verificationCode = '';
  if (verifyPhoneFormRef.value) {
    verifyPhoneFormRef.value.resetFields();
  }
};
</script>

<style scoped>
/* 弹窗样式 */
.dialog-header {
  padding: 20px 20px 0;
}

.dialog-title {
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin: 0;
  text-align: left;
}

.dialog-content {
  padding: 24px 20px;
}

.verify-text {
  margin-top: 0;
  margin-bottom: 20px;
  color: #383838;
  font-size: 20px;
  line-height: 24px;
}

.verify-form {
  margin-top: 10px;
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

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.cancel-btn {
  width: 120px;
}

.confirm-btn {
  width: 120px;
}

.cancel-btn,
.cancel-btn:hover,
.cancel-btn:active {
  color: #7D8899;
  background-color: #E2E5EB;
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
</style>

<style>
.phone-verify-dialog .el-dialog__header {
  display: none;
}
</style>