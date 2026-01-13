import { defineClientConfig } from 'vuepress/client'
import homeLayout from './layouts/Home.vue'
import Home from './components/Home.vue'
import Navbar from './components/Navbar.vue'
import PageFooter from './components/PageFooter.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import PrivacyAgreement from './components/PrivacyAgreement.vue'
import ResetPassword from './components/ResetPassword.vue'
import AccountSetting from './components/AccountSetting.vue'
import DeveloperInfo from './components/DeveloperInfo.vue'
import ApplyDeveloper from './components/ApplyDeveloper.vue'
import InterfaceManagement from './components/InterfaceManagement.vue'


// 引入 Pinia
import { pinia } from './stores'
import { useUserStore } from './stores/user'


// 引入Element Plus组件库和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'

// import Vcode from 'vue3-puzzle-vcode'

export default defineClientConfig({
  layouts: {
    homeLayout,
  },
  enhance: ({ app, router, siteData }) => {
    // 使用Element Plus组件库
    app.use(ElementPlus, {
      size: 'medium',
    })
    
    // 使用Pinia
    app.use(pinia)
    
    app.component("Navbar", Navbar);
    app.component("Home", Home);
    app.component("PageFooter", PageFooter)
    app.component("Register", Register)
    app.component("Login", Login)
    app.component("PrivacyAgreement", PrivacyAgreement)
    app.component("ResetPassword", ResetPassword)
    app.component("AccountSetting", AccountSetting)
    app.component("DeveloperInfo", DeveloperInfo)
    app.component("ApplyDeveloper", ApplyDeveloper)
    app.component("InterfaceManagement", InterfaceManagement)




    router.beforeEach((to, from, next) => {
      if (typeof window === 'object') {
        document.title = '丰翼开放平台'
      }
      
      // 重定向 /developer/ 到 /developer/developer-info/
      if (to.path === '/developer/') {
        next('/developer/developer-info/');
        return;
      }
      
      // 检查登录状态
      const userStore = useUserStore()
      const isLoggedIn = userStore.getLoginStatus
      
      // 如果用户已登录，可以在这里执行其他逻辑
      if (isLoggedIn) {
        console.log('用户已登录，执行相关逻辑')
        // 例如：检查 token 有效性、获取用户最新信息等
      }
      
      // console.log(`全局守卫：从 ${from.path} 到 ${to.path}`);
      next(); // 必须调用 next() 继续导航
    });

    // 监听路由变化，根据页面是否有title决定是否显示.vp-page-title元素
    router.afterEach((to) => {
      if (typeof window === 'undefined') return;
      
      // 延迟执行，确保DOM已经渲染完成
      setTimeout(() => {
        const pageTitleElement = document.querySelector('.vp-page-title');
        if (!pageTitleElement) return;
        
        // 获取当前页面的title（从frontmatter中获取）
        const pageTitle = to.meta._pageChunk.data?.title;
        
        // 如果页面没有配置title，隐藏.vp-page-title元素
        if (!pageTitle) {
          pageTitleElement.style.display = 'none';
        } else {
          pageTitleElement.style.display = 'block';
        }
      }, 600);
      return true
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