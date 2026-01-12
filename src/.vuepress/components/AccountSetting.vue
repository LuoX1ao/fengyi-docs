<template>
  <div class="account-setting">
    <div class="title">
      账号设置
    </div>
    <div class="content">
      <div class="setting-item">
        <div class="setting-item-title">
          账号
        </div>
        <div class="setting-item-content">
          {{ userStore.userInfo?.userId || '' }}
        </div>
      </div>
      <!-- 手机号 -->
      <div class="setting-item">
        <div class="setting-item-title">
          手机号
        </div>
        <!-- 脱敏显示，第4位开始显示4个星号 -->
        <div class="setting-item-content">
          {{ phoneMask(userStore.userInfo?.phone || '') }}<a href="javascript:void(0)" class="reset-phone-link" @click="handleResetPhoneClick">换绑</a>
        </div>
      </div>
      <!-- 邮箱 -->
      <div class="setting-item">
        <div class="setting-item-title">
          邮箱
        </div>
        <div class="setting-item-content">
          {{ userStore.userInfo?.email || '' }}
        </div>
      </div>
      <!-- 密码 -->
       <div class="setting-item">
        <div class="setting-item-title">
          密码
        </div>
        <div class="setting-item-content">
          如需更改，请前往设置<router-link to="/reset-password" class="reset-password-link">更改</router-link>
        </div>
      </div>
    </div>

    <!-- 第一个弹窗：手机验证 -->
    <el-dialog
      v-model="showPhoneVerifyDialog"
      :close-on-click-modal="false"
      :show-close="false"
      :width="'552px'"
      class="phone-verify-dialog"
      center
    >
      <!-- 自定义标题 -->
      <div slot="header" class="dialog-header">
        <h3 class="dialog-title">手机验证</h3>
      </div>
      <div class="dialog-content">
        <p class="verify-text">点击获取验证码，将有一条包含验证码的短信发送至您绑定的手机号 <span style="color: #2563EB;">{{ phoneMask(userStore.userInfo?.phone || '') }}</span></p>
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
        <el-button @click="handleVerifyCancel" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleVerifyConfirm" :disabled="!verifyPhoneForm.verificationCode" class="confirm-btn">确认</el-button>
      </div>
    </el-dialog>

    <!-- 第二个弹窗：更换手机号 -->
    <el-dialog
      v-model="showChangePhoneDialog"
      :close-on-click-modal="false"
      :show-close="false"
      :width="'480px'"
      class="change-phone-dialog"
      center
    >
      <!-- 自定义标题 -->
      <div slot="header" class="dialog-header">
        <h3 class="dialog-title">更换手机号</h3>
      </div>
      <div class="dialog-content">
        <el-form :model="changePhoneForm" :rules="changePhoneRules" ref="changePhoneFormRef" class="change-form">
          <el-form-item label="新的手机号" prop="newPhone">
            <el-input
              v-model.trim="changePhoneForm.newPhone"
              placeholder="请输入新的手机号"
              maxLength="11"
              @input="handleNewPhoneInput"
              type="tel"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="newVerificationCode">
            <div class="code-input-wrapper">
              <el-input
                v-model.trim="changePhoneForm.newVerificationCode"
                placeholder="请输入验证码"
                style="width: 344px"
              />
              <el-button
                plain
                type="primary"
                @click="handleGetNewVerifyCode"
                :disabled="newCountdown > 0 || !changePhoneForm.newPhone"
                class="code-btn"
              >
                {{ newCountdown > 0 ? `${newCountdown}s后重新获取` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleChangeCancel" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleChangeConfirm" :disabled="!changePhoneForm.newPhone || !changePhoneForm.newVerificationCode" class="confirm-btn">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from "../stores/user";
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../api';

export default {
  name: "AccountSetting",
  setup() {
    const userStore = useUserStore();

    // 第一个弹窗：手机验证
    const showPhoneVerifyDialog = ref(false);
    const verifyPhoneForm = reactive({
      verificationCode: ''
    });
    const verifyPhoneFormRef = ref();
    const countdown = ref(0);

    // 第二个弹窗：更换手机号
    const showChangePhoneDialog = ref(false);
    const changePhoneForm = reactive({
      newPhone: '',
      newVerificationCode: ''
    });
    const changePhoneFormRef = ref();
    const newCountdown = ref(0);
    const disabledGetNewCode = ref(true);

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

    const changePhoneRules = reactive({
      newPhone: [
        { required: true, message: '请输入新的手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      newVerificationCode: [
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

    // 打开手机验证弹窗
    const handleResetPhoneClick = () => {
      showPhoneVerifyDialog.value = true;
    };

    // 获取手机验证验证码
    const handleGetVerifyCode = async () => {
      try {
        // 检查userInfo是否存在
        if (!userStore.userInfo?.phone) {
          ElMessage.warning('用户信息不完整，请重新登录');
          return;
        }
        
        await api.getVerificationCode({ phone: userStore.userInfo.phone, type: '4' });
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

    // 手机验证取消
    const handleVerifyCancel = () => {
      showPhoneVerifyDialog.value = false;
      verifyPhoneForm.verificationCode = '';
    };

    // 手机验证确认
    const handleVerifyConfirm = async () => {
      if (!verifyPhoneFormRef.value) return;
      
      // 检查userInfo是否存在
      if (!userStore.userInfo?.phone) {
        ElMessage.warning('用户信息不完整，请重新登录');
        showPhoneVerifyDialog.value = false;
        return;
      }
      
      await verifyPhoneFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 验证验证码
            const res = await api.verifyVerificationCode({
              phone: userStore.userInfo.phone,
              verificationCode: verifyPhoneForm.verificationCode,
              type: '4'
            });
            
            if (res.success) {
              // 验证成功，关闭第一个弹窗，打开第二个弹窗
              showPhoneVerifyDialog.value = false;
              verifyPhoneForm.verificationCode = '';
              showChangePhoneDialog.value = true;
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

    // 处理新手机号输入
    const handleNewPhoneInput = (value) => {
      // 移除所有非数字字符
      if (changePhoneFormRef.value) {
        changePhoneFormRef.value.validateField('newPhone', (valid) => {
          disabledGetNewCode.value = !valid || newCountdown.value > 0;
        });
      }
    };

    // 获取新手机号验证码
    const handleGetNewVerifyCode = async () => {
      // 验证新手机号格式
      if (!changePhoneForm.newPhone) {
        ElMessage.warning('请输入新手机号');
        return;
      }
      
      if (!/^1[3-9]\d{9}$/.test(changePhoneForm.newPhone)) {
        ElMessage.warning('请输入正确的手机号');
        return;
      }
      
      try {
        // 调用API获取验证码，type=3表示修改手机号
        await api.getVerificationCode({ phone: changePhoneForm.newPhone, type: '3' });
        ElMessage.success('验证码发送成功');
        
        // 开始倒计时
        newCountdown.value = 60;
        const timer = setInterval(() => {
          newCountdown.value--;
          if (newCountdown.value <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      } catch (error) {
        ElMessage.error('验证码发送失败，请稍后重试');
        console.error('发送验证码失败:', error);
      }
    };

    // 更换手机号取消
    const handleChangeCancel = () => {
      showChangePhoneDialog.value = false;
      changePhoneForm.newPhone = '';
      changePhoneForm.newVerificationCode = '';
    };

    // 更换手机号确认
    const handleChangeConfirm = async () => {
      if (!changePhoneFormRef.value) return;
      
      // 检查userInfo是否存在
      if (!userStore.userInfo?.phone) {
        ElMessage.warning('用户信息不完整，请重新登录');
        showChangePhoneDialog.value = false;
        return;
      }
      
      await changePhoneFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 调用更换手机号API
            const res = await api.changePhone({
              oldPhone: userStore.userInfo.phone,
              newPhone: changePhoneForm.newPhone,
              verificationCode: changePhoneForm.newVerificationCode
            });
            
            if (res.success) {
              ElMessage.success('手机号更换成功');
              
              // 更新用户信息
              userStore.updateUserInfo({ phone: changePhoneForm.newPhone });
              
              // 关闭弹窗
              showChangePhoneDialog.value = false;
              changePhoneForm.newPhone = '';
              changePhoneForm.newVerificationCode = '';
            } else {
              ElMessage.error(res.errorMessage || '手机号更换失败，请重试');
            }
          } catch (error) {
            ElMessage.error('手机号更换失败，请重试');
            console.error('更换手机号失败:', error);
          }
        }
      });
    };

    return {
      userStore,
      showPhoneVerifyDialog,
      verifyPhoneForm,
      verifyPhoneFormRef,
      countdown,
      showChangePhoneDialog,
      changePhoneForm,
      changePhoneFormRef,
      newCountdown,
      disabledGetNewCode,
      verifyPhoneRules,
      changePhoneRules,
      phoneMask,
      handleResetPhoneClick,
      handleGetVerifyCode,
      handleVerifyCancel,
      handleVerifyConfirm,
      handleNewPhoneInput,
      handleGetNewVerifyCode,
      handleChangeCancel,
      handleChangeConfirm
    };
  }
}
</script>

<style scoped>
.account-setting {
  width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  
}

.title {
  margin-top: 80px;
  font-size: 30px;
  font-weight: bold;
  color: #111827;
  text-align: center;
}

.content {
  width: 480px;
  margin: 0 auto;
}

.setting-item {
  margin-top: 36px;
  line-height: 22px;
  font-size: 16px;
  font-weight: normal;
}
.setting-item-title {
  color: #383838;
}
.setting-item-content {
  margin-top: 12px;
  color: #000000;
  font-weight: bold;
}
.reset-password-link,
.reset-phone-link {
  margin-left: 30px;
  color: #2563EB;
}

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

.verify-form,
.change-form {
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
.change-phone-dialog .el-dialog__header {
  display: none;
}
</style>