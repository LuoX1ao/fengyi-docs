import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { useRouter } from 'vue-router'

const router = useRouter();

// 创建axios实例
const service = axios.create({
  baseURL: 'http://ie-uocs-out.sit.sf-express.com:8000',
  // baseURL: 'http://100.117.153.216:8080',
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许跨域请求携带凭证
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 加载动画实例
let loading = null;

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // // 显示加载动画
    // if (typeof window !== 'undefined') {
    //   loading = ElLoading.service({
    //     lock: true,
    //     text: '加载中...',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   });
    // }

    // 如果需要，可以在这里添加token等认证信息
    if (typeof window !== 'undefined') {
      const userStore = localStorage.getItem('userStore');
      if (userStore) {
        const user = JSON.parse(userStore);
        if (user.userInfo?.token) {
          config.headers.Token = user.userInfo?.token;
        }
      }
    }

    return config;
  },
  (error) => {
    // 关闭加载动画
    // if (loading) loading.close();
    console.error('请求错误:', error);
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      ElMessage.error('请求失败，请稍后重试');
    }
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 关闭加载动画
    if (typeof window !== 'undefined' && loading) {
      loading.close();
    }

    // 调试信息：查看响应数据类型和请求URL
    console.log('请求URL:', response.config.url);
    console.log('响应数据类型:', typeof response.data);
    
    // 如果返回的是HTML，打印前100个字符查看内容
    if (typeof response.data === 'string' && response.data.includes('<html')) {
      console.log('返回的HTML内容:', response.data.substring(0, 100) + '...');
    }

    const res = response.data;

    // 根据后端返回的数据结构进行处理
    if (response.status !== 200) {
      // 错误处理
      // ElMessage.error(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      // 请求成功
      return res;
    }
  },
  (error) => {
    // 关闭加载动画
    if (typeof window !== 'undefined' && loading) {
      loading.close();
    }
    console.error('响应错误:', error);

    // 错误状态码处理
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // ElMessage.error('请求参数错误');
          break;
        case 401:
          // 确保只在客户端执行
          if (typeof window !== 'undefined') {
            ElMessage.error('登录已失效，请重新登录');
            setTimeout(() => {
              localStorage.removeItem('userStore');
              window.location.href = '/login';
            }, 2000);
          }
          break;
        case 403:
          // ElMessage.error('拒绝访问');
          break;
        case 404:
          // ElMessage.error('请求的接口不存在');
          break;
        case 500:
          // ElMessage.error('服务器内部错误');
          break;
        default:
          // ElMessage.error(`请求失败，错误码: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      // 确保只在客户端执行
      if (typeof window !== 'undefined') {
        ElMessage.error('网络连接失败，请检查网络设置');
      }
    } else {
      // 请求配置错误
      // 确保只在客户端执行
      if (typeof window !== 'undefined') {
        ElMessage.error('请求配置错误');
      }
    }

    return Promise.reject(error);
  }
);

// 导出封装的axios实例
export default service;