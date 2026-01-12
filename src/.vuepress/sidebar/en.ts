import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    "portfolio",
    {
      text: "Demo",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "Docs",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "Slides",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/plugins/markdown/revealjs/demo.html",
    },
  ],
  '/developer/': [
    {
      text: "Developer Info",
      link: "/developer/developer-info/",
      collapsible: true,
      children: [
        "/developer/developer-info/apply-test.md",
        "/developer/developer-info/apply-prod.md",
        "/developer/developer-info/interface-management.md",
      ],
    },
  ],
});
