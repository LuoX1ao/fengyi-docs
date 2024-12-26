<template>
  <section class="footer">
    <div class="divider"></div>
    <div class="footer-legal">
      <div class="footer-contact-us">
        <span class="mr-10 title" >联系我们</span><span class="val" >fydev@sf-express.com</span>
      </div>
      <div class="footer-legal-link">
        <span class="mr-10 title">友情链接</span><a href="https://fyuav.cn/" target="_blank" class="val">丰翼科技官网</a>
      </div>
      <div class="footer-copyright">Copyright © 2023 丰翼科技 版权所有</div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.footer {
  padding: 48px 0;
  padding-inline-start: calc(var(--sidebar-space) + 2rem);
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  letter-spacing: -0.02em;
  line-height: 16px;
}

.footer .divider {
  position: relative;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 32px;
  width: 100%;
}

.divider:before {
  position: absolute;
  content: "";
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.09);
}

.footer-legal {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.footer-legal a {
  color: rgba(0, 0, 0, 0.65);
  line-height: 1;
}

.footer-legal a:hover {
  text-decoration: underline;
}

.footer-legal .val {
  color: rgba(0,0,0,.65);
}

.footer-legal .title {
  color: rgba(0,0,0,.85);
  font-weight: 600;
}
@media (min-width: 1440px) {
  .footer {
    padding-inline-end: calc(
      100vw - var(--content-width) - var(--sidebar-space) - 6rem
    );
  }
}

.mr-10 {
  margin-right: 10px;
}
</style>
