import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
const __dirname = getDirname(import.meta.url);

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: 'zh-CN',
  title: '丰翼开放平台',
  description: '以生态智慧释放行业生产力无限可能',

  // 暂不需支持国际化
  locales: {
    // "/": {
    //   lang: "en-US",
    //   title: "Docs Demo",
    //   description: "A docs demo for vuepress-theme-hope",
    // },
    "/": {
      lang: "zh-CN",
      // title: "文档演示",
      // description: "vuepress-theme-hope 的文档演示",
    },
  },
  head: [
    [
      'link',
      { rel: 'shortcut icon', href: '/logo.svg' }
    ],
    [
      'meta',
      { name: 'baidu-site-verification', content: 'codeva-SbbPxkqAZp'}
    ],
    [
      'meta',
      { name: 'keywords', content: '丰翼开放平台'}
    ]
  ],

  theme,
  alias: {
    // 你可以在这里将别名定向到自己的组件
    "@theme-hope/modules/navbar/components/Navbar": path.resolve(
      __dirname,
      "./components/Navbar.vue",
    ),
    '@theme-hope/components/PageFooter': path.resolve(
      __dirname,
      "./components/PageFooter.vue",
    )
  },
});
