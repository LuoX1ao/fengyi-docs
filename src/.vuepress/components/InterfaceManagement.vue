<template>
  <div class="interface-management">
    <div class="top-bar">
      <!-- 返回按钮，图标形式 -->
      <div class="top-left">
        <div class="back-btn" @click="router.back()"></div>
        <div class="developer-info">
          <div class="developer-id">{{type === 'test' ? '测试' : type === 'prod' ? '生产' : ''}}开发者ID：{{ developerId }}</div>
        </div>
      </div>
      <div class="top-right">
        <el-button v-if="activeName === 'first' && applyFlag === 1" type="primary"  @click="openApplyDialog">申请权限</el-button>
        <el-button v-if="activeName === 'first' && applyFlag === 0" type="primary" disabled>审核中</el-button>

        <el-button v-else-if="activeName === 'second' && !isEditingCallback" type="primary"  @click="openCallbackUpdateDialog">修改</el-button>
        <div v-else-if="activeName === 'second' && isEditingCallback">
          <el-button  @click="cancelEditCallback">取消</el-button>
          <el-button type="primary"  @click="saveEditCallback">保存</el-button>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="interface-tabs" @tab-click="handleClick">
      <el-tab-pane label="接口权限" name="first">
        <el-table :data="interfaceData" border style="width: 100%" >
          <el-table-column prop="interName" label="接口名称" min-width="150" />
          <el-table-column prop="httpUrl" label="接口地址" min-width="300" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="回调配置" name="second">
        <el-form :model="callbackData"  ref="callbackFormRef" label-position="top">
          <el-table :data="callbackData" border style="width: 100%" >
            <el-table-column prop="interName" label="接口名称" min-width="150" />
            <el-table-column label="URL地址" min-width="300">
              <template #default="scope">
                <el-form-item v-if="isEditingCallback" :prop="`callbackData[${scope.$index}].httpUrl`" :rules="callbackRules.httpUrl">
                  <el-input
                    v-model="callbackData[scope.$index].httpUrl"
                    placeholder="请输入URL地址"
                    maxlength="200"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.httpUrl }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 申请权限弹窗 -->
    <el-dialog
      v-model="applyDialogVisible"
      title=""
      width="500px"
      header-class="apply-interface-dialog-header" 
      body-class="apply-interface-dialog-body"
      :close-on-click-modal="false"
    >
      <div class="dialog-title">{{ type === 'test' ? '申请测试接口权限' : type === 'prod' ? '生产环境接口权限' : '' }}</div>
      <el-form :model="applyForm" :rules="rules" ref="applyFormRef" label-position="top">
        <el-form-item label="开发者ID">
          <div class="developer-id">{{ applyForm.developerId }}</div>
          <!-- <el-input v-model="applyForm.developerId" disabled placeholder="开发者ID" /> -->
        </el-form-item>
        <el-form-item label="申请原因" prop="applyReason">
          <el-input
            v-model="applyForm.applyReason"
            placeholder="请输入申请原因"
          />
        </el-form-item>
        <el-form-item label="申请开通接口权限" prop="interfacesList">
          <el-checkbox-group v-model="applyForm.interfacesList" class="select-inter-group">
            <el-row :gutter="20">
              <el-col :span="8" v-for="item in interfacesList" :key="item.interCode" style="margin: 6px 0;">
                <el-checkbox :value="item.id" :key="item.interCode" :disabled="item.checked" :checked="item.checked">
                  <span style="display: inline-block; width: 100px; text-align: left; word-break: break-word; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">{{ item.interName }}</span>
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="interface-management-dialog-footer">
          <el-button class="cancel-btn" @click="handleApplyDialogClose">取消</el-button>
          <el-button class="confirm-btn" type="primary" @click="handleApply" :disabled="!canSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 手机验证弹窗 -->
    <PhoneVerification
      :visible="callbackVerifyVisible"
      :phone-number="userStore.userInfo?.phone || ''"
      title="手机验证"
      verify-text="点击获取验证码，将有一条包含验证码的短信发送至您绑定的手机号"
      code-type="5"
      verify-type="5"
      @success="handleCallbackVerifySuccess"
      @cancel="callbackVerifyVisible = false"
      @close="callbackVerifyVisible = false"
    />
  </div>
</template>

<script setup>
  import { ref, computed, reactive, toRefs, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from "../stores/user"
  import { ElMessage } from 'element-plus'
  import PhoneVerification from './PhoneVerification.vue'
  import { decrypt } from '../utils/encrypt'
  import api from '../api'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  // 路由参数
  const developerId = ref('')
  const type = ref('')

  // 组件挂载时解密参数
  onMounted(() => {
    try {
      const params = route.query.params
      if (params) {
        const decryptedParams = decrypt(params)
        developerId.value = decryptedParams.developerId || ''
        type.value = decryptedParams.type || ''
        console.log('解密后的参数:', { developerId: developerId.value, type: type.value })
        getPassedInterfacesList()
      }
    } catch (error) {
      console.error('参数解密失败:', error)
      ElMessage.error('页面参数解析失败，请重试')
    }
  })

  function getPassedInterfacesList() {
    api.getPassedInterfacesList({
          userName: userStore.userInfo?.userName || ''
        }).then(res => {
          if (res.success) {
            interfaceData.value = res.obj.developerInterfaces || []
            applyFlag.value = res.obj.flag
            console.log('applyFlag.value', applyFlag.value)
          }
        })
  }

  function getCallbackList() {
    api.getPassedInterfacesList({
          userName: userStore.userInfo?.userName || '',
          callBack: 1,
        }).then(res => {
          if (res.success) {
            callbackData.value = res.obj.developerInterfaces || []
             applyFlag.value = res.obj.flag
          }
        })
  }

  const activeName = ref('first')

  function handleClick(tab) {
    console.log(tab, activeName.value)
    if (tab.paneName.value === 'first') {
      getPassedInterfacesList()
    } else {
      isEditingCallback.value = false
      getCallbackList()
    }

  }

  const interfacesList = ref([])

  const interfaceData = ref([])
  // 默认不可申请
  const applyFlag = ref(false)

  const callbackData = ref([])
  const callbackRules = ref({
    httpUrl: [
      { required: true, validator: validateCallbackUrl, trigger: 'blur' },
    ]
  })
  const callbackFormRef = ref()

  // 手机验证弹窗相关
  const callbackVerifyVisible = ref(false)
  const callbackUpdateDialogVisible = ref(false)

  // 编辑回调配置相关
  const isEditingCallback = ref(false)
  const originalCallbackData = ref([])
  const validUrls = ref({})

  // URL验证正则：支持数字、字母、特殊符号，上限200位
  const urlRegex = /^[\d\w\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/i

  // 申请权限弹窗相关
  const applyDialogVisible = ref(false)
  const applyFormRef = ref()
  const applyForm = ref({
    developerId: developerId.value,
    applyReason: '',
    interfacesList: []
  })

  // 表单验证规则
  const rules = ref({
    applyReason: [
      { required: true, message: '请输入申请原因', trigger: 'blur' }
    ],
    interfacesList: [
      { required: true, message: '请选择要开通的接口权限', trigger: 'change' }
    ]
  })

  // 计算属性：是否可以提交
  const canSubmit = computed(() => {
    return applyForm.value.applyReason.trim() && applyForm.value.interfacesList.length > 0
  })

  // 打开申请弹窗
  function openApplyDialog() {
    applyForm.value.developerId = developerId.value
    applyDialogVisible.value = true
    api.getInterfacesList().then(res => {
      if (res.success) {
        // 在 interfaceData 中存在的数据，默认选择，且不可取消选择
        interfacesList.value = res.obj.map(item => ({
          ...item,
          interCode: item.interCode || '',
          checked: interfaceData.value.some(iface => iface.interId === item.id)
        })) || []
        console.log('interfacesList.value', interfacesList.value)
      }
    })
  }

  // 关闭弹窗
  function handleApplyDialogClose() {
    applyDialogVisible.value = false
    // 重置表单
    if (applyFormRef.value) {
      applyFormRef.value.resetFields()
    }
  }

  // 提交申请
  function handleApply() {
    // 表单验证
    if (!canSubmit.value) {
      ElMessage.warning('请填写申请原因并选择要开通的接口权限')
      return
    }

    const interList =  applyForm.value.interfacesList.filter(item => !interfaceData.value.some(iface => iface.interId === item))
    const submitData = {
      userName: userStore.userInfo?.userName || '',
      applyReason: applyForm.value.applyReason,
      interfacesList: interList,
    }
    api.submitInterfaces(submitData).then(res => {
      if (res.success) {
        ElMessage.success('申请提交成功！')
        handleApplyDialogClose()
        getPassedInterfacesList()
      } else {
        ElMessage.error(res.errorMessage || '申请提交失败')
      }
    })
  }

  // 打开回调配置修改弹窗
  function openCallbackUpdateDialog() {
    callbackVerifyVisible.value = true
  }

  // 回调配置手机验证成功
  function handleCallbackVerifySuccess(data) {
    console.log('手机验证成功:', data)
    callbackVerifyVisible.value = false
    
    // 进入编辑模式
    isEditingCallback.value = true
    
    // 保存原始数据
    originalCallbackData.value = JSON.parse(JSON.stringify(callbackData.value))
  }

  // 取消编辑回调配置
  function cancelEditCallback() {
    // 恢复原始数据
    callbackData.value = JSON.parse(JSON.stringify(originalCallbackData.value))
    
    // 退出编辑模式
    isEditingCallback.value = false
    // validUrls.value = {}
  }

  // 保存编辑回调配置
  async function saveEditCallback() {
    const valid = await callbackFormRef.value.validate()
    if (!valid) {
      return
    }

    const params = {
      userName: userStore.userInfo?.userName || '',
      developerInterfaces: callbackData.value.map(item => ({
        interId: item.interId,
        httpUrl: item.httpUrl
      }))
    }
    const res = await api.editCallback(params)
    if (!res.success) {
      ElMessage.error(res.errorMessage || '回调配置保存失败')
      return
    }
    ElMessage.success('回调配置保存成功！')
    isEditingCallback.value = false
    getCallbackList()
  }

  // 验证URL地址
  function validateCallbackUrl(rules, value, callback) {
    // 从rules.field中获取当前字段的索引
    const index = rules.field.split('[')[1].replace('].httpUrl', '')
    const val = callbackData.value[index].httpUrl
    const url = val?.trim() || ''
    if (!url) {
      callback(new Error('请输入URL地址'))
    }
    if (url.length > 200) {
      callback(new Error('URL地址不能超过200位'))
    }
    if (!urlRegex.test(url)) {
      callback(new Error('URL地址只能包含数字、字母、特殊符号'))
    }
    callback()
  }
</script>

<style scoped>
h1 {
  margin-bottom: 24px;
}

.interface-management {
  padding: 24px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .top-left {
    display: flex;
    align-items: center;
    .developer-info {
      margin-left: 1rem;
      color: #000000;
      font-size: 20px;
      font-weight: 500;
      line-height: normal;
    }
  }
}

.back-btn {
  width: 24px;
  height: 24px;
  background-image: url('../assets/svg/back.svg');
  background-size: cover;
}

.interface-tabs {
  margin-top: 1rem;
}

/* 申请权限弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 多选框样式 */
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .el-checkbox__label {
    line-height: 22px;
  }
  .el-checkbox {
    min-height: 32px;
    height: auto;
  }
}



:deep(.apply-interface-dialog-header) {
  display: none;
}
:deep(.apply-interface-dialog-body) {
  padding: 16px 16px 12px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 24px;
  color: #000000;
}

.developer-id {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: #000000;
}

.interface-management-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;

  .el-button {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  .cancel-btn {
    width: 160px;
    background-color: #E2E5EB;
    color: #7D8899;
  }
  .confirm-btn {
    width: 296px;
    &.is-disabled {
      background-color: rgba(185, 24, 24, 0.3);
    }
  }

}
</style>