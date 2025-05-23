import { hopeTheme, sidebarFilenameSorter } from "vuepress-theme-hope";

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme(
  {
    
    // hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",

    // author: {
    //   name: "Mr.Hope",
    //   url: "https://mister-hope.com",
    // },

    // iconAssets: "fontawesome-with-brands",
    print: false,
    logo: "/logo.svg",
    contributors: false,

    // repo: "vuepress-theme-hope/vuepress-theme-hope",

    // docsDir: "src",
    toc: true,
    navbar: zhNavbar,
    breadcrumb: false,
    sidebar: {
      // {
      //   text: "接入指引",
      //   link: "/guide/",
      //   children: [
      //   {
      //     text: "开发说明",
      //     // collapsible: true,
      //     children: [
      //       {
      //         text: "开发说明1",
      //         link: "/guide/develop/",
      //       },
      //     ]
      //   },
      //   {
      //     text: "业务说明",
      //     // collapsible: true,
      //     children: [
      //       {
      //         text: "订单流转",
      //         link: "/guide/business/",
      //       },
      //     ]
      //   }
      // ],
      // }
      // '/guide/': 'structure',
      "/guide/": [
        {
          text: "开发说明",
          // collapsible: true,
          link: "/guide/develop",
          
        },
        {
          text: "业务说明",
          link: "/guide/business",
          // collapsible: true,
        },
      ],
      // "/docs/": [
      //   {
      //     text: "开发说明",
      //     // collapsible: true,
      //     children: [
      //       {
      //         text: "开发说明",
      //         link: "/guide/develop/",
      //       },
      //     ],
      //   },
      //   {
      //     text: "业务说明",
      //     // collapsible: true,
      //     children: [
      //       {
      //         text: "订单流转",
      //         link: "/guide/business/",
      //       },
      //     ],
      //   },
      // ],
      "/docs/": [
        {
          text: "业务管理",
          collapsible: true,
          children: [
            "/docs/business/business-apisAuth.md",
            "/docs/business/business-carrierWaybill.md",
            "/docs/business/business-createWaybill.md",
            "/docs/business/business-selectOrderDetails.md",
            "/docs/business/business-h5-orderH5View.md",
            "/docs/business/business-callback-waybillstatus.md",
            "/docs/business/business-callback-pickup.md",
            "/docs/business/business-callback-takeoff.md",
            "/docs/business/business-callback-land.md",
          ],
        },
        {
          text: "飞行管理",
          collapsible: true,
          children: [
            "/docs/flight/flym-task-push.md",
            "/docs/flight/flym-uavpos-push.md",
          ],
        },
        {
          text: "资源管理",
          collapsible: true,
          children: [
            "/docs/resource/uav-device-info.md",
          ],
        },
      ]


      // '/docs/': [
      //   {
      //     text: "开发说明",
      //     collapsible: true,
      //     children: [
      //       {
      //         text: "开发说明1",
      //         link: "/docs/develop/",
      //       },
      //     ]
      //   },
      //   {
      //     text: "业务说明",
      //     collapsible: true,
      //     children: [
      //       {
      //         text: "业务说明1",
      //         link: "/docs/business/",
      //       },
      //     ]
      //   }
      // ],
    },
    // locales: {
    //   "/": {
    //     // navbar
    //     navbar: zhNavbar,

    //     // sidebar
    //     sidebar: zhSidebar,

    //     footer: "Default footer",

    //     displayFooter: true,

    //     metaLocales: {
    //       editLink: "Edit this page on GitHub",
    //     },
    //   },

    /**
     * Chinese locale config
     */
    // "/zh/": {
    //   // navbar
    //   navbar: zhNavbar,

    //   // sidebar
    //   sidebar: zhSidebar,

    //   footer: "默认页脚",

    //   displayFooter: true,

    //   // page meta
    //   metaLocales: {
    //     // editLink: "在 GitHub 上编辑此页",
    //   },
    // },
    // },

    // encrypt: {
    //   config: {
    //     "/demo/encrypt.html": ["1234"],
    //     "/zh/demo/encrypt.html": ["1234"],
    //   },
    // },

    // These features are enabled for demo, only preserve features you need here
    markdown: {
      align: true,
      attrs: true,
      codeTabs: true,
      component: true,
      demo: true,
      figure: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,
      // uncomment these if you need TeX support
      // math: {
      //   // install katex before enabling it
      //   type: "katex",
      //   // or install mathjax-full before enabling it
      //   type: "mathjax",
      // },

      // install chart.js before enabling it
      // chartjs: true,

      // install echarts before enabling it
      // echarts: true,

      // install flowchart.ts before enabling it
      // flowchart: true,

      // install mermaid before enabling it
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // install @vue/repl before enabling it
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,

      // install @vuepress/plugin-revealjs and uncomment these if you need slides
      // revealjs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },
    },

    plugins: {
      readingTime: false,
      // Note: This is for testing ONLY!
      // You MUST generate and use your own comment service in production.
      // comment: {
      //   provider: "Giscus",
      //   repo: "vuepress-theme-hope/giscus-discussions",
      //   repoId: "R_kgDOG_Pt2A",
      //   category: "Announcements",
      //   categoryId: "DIC_kwDOG_Pt2M4COD69",
      // },

      components: {
        components: ["Badge", "VPCard"],
      },
      
      // Install @vuepress/plugin-pwa and uncomment these if you want a PWA
      // pwa: {
      //   favicon: "/favicon.ico",
      //   cacheHTML: true,
      //   cacheImage: true,
      //   appendBase: true,
      //   apple: {
      //     icon: "/assets/icon/apple-icon-152.png",
      //     statusBarColor: "black",
      //   },
      //   msTile: {
      //     image: "/assets/icon/ms-icon-144.png",
      //     color: "#ffffff",
      //   },
      //   manifest: {
      //     icons: [
      //       {
      //         src: "/assets/icon/chrome-mask-512.png",
      //         sizes: "512x512",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-mask-192.png",
      //         sizes: "192x192",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-192.png",
      //         sizes: "192x192",
      //         type: "image/png",
      //       },
      //     ],
      //     shortcuts: [
      //       {
      //         name: "Demo",
      //         short_name: "Demo",
      //         url: "/demo/",
      //         icons: [
      //           {
      //             src: "/assets/icon/guide-maskable.png",
      //             sizes: "192x192",
      //             purpose: "maskable",
      //             type: "image/png",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
    },
    displayFooter: true,
  },
  { custom: true }
);
