<template>
  <div class="developer-info">
    <div v-if="isLoaded" class="apply-bar">
      <el-button type="primary" @click="handleApplyTestClick" :class="{'has-test': hasTestDeveloper}">申请测试开发者ID</el-button>
      <el-button v-if="showProdApplyBtn" type="primary" @click="handleApplyProdClick">申请生产开发者ID</el-button>
    </div>
    <div v-if="isLoaded" class="table-wrapper">
      <el-table :data="tableData" border style="width: 100%" size="medium">
        <el-table-column type="index" prop="index" label="序号" width="60" />
        <el-table-column prop="developerName" label="开发者名称" min-width="150" />
        <el-table-column prop="userId" label="开发者ID" width="150" />
        <el-table-column prop="category" label="分类" width="80" />
         <el-table-column prop="status" label="审核状态" :formatter="formatStatus" width="90" />
        <el-table-column prop="applyTm" label="申请时间" width="176" />
        <!-- 操作 -->
         <el-table-column label="操作" width="160" fixed="right">
           <template #default="scope">
             <!-- status 通过 时显示 -->
             <template v-if="scope.row.status === 2">
              <el-button type="primary" link size="medium" @click="handleViewSecretClick(scope.row)">查看密钥</el-button>
              <!-- 接口管理 -->
              <el-button type="primary" link size="medium" @click="handleInterfaceManageClick(scope.row)">接口管理</el-button>
             </template>
             <!-- status 拒绝 时显示 -->
             <template v-else-if="scope.row.status === 3">
               <el-button type="primary" link size="medium" @click="handleApplyClick(scope.row)">重新申请</el-button>
             </template>
           </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查看密钥弹窗 -->
    <el-dialog v-model="secretDialogVisible" header-class="secret-dialog-header" class="secret-dialog" :show-title="false" width="408px">
      <div class="secret-content">
        <div class="secret-item developer-id">
         <span style="word-break: keep-all;"> 开发者ID：</span>{{ currentSecret?.developerId || '' }}
        </div>
        <div class="secret-item" style="position: relative; padding-right: 48px;">
           <span style="word-break: keep-all;"> 密钥：</span>{{ maskedSecret }}   
           <span class="copy-btn" @click="copySecret" title="复制密钥"></span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="secretDialogVisible = false" style="width: 100%;">好的</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { useRouter } from "vue-router";
  import { useUserStore } from "../stores/user";
  import api from "../api";
  import { CopyDocument } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import { encrypt } from '../utils/encrypt';

export default {
  name: "DeveloperInfo",
  components: {
    CopyDocument
  },
  data() {
    return {
      tableData: [],
      router: useRouter(),
      isLoaded: false,
      secretDialogVisible: false,
      currentSecret: {
        developerId: '',
        key: ''
      },
      hasTestDeveloper: false,
    };
  },
  computed: {
    maskedSecret() {
      const secret = this.currentSecret.key;
      if (!secret || secret.length <= 4) return secret;
      // 保留前4位，中间4位星号，其余显示
      const prefix = secret.slice(0, 4);
      const suffix = secret.slice(8);
      return `${prefix}****${suffix}`;
    },
    showProdApplyBtn() {
      return this.hasTestDeveloper && this.tableData.some(item => item.type === 'test' && item.status === 2)
    }
  },
  methods: {
    handleApplyTestClick() {
      if (this.hasTestDeveloper) {
        ElMessage.error('最多只能申请1个测试开发者ID')
        return
      }
      this.router.push({ path: '/developer/developer-info/apply-test'})
    },
    handleApplyProdClick() {
      this.router.push({ path: '/developer/developer-info/apply-prod'})
    },
    async getDeveloperList() {
      this.tableData = []
      try {
        const userStore = useUserStore()
        const resTest = await api.getDeveloperList({
          userName: userStore.userInfo?.userName,
          pageNum: 1,
          pageSize: 99999,
        }, 'test')
        if (resTest.success) {
          this.hasTestDeveloper = resTest.obj?.length > 0
          this.tableData.push(...resTest.obj.map(item => ({ ...item, category: '测试', type: 'test' })) || [])
        }
        const resProd = await api.getDeveloperList({  
          userName: userStore.userInfo?.userName,
          pageNum: 1,
          pageSize: 99999,
        }, 'prod')
        if (resProd.success) {
          this.tableData.push(...resProd.obj.map(item => ({ ...item, category: '生产', type: 'prod' })) || [])
        }
      } catch (error) {
        // ElMessage.error(error.message || '获取开发者列表失败，请稍后重试')
      } finally {
        this.isLoaded = true
      } 
      
    },
    async handleViewSecretClick(row) {
      // 查看密钥点击事件，暂时留空
      console.log('查看密钥', row);
      // 调用查看密钥接口
      const res = await api.getSecretKey(row.userName)
      if (res.success) {
        this.currentSecret = res.obj || { developerId: '', key: '' }
      } else {
        ElMessage.error(res.errorMessage || '查看密钥失败，请稍后重试')
      }
      this.secretDialogVisible = true;
    },
    handleInterfaceManageClick(row) {
      // 接口管理点击事件，暂时留空
      console.log('接口管理', row);
      // 将整个query对象加密成一个params参数
      const queryData = { type: row.type, developerId: row.userId };
      const encryptedParams = encrypt(queryData);
      this.router.push({ path: '/developer/developer-info/interface-management', query: { params: encryptedParams }})
    },
    async copySecret() {
      try {
        // 优先使用现代Clipboard API
        await navigator.clipboard.writeText(this.currentSecret.key);
        ElMessage.success('密钥已复制');
      } catch (err) {
        console.error('Clipboard API复制失败:', err);
        // 降级使用传统execCommand方法
        try {
          // 创建临时textarea元素
          const textarea = document.createElement('textarea');
          textarea.value = this.currentSecret.key;
          // 设置样式使其不可见
          textarea.style.position = 'fixed';
          textarea.style.left = '-999999px';
          textarea.style.top = '-999999px';
          document.body.appendChild(textarea);
          // 选中并复制
          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);
          document.execCommand('copy');
          // 移除临时元素
          document.body.removeChild(textarea);
          ElMessage.success('密钥已复制');
        } catch (execErr) {
          console.error('execCommand复制失败:', execErr);
          ElMessage.error('复制失败，请手动复制');
        }
      }
    },
    formatStatus(row,
    column,
    cellValue,
    index) {
      if (cellValue === 1) {
        return '待审核'
      } else if (cellValue === 2) {
        return '同意'
      } else if (cellValue === 3) {
        return '驳回'
      } else {
        return ''
      }
    },
    handleApplyClick(row) {
      if (row.type === 'test') {
        this.handleApplyTestClick()
      } else if (row.type === 'prod') {
        this.handleApplyProdClick()
      }
    }
  },
  mounted() {
    const dom = document.querySelector('.vp-page-title')
    if (dom) {
      dom.style.display = 'none'
    }
    this.getDeveloperList()
  },
  beforeUnmount() {
    const dom = document.querySelector('.vp-page-title')
    if (dom) {
      dom.style.display = 'block'
    }
  }
}
</script>
<style scoped lang="scss">
.developer-info {
  width: 100%;
  padding: 24px;
  overflow: hidden;
}


.table-wrapper {
  width: 100%;
  margin-top: 16px;
  overflow-x: auto;
  position: relative;
}

/* 查看密钥弹窗样式 */
.secret-content {
  padding: 8px;
}

.secret-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  font-size: 20px;
  color: #303133;
  line-height: 24px;
  word-break: break-all;

  &.developer-id {
    color: #000000;
    font-weight: bold;
     line-height: 28px;
  }
}

.secret-label {
  width: 80px;
  color: #606266;
}

.secret-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.copy-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 24px;
  height: 24px;
  background-image: url('../assets/svg/copy.svg');
  background-size: cover;
  cursor: pointer;
}



/* 弹窗底部按钮样式 */
.dialog-footer {
  text-align: center;
  padding: 0 8px 20px;
  .el-button {
    font-size: 18px;
    height: 48px;
  }
}
</style>
<style>
.secret-dialog-header {
  display: none;
}

.table-wrapper .el-table__header tr {
  background-color: #F4F4F4;
}

.secret-dialog .el-dialog__footer {
  padding: 0;
}

.developer-info .apply-bar .has-test.el-button {
  border: 1px solid #B91818;
  background-color: #ffffff;
  color: #B91818;
}

.developer-info .apply-bar .has-test.el-button:hover {
  border-color: #D01B1B;
  color: #D01B1B;
}

</style>
