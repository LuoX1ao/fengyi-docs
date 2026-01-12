<template>
  <div class="apply-developer">
    <div class="apply-form-wrapper">
      <h2>申请{{ envType }}开发者ID</h2>
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        class="apply-form"
        label-position="top"
      >
        <el-form-item label="开发者名称" prop="developerName">
          <!-- 自定义label -->
          <template #label>
            <div style="display: inline-flex; align-items: center;">
              <span style="margin-right: 8px;">开发者名称</span>
              <el-popover placement="top" effect="dark" width="200" trigger="hover">
                <template #reference>
                  <span class="question-mark"></span>
                </template>
                <div>建议以公司+系统名称命名</div>
              </el-popover>
            </div>
          </template>
          <el-input
            v-model.trim="formData.developerName"
            placeholder="请输入开发者名称"
            maxlength="20"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model.trim="formData.companyName"
            placeholder="请输入公司名称"
            maxlength="50"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="统一社会信用代码" prop="uscc">
          <el-input
            v-model.trim="formData.uscc"
            placeholder="请输入统一社会信用代码"
            maxlength="18"
            clearable
          />
        </el-form-item>

        <el-form-item label="经营类型" prop="businessType">
          <el-select
            v-model.trim="formData.businessType"
            placeholder="请选择经营类型"
            clearable
          >
            <el-option v-for="item in businessTypes" :key="item.businessCode" :label="item.businessVal" :value="item.businessVal" />
          </el-select>
        </el-form-item>
        
        <!-- 省市区级联选择器 -->
        <el-form-item label="通讯地址" prop="address">
          <el-cascader
            ref="addressCascaderRef"
            v-model="formData.address"
            :props="cascaderProps"
            placeholder="请选择通讯地址"
            clearable
            style="width: 100%"
            @change="handleAddressChange"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="adr">
          <el-input
            v-model.trim="formData.adr"
            placeholder="请输入详细地址"
            clearable
            maxlength="50"
          />
        </el-form-item>
        
        <el-form-item label="申请原因" prop="applyReason">
          <el-input
            v-model.trim="formData.applyReason"
            placeholder="请输入申请原因"
            clearable
            maxlength="200"
          />
        </el-form-item>
        
        <el-form-item label="申请开通接口权限" prop="interfacesList">
          <el-checkbox-group v-model="formData.interfacesList" class="api-permissions-group">
            <el-row :gutter="20">
              <el-col :span="8" v-for="item in interfacesList" :key="item.interCode" style="display: flex; align-items: center;">
                <el-checkbox :label="item.id" :key="item.interCode">
                  <span style="display: inline-block; width: 100px; text-align: left; word-break: break-word; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">{{ item.interName }}</span>
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item class="submit-btn-item">
          <!-- 默认不可点击，所有必填项填写后才会启用 -->
          <el-button type="primary" @click="handleSubmit" class="submit-btn" :loading="submitting" :disabled="disabledSubmit">
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  type: {
    type: String,
    default: 'test'
  }
})

const envType = computed(() => props.type === 'test' ? '测试' : props.type === 'prod' ? '生产' : '')


const addressCascaderRef = ref()

// 经营类型数据
const businessTypes = ref([])

// 接口权限数据
const interfacesList = ref([])

// 地址级联选择器数据
const addressOptions = ref([])

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive({
  developerName: '',
  companyName: '',
  uscc: '',
  businessType: '',
  address: [], // 级联选择器的value，格式：[provinceId, cityId, districtId]
  province: '',
  provinceName: '',
  city: '',
  cityName: '',
  district: '',
  districtName: '',
  adr: '',
  applyReason: '',
  interfacesList: []
})

// 级联选择器配置
const cascaderProps = {
  // value: 'distId',
  // label: 'distCnName',
  // children: 'children',
  checkStrictly: false, // 非严格模式，只能选择叶子节点
  emitPath: true, // 返回完整路径
  lazy: true,
  value: 'distId',
  label: 'distCnName',
  lazyLoad: async (node, resolve) => {
    if (node.level === 0) {
      const res = await api.getAreaDict()
      if (res.success && res.obj && res.obj.records) {
        resolve(res.obj.records)
      } else {
        resolve([])
      }
    } else {
      const res = await api.getAreaDict(node.value)
      if (res.success && res.obj && res.obj.records) {
        resolve(res.obj.records.map(item => {
          if (node.level === 1) {
            return item
          } else if (node.level === 2) {
            return {
              leaf: true,
              ...item,
            }
          }
        }))
      } else {
        resolve([])
      }
    }
  }
}

// 表单验证规则
const formRules = reactive({
  /**
   * 开发者名称
   */
  developerName: [
    { required: true, message: '请输入开发者名称', trigger: 'blur' },
  ],
  /**
   * 公司名称
   */
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
  ],
  businessType: [
    { required: true, message: '请选择经营类型', trigger: 'change' },
  ],
  uscc: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Za-z]+$/, message: '统一社会信用代码只能包含数字和英文字母', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请选择通讯地址', trigger: 'change' },
  ],
  adr: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
  ],
  applyReason: [
    { required: true, message: '请输入申请原因', trigger: 'blur' },
  ],
  interfacesList: [
    { required: true, message: '请至少选择一个接口权限', trigger: 'change' }
  ]
})

const disabledSubmit = computed(() => {
  return !formData.businessType || !formData.uscc || !formData.address.length || !formData.adr || !formData.applyReason || formData.interfacesList.length === 0
})


// 提交状态
const submitting = ref(false)

// 递归处理地址数据，构建级联选择器所需的树形结构
const buildAddressTree = (records, parentId = 'A000086000') => {
  const result = []
  const items = records.filter(item => item.distParentId === parentId)
  
  for (const item of items) {
    const children = buildAddressTree(records, item.distId)
    const treeItem = {
      ...item,
      children: children.length > 0 ? children : undefined
    }
    result.push(treeItem)
  }
  
  return result
}

// 加载所有地址数据并构建树形结构
// const loadAllAddressData = async () => {
//   try {
//     // 首先获取所有省份
//     const provinceRes = await getAreaDict('A000086000')
//     if (!provinceRes.success || !provinceRes.obj || !provinceRes.obj.records) {
//       ElMessage.error('获取地址数据失败，请稍后重试')
//       return
//     }
// }

// 地址选择变化处理
const handleAddressChange = (value) => {
  console.log('value', value)
  if (!value || value.length !== 3) {
    // 重置省份、城市、区县信息
    formData.province = ''
    formData.provinceName = ''
    formData.city = ''
    formData.cityName = ''
    formData.district = ''
    formData.districtName = ''
    return
  }
  const checkedNodes = addressCascaderRef.value.getCheckedNodes()
  console.log('checkedNodes', checkedNodes)

  
  // 根据选择的ID找到对应的名称
  const [provinceId, cityId, districtId] = value
  const [provinceName, cityName, districtName] = checkedNodes[0].pathLabels
  
  formData.province = provinceId
  formData.provinceName = provinceName
  formData.city = cityId
  formData.cityName = cityName
  formData.district = districtId
  formData.districtName = districtName
}

// 递归查找地址项
const findAddressItem = (items, id) => {
  for (const item of items) {
    if (item.distId === id) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findAddressItem(item.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 从用户 store 中获取 userName
        const userStore = useUserStore()

        // 获取完整对象
        const interfaces = formData.interfacesList.map(item => {
          const target = interfacesList.value.find(i => i.id === item)
          return {
            ...target
          }
        })

        // 构建提交数据，只包含需要的字段
        const submitData = {
          userName: userStore.userInfo?.userName || '',
          developerName: formData.developerName,
          companyName: formData.companyName,
          uscc: formData.uscc,
          businessType: formData.businessType,
          province: formData.province,
          provinceName: formData.provinceName,
          city: formData.city,
          cityName: formData.cityName,
          district: formData.district,
          districtName: formData.districtName,
          adr: formData.adr,
          applyReason: formData.applyReason,
          interfacesList: formData.interfacesList,
        }
        
        // 调用API提交申请
        const res = await api.applyDeveloper(submitData, props.type)
        
        if (res.success) {
          ElMessage.success('申请提交成功')
          console.log('申请提交成功:', res)
          // 重置表单
          formRef.value.resetFields()
        
          router.push({ path: '/developer/developer-info/' })
        } else {
          ElMessage.error(res.errorMessage || '申请提交失败，请稍后重试')
        }
      } catch (error) {
        ElMessage.error('申请提交失败，请稍后重试')
        console.error('申请提交失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  document.querySelector('.vp-page-title').style.display = 'none'
  // 初始化经营类型数据字典
  api.getBusinessTypeDict().then(res => {
    if (res.success) {
      businessTypes.value = res.obj || []
    }
  })

  // 初始化接口权限数据字典
  api.getInterfacesList().then(res => {
    if (res.success) {
      interfacesList.value = res.obj || []
    }
  })
})

onUnmounted(() => {
  document.querySelector('.vp-page-title').style.display = 'block'
})
</script>

<style scoped lang="scss">
.apply-developer {
  background-color: #fff;
  margin: 20px auto;
}

.apply-form-wrapper {
  background-color: #fff;
}

.apply-form-wrapper h2 {
  text-align: center;
  margin-top: 80px !important;
  margin-bottom: 20px;
  color: #303133;
  font-size: 24px;
  border-bottom: none;
}

.env-type {
  text-align: center;
  margin-bottom: 30px;
  color: #B91818;
  font-size: 16px;
}

.apply-form {
  width:480px;
  margin: 20px auto;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 18px;
}

.submit-btn-item {
  padding-top: 10px;
  margin-bottom: 30px;
}

.api-permissions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.api-permissions-group .el-checkbox {
  margin-bottom: 10px;
}

/* 级联选择器样式 */
.el-cascader {
  width: 100%;
}

.question-mark {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-image: url('../assets/svg/question.svg');
  background-size: auto 100%;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>

<style lang="scss">
.apply-form {
  .el-form-item__label {
    font-size: 16px;
    color: #383838;
    font-weight: 500;
  }
  
  .el-input__wrapper,
  .el-textarea__inner {
    border-radius: 4px;
  }
  
  .el-button--primary {
    background-color: #B91818;
    border-color: #B91818;
    
    &:hover,
    &:focus {
      background-color: #EB6565;
      border-color: #EB6565;
    }
  }
}
</style>