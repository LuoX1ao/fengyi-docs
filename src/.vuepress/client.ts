import { defineClientConfig } from 'vuepress/client'
import homeLayout from './layouts/Home.vue'
import Home from './components/Home.vue'
import Navbar from './components/Navbar.vue'

export default defineClientConfig({
  layouts: {
    homeLayout,
  },
  enhance: ({ app, router, siteData }) => {
    app.component("Navbar", Navbar);
    app.component("Home", Home);

    router.beforeEach((to, from, next) => {
      console.log(`全局守卫：从 ${from.path} 到 ${to.path}`);
      // 可以在这里触发公共组件的逻辑
      next(); // 必须调用 next() 继续导航
    });
  },
})