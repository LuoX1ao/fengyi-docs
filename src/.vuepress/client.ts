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
      if (typeof window === 'object') {
        document.title = '丰翼开放平台'
      }
      next(); // 必须调用 next() 继续导航
    });
  },

  setup() {
    // 切换 favicon 的函数
    const setFavicon = (isDarkMode: boolean) => {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = isDarkMode ? "/favicon-dark.png" : "/favicon.png";
      } else {
        // 创建 link 标签
        const link = document.createElement("link");

        // 设置 favicon 的属性
        link.rel = "icon"; // 指定为 favicon 类型
        link.href = isDarkMode ? "/favicon-dark.png" : "/favicon.png"; // favicon 的路径
        link.type = "image/x-icon"; // (可选) 指定 favicon 的 MIME 类型

        // 添加新的 favicon link 到 <head>
        document.head.appendChild(link);
      }
    };
    if (typeof window !== "undefined" ) {
      // 检测暗黑模式并切换 favicon
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // 初次加载时设置 favicon
      setFavicon(mediaQuery.matches);

      // 监听系统主题切换事件
      mediaQuery.addEventListener("change", (event) => {
        setFavicon(event.matches);
      });

      // 如果主题切换是通过 vuepress 切换按钮触发的
      const body = document.querySelector("body");
      const observer = new MutationObserver(() => {
        const isDarkMode = body?.classList.contains("dark");
        setFavicon(!!isDarkMode);
      });

      observer.observe(body!, { attributes: true });
    }
    
  },
})