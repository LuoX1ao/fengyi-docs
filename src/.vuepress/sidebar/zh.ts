import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  '/docs/': "structure",
  '/developer/': [
    {
      text: "开发者信息",
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
