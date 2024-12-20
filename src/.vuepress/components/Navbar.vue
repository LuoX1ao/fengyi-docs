<template>
  <header class="header">
    <div class="header-inner">
      <div class="logo"></div>
      <div class="nav-bar">
        <router-link
          v-for="(item, i) in navList"
          :to="item.path"
          :class="{ current: item.active }"
          @click="handleRouteClick(item)"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter } from "vuepress/client";
import { useRoute } from "vuepress/client";

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
          path: "/guide/develop/",
          active: false,
        },
        {
          name: "开发文档",
          path: "/docs/business/business-apisAuth.md",
          active: false,
        },
      ],
    };
  },
  methods: {
    handleRouteClick(to) {
      this.navList.forEach((item) => {
        item.active = false;
      });
      to.active = true;
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
      }
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
  z-index: 99999;
  width: 100%;
  height: var(--navbar-height);
  background-color: #fff;
  box-shadow: 0px 2px 2.5px 0px rgba(0, 0, 0, 0.1);
}
.header-inner {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.header .logo {
  width: 204px;
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
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
}

.header .nav-bar a.current {
  color: #b91818;
  font-weight: 500;
}
</style>
