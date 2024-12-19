<template>
  <div>
    <Navbar />
    <div class="header-padding"></div>
    <main>
      <Content />
    </main>
    <footer>My Custom Footer</footer>
  </div>
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
          path: "/guide/",
          active: false,
        },
        {
          name: "开发文档",
          path: "/docs/",
          active: false,
        },
      ],
    };
  },
  methods: {
    // handleRouteClick(to) {
    //   this.navList.forEach((item) => {
    //     item.active = false;
    //   });
    //   to.active = true;
    // },
  },
  mounted() {
    // const router = useRouter();
    // const route = useRoute();
    // // 首次进入时设置当前路由的 active 状态
    // if (route.path === "/") {
    //   this.navList[0].active = true;
    // } else if (route.path === "/guide/index.html") {
    //   this.navList[1].active = true;
    // } else if (route.path === "/docs/index.html") {
    //   this.navList[2].active = true;
    // }
    // // 监听全局路由变化
    // router.beforeEach((to, from, next) => {
    //   this.navList.forEach((item) => {
    //     item.active = false;
    //   });
    //   if (to.path === "/") {
    //     this.navList[0].active = true;
    //   } else if (to.path === "/guide/index.html") {
    //     this.navList[1].active = true;
    //   } else if (to.path === "/docs/index.html") {
    //     this.navList[2].active = true;
    //   }
    //   next();
    // });
  },
};
</script>
<style scoped>

</style>
