<template>
  <div class="home-page">
    <section class="section-hero">
      <div class="section-hero-inner">
        <h4 class="section-hero-title">丰翼开放平台</h4>
        <p class="section-hero-sub-title">以生态智慧释放行业生产力无限可能</p>
        <router-link to="/guide/" class="go-guide">
          我要接入<span class="arrow-right"></span>
        </router-link>
      </div>
    </section>
    <section class="section section-api">
      <div class="section-title-wrapper">
        <h4 class="section-title">三大核心API模块</h4>
      </div>
      <div class="section-content">
        <div class="section-item business-management-item">
          <div class="section-item-inner">
            <span class="item-icon business-management"></span>
            <h5>业务管理</h5>
            <p>
              将无人机作为运力手段,嵌入到已有的业务流程中,掌握配送全链条作业过程
            </p>
          </div>
        </div>
        <div class="section-item flight-management-item">
          <div class="section-item-inner">
            <span class="item-icon flight-management"></span>
            <h5>飞行管理</h5>
            <p>监控无人机实时姿态及任务信息,对无人机及载荷下达远程控制指令</p>
          </div>
        </div>
        <div class="section-item resource-management-item">
          <div class="section-item-inner">
            <span class="item-icon resource-management"></span>
            <h5>资源管理</h5>
            <p>管理无人机、通讯基站、气象站、RTK基准站、视频流等基础设备</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-applications">
      <div class="section-title-wrapper">
        <h4 class="section-title">行业应用案例</h4>
      </div>
      <div class="section-content">
        <div
          v-for="(item, i) in applications"
          class="application-item"
          :class="{ [item.className]: true, active: item.active }"
          @mouseenter="handleMouseenterApplication(i)"
        >
         <div class="application-item-inner">
          <span class="application-icon"></span>
          <h5 class="application-title">{{ item.title }}</h5>
          <p class="application-desc">{{ item.desc }}</p>
         </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const applications = reactive([
  {
    title: "医疗服务",
    desc: "针对医疗物资高时效性的配送需求,丰翼为深圳市宝安区中心血站及其8家医疗机构提供7*24小时高效、可靠的无人机运血服务。业务系统通过接入无人机运力数据、飞行数据,实现无人机运血全链条闭环管理,优化操作效率和用户体验,确保血液安全及时送达。",
    className: "application-ylfw",
    active: true,
  },
  {
    title: "医疗服务",
    desc: "针对景点游客定位困难、传统配送方式难以触达的问题,丰翼为浙江绍兴景区提供“无人机+接驳柜”餐饮配送方案。业务小程序通过接入无人机运力数据、飞行数据,实现消费者订单配送流程全透明化,提升配送效率及用户体验。",
    className: "application-wljq",
    active: false,
  },
  {
    title: "医疗服务",
    desc: "无人机运营服务商旨在提供无人机相关的各种服务,以满足不同行业和场景的应用需求。通过接入无人机资源数据、飞行数据,来了解无人机的状态、位置和周边基础设施情况,以支持无人机飞行任务规划、执行、监控,实现对无人机业务的全面管控。",
    className: "application-yyfw",
    active: false,
  },
]);

const handleMouseenterApplication = (i) => {
  applications.forEach((item, index) => {
    if (index === i) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};
</script>

<style scoped>
.home-page {
  padding-bottom: 108px;
}
.section-hero {
  height: 450px;
  width: 100%;
  background-image: url("/assets/image/home-hero.jpg");
  background-position: center center;
  background-size: auto 450px;
}

.section-hero-inner {
  position: relative;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.section-hero-title {
  position: absolute;
  top: 107px;
  left: 0;
  margin: 0;
  color: #000;
  font-size: 64px;
  font-weight: 600;
}
.section-hero-sub-title {
  position: absolute;
  top: 206px;
  left: 0;
  margin: 0;
  color: #626973;
  font-size: 24px;
  font-weight: 300;
}

.go-guide {
  display: flex;
  align-items: center;
  position: absolute;
  top: 270px;
  left: 0;
  color: #fff;
  padding: 11px 26px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.96px;
  cursor: pointer;
  border-radius: 2px;
  background: #b91818;
}

.go-guide .arrow-right {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-left: 7px;
  background-image: url(/assets/image/home-go-guide-arrow-right.svg);
  background-size: auto 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.section {
  width: 1200px;
  margin: 0 auto;
}
.section-api {
  margin-top: 66px;
}

.section-title-wrapper {
  text-align: center;
}

.section-title {
  display: inline-block;
  color: #000;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 72px;
  text-align: center;
  background-image: url(/assets/image/home-section-title-bg.svg);
  background-size: auto 72px;
  background-position: right;
  background-repeat: no-repeat;
  padding: 0 10px;
  margin: 0;
}

.section-api .section-content {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.section-api .section-content .section-item {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 8px;
  background: linear-gradient(180deg, #fff 39.23%, #fef7f7 124%);
  box-shadow: 0px 8px 29.3px -18px rgba(71, 67, 67, 0.61);
}

.section-api .section-content .section-item-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(/assets/image/home-section-item-bg.svg);
}

.section-api .section-content .business-management-item .section-item-inner {
  background-image: url(/assets/image/home-business-management-bg.svg);
  background-position: bottom left;
  background-repeat: no-repeat;
}

.section-api .section-content .resource-management-item .section-item-inner {
  background-image: url(/assets/image/home-resource-management-bg.svg);
  background-position: bottom left;
  background-repeat: no-repeat;
}

.section-api .section-content .flight-management-item .section-item-inner {
  background-image: url(/assets/image/home-flight-management-bg.svg);
  background-position: bottom left;
  background-repeat: no-repeat;
}

.section-api .section-content .section-item .item-icon {
  display: inline-block;
  width: 54px;
  height: 54px;
  margin-top: 50px;
}
.section-api .section-content .section-item .item-icon.flight-management {
  background-image: url(/assets/image/home-flight-management.svg);
  background-size: 54px 54px;
}
.section-api .section-content .section-item .item-icon.resource-management {
  margin-top: 46px;
  background-image: url(/assets/image/home-resource-management.svg);
  width: 62px;
  height: 62px;
  background-size: 62px 62px;
}
.section-api .section-content .section-item .item-icon.business-management {
  background-image: url(/assets/image/home-business-management.svg);
  background-size: 54px 54px;
}

.section-api .section-content .section-item h5 {
  margin: 40px 0 0;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
}

.section-api .section-content .section-item p {
  margin-top: 24px;
  color: rgba(34, 23, 20, 0.6);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0 38px;
}

.section-applications {
  margin-top: 130px;
}

.section-applications .section-content {
  display: flex;
  justify-content: space-between;
  margin-top: 64px;
}

.section-applications .section-content .application-item {
  position: relative;
  width: 200px;
  height: 457px;
  border-radius: 8px;
  background-size: 757px 457px;
  background-repeat: no-repeat;
  overflow: hidden;
  transition: all 0.6s;
}

.section-applications .section-content .application-item .application-item-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}

.section-applications .section-content .application-item.active .application-item-inner {
  background-color: rgba(4,24,51,.5);
}

.section-applications .section-content .application-item.application-ylfw {
  background-image: url(/assets/image/home-application-ylfw-bg.jpg);
}
.section-applications .section-content .application-item.application-wljq {
  background-image: url(/assets/image/home-application-wljq-bg.jpg);
}
.section-applications .section-content .application-item.application-yyfw {
  background-image: url(/assets/image/home-application-yyfw-bg.jpg);
}

.section-applications .section-content .application-item.active {
  width: 757px;
}

.section-applications .section-content .application-icon {
  display: block;
  position: absolute;
  top: 303px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background-size: 100% 100%;
}

.section-applications
  .section-content
  .application-item.active
  .application-icon {
  left: 36px;
  top: 140px;
  transform: none;
  transition: all 0.6s;
}

.section-applications .section-content .application-ylfw .application-icon {
  background-image: url(/assets/image/home-application-ylfw-icon.svg);
}

.section-applications .section-content .application-wljq .application-icon {
  background-image: url(/assets/image/home-application-wljq-icon.svg);
}

.section-applications .section-content .application-yyfw .application-icon {
  background-image: url(/assets/image/home-application-yyfw-icon.svg);
}

.section-applications .section-content .application-title {
  display: inline-block;
  position: absolute;
  top: 367px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: #fff;
  font-family: "PingFang SC";
  font-size: 20px;
  font-weight: 500;
  transition: all 0.6s;
}

.section-applications
  .section-content
  .application-item.active
  .application-title {
  display: inline-block;
  position: absolute;
  top: 204px;
  left: 36px;
  transform: none;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
}

.section-applications .section-content .application-desc {
  position: absolute;
  opacity: 0;
  left: 36px;
  bottom: -100px;
  margin: 0;
  width: 684px;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  transition: all 0.6s;
}

.section-applications
  .section-content
  .application-item.active
  .application-desc {
  bottom: 38px;
  left: 36px;
  width: 684px;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  opacity: 1;
}
</style>
