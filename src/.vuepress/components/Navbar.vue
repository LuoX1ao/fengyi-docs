<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-content">
        <div class="logo"></div>
        <div class="nav-bar" :class="{'logined': isLoggedIn}">
          <template v-for="(item, i) in navList" :key="i">
            <router-link
            v-if="!item.hidden && !item.isCustomLink"
            :to="item.path"
            :class="{ current: item.active }"
            @click="handleRouteClick(item)"
            >{{ item.name }}</router-link
          >
            <a
            v-else-if="!item.hidden && item.isCustomLink"
            :class="{ current: item.active }"
            @click="handleCustomLinkClick(item)"
            style="cursor: pointer;"
            >{{ item.name }}</a
          >
          </template>
        </div>
      </div>
      <div v-if="!isLoggedIn" class="login-register">
        <router-link to="/login" class="login-btn"  :class="{ current: isLoginActive }">登录</router-link>
        /
        <router-link to="/register" class="register-btn" :class="{ current: isRegisterActive }">注册</router-link>
      </div>
      <div v-else>
        <el-dropdown popper-class="user-dropdown" trigger="click">
          <span class="el-dropdown-link">
            <span class="user-info">您好，{{ userStore.userInfo?.phone }}</span>
            <span class="arrow-down"></span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleAccountSettingClick">
                <span class="icon icon-user-setting"></span>
                <span class="text">账号设置</span>
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogoutClick">
                <span class="icon icon-logout"></span>
                <span class="text">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter } from "vuepress/client";
import { useRoute } from "vuepress/client";
import { useUserStore } from "../stores/user";
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'



export default {
  name: "defaultLayout",
  data() {
    return {
      navList: [
        {
          name: "首页",
          path: "/",
          active: false,
        },
        {
          name: "接入指引",
          path: "/guide/develop",
          active: false,
        },
        {
          name: "开发文档",
          path: "/docs/business/business-apisAuth.md",
          active: false,
        },
        {
          name: "开发者中心",
          path: "/developer/developer-info/",
          active: false,
          hidden: false,
        },
        {
          name: "运控后台",
          path: "#", // 使用#作为占位符
          active: false,
          hidden: false,
          isCustomLink: true, // 标记为自定义链接
        },
      ],
      isLoginActive: false,
      isRegisterActive: false,
      userStore: useUserStore(),
      router: useRouter(),
    };
  },
  computed: {
    isLoggedIn() {
      console.log(this.userStore.isLoggedIn)
      return this.userStore.isLoggedIn
    },
  },
  watch: {
    // 监听登录状态变化，更新导航项的隐藏状态
    'userStore.isLoggedIn': {
      handler(newVal) {
        this.updateNavItemsVisibility(newVal)
      },
      immediate: true
    }
  },
  methods: {
    // 更新导航项的显示/隐藏状态
    updateNavItemsVisibility(isLoggedIn) {
      // 更新"开发者中心"导航项的隐藏状态
      this.navList[3].hidden = !isLoggedIn
      // 更新"运控后台"导航项的隐藏状态
      this.navList[4].hidden = !isLoggedIn
    },
    handleRouteClick(to) {
      this.navList.forEach((item) => {
        item.active = false;
      });
      to.active = true;
    },
    handleCustomLinkClick(item) {
      // 处理自定义跳转逻辑
      // 如果用户信息的userCode为空，提示用户先申请运控权限
      // if (!this.userStore.userInfo?.userCode) {
      //   ElMessage.error('您还未申请运控权限，请先申请');
      //   return;
      // }
      // 检查是否有token
      if (!this.userStore.userInfo?.token) {
        ElMessage.error('登录已过期，请重新登录');
        return;
      }

      // 判断当前环境
      const env = process.env.NODE_ENV;
      console.log('当前环境:', env);
      // 设置目标系统URL
      const targetUrl = env === 'production' ? 'http://ie-uocs-web.sf-express.com/#/' : 
                       'http://ie-uocs.sit.sf-express.com/#/'; // 默认是sit环境

      // 加密token
      const token = this.userStore.userInfo?.token;
      if (!token) {
        ElMessage.warning('请先登录后再进行操作');
        return;
      }
      const encryptedToken = this.encryptToken(token);

      // 构建完整URL，添加加密后的token作为查询参数
      const fullUrl = `${targetUrl}?param=${encodeURIComponent(encryptedToken)}`;

      // 跳转到目标系统（在新标签页中打开）
      window.open(fullUrl, '_blank', 'noopener,noreferrer');

      // '_blank' - 在新标签页中打开
      // 'noopener' - 防止新页面访问opener对象，提高安全性
      // 'noreferrer' - 不发送referrer信息，提高隐私性
    },
    // 加密token方法
    encryptToken(token) {
      // 使用Base64编码token
      const encoded = btoa(unescape(encodeURIComponent(token)));
      return encoded;
    },
    handleAccountSettingClick() {
      this.router.push("/account-setting")
    },
    handleLogoutClick() {
      this.userStore.logout()
      this.router.push("/login")
    },
  },
  mounted() {
    const router = useRouter();
    const route = useRoute();
    // 首次进入时设置当前路由的 active 状态
    if (route.path === "/" || route.path === "") {
      this.navList[0].active = true;
    } else if (route.path.startsWith("/guide/")) {
      this.navList[1].active = true;
    } else if (route.path.startsWith("/docs/")) {
      this.navList[2].active = true;
    } 
    else if (route.path.startsWith("/developer/developer-info/")) {
      this.navList[3].active = true;
    }
    if (route.path === "/login" || route.path === "/register") {

    }
    this.isLoginActive = route.path.startsWith("/login")
    this.isRegisterActive = route.path.startsWith("/register")


    // 监听全局路由变化
    router.beforeEach((to, from, next) => {
      this.navList.forEach((item) => {
        item.active = false;
      });
      if (to.path === "/" || to.path === "") {
        this.navList[0].active = true;
      } else if (to.path.startsWith("/guide/")) {
        this.navList[1].active = true;
      } else if (to.path.startsWith("/docs/")) {
        this.navList[2].active = true;
      } else if (to.path.startsWith("/developer/developer-info/")) {
        this.navList[3].active = true;
      }
     
      this.isLoginActive = to.path.startsWith("/login")
      this.isRegisterActive = to.path.startsWith("/register")
      next();
    });
  },
};
</script>
<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  width: 100%;
  height: var(--navbar-height);
  background-color: #fff;
  box-shadow: 0px 2px 2.5px 0px rgba(0, 0, 0, 0.1);
}
.header-inner {
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
}

.header .logo {
  width: 160px;
  height: 48px;
  background-image: url("/assets/image/home-logo.svg");
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.header .nav-bar {
  display: flex;
  align-items: center;
justify-content: space-between;
  margin-left: 130px;
}

.header .nav-bar a {
  margin-right: 116px;
  color: #383838;
  font-size: 1rem;
  font-style: normal;
  /* font-weight: 600; */
  line-height: normal;
  cursor: pointer;
}

.header .nav-bar.logined a {
 margin-right: 60px;
}

.header .nav-bar a.current {
  color: #b91818;
  /* font-weight: 500; */
}

.login-btn,.register-btn {
  color: #383838;
  font-size: 1rem;
  font-style: normal;
  /* font-weight: 600; */
  line-height: normal;
  cursor: pointer;

  &:hover {
    color: #D01B1B;
  }
  &.current {
    color: #D01B1B;
  }
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
.user-info {
  color: #383838;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.arrow-down {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  background-image: url("../assets/svg/arrow-down.svg");
  background-size: 8px 5px;
  background-position: center;
  background-repeat: no-repeat;
}


</style>
<style lang="scss">
.user-dropdown {
  width: 160px;

  .el-dropdown-menu__item {
    color: #383838;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover,
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: rgba(56, 56, 56, 0.08);
    color: #000000;
  }

  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 8px;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .icon-user-setting {
    background-image: url("../assets/svg/user-setting.svg");
  }
  .icon-logout {
    background-image: url("../assets/svg/logout.svg");
  }
}
</style>
