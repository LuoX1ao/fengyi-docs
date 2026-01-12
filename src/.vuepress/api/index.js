import request from './request'

const baseUrlMap = {
  test: 'http://ie-uocs-out.sit.sf-express.com:8000',
  prod: 'http://ie-uocs-web.sf-express.com'
}

// API接口封装
export default {
  /**
   * 获取验证码
   * @param phone 手机号
   * @param type 验证码类型
   * @returns 验证码
   * 验证码类型：
"1" = 注册
"2" = 登录
"3" = 忘记密码和修改密码
“4” = 更改手机号
“5” = 回调配置修改

   */
  getVerificationCode: ({ phone, type }) => {
    return request({
      url: '/uocs-open/user/getVerificationCode',
      method: 'get',
      params: {
        phone,
        type
      }
    })
  },

  /**
   * 验证验证码
   * @param phone 手机号
   * @param verificationCode 验证码
   * @param type 验证码类型
   * @returns 验证结果
   */
  verifyVerificationCode: ({ phone, verificationCode, type }) => {
    return request({
      url: '/uocs-open/user/verifyVerificationCode',
      method: 'get',
      params: {
        phone,
        verificationCode,
        type
      }
    })
  },

  // 注册接口
  register: (data) => {
    return request({
      url: '/uocs-open/user/register',
      method: 'post',
      data
    })
  },

  /**
   * 重置密码
   * @param data 重置密码数据
   * @returns 重置密码结果
   */
  resetPassword: (data) => {
    return request({
      url: '/uocs-open/user/restPassword',
      method: 'post',
      data
    })
  },

  /**
   * 账号密码登录
   * @param data 登录数据
   * @returns 登录结果
   */
  login: (data) => {
    return request({
      url: '/apis-auth/login/auth',
      method: 'post',
      data: {
        appKey: 'IE-UOCS-OPEN',
        appSecret: 'fykj12345678',
        deviceId: '00:FF:16:4B:63:57',
        hostName: 'SF0001304522C',
        requestId: '123456789',
        ip: '192.168.255.10',
        userId: data.phone,
        password: data.password,
        userType: 4, //4:开放平台
        method: data.method || 1 //1:账号登录 2:手机登录
      }
    })
  },

  /**
   * 手机号验证码登录
   * @param data 登录数据
   * @returns 登录结果
   */
  phoneLogin: (data) => {
    return request({
      url: '/apis-auth/login/auth',
      method: 'post',
      data: {
        appKey: 'IE-UOCS-OPEN',
        appSecret: 'fykj12345678',
        deviceId: '00:FF:16:4B:63:57',
        hostName: 'SF0001304522C',
        requestId: '123456789',
        ip: '192.168.255.10',
        userId: data.phone,
        validateCode: data.verificationCode,
        userType: 4, //4:开放平台
        method: data.method || 2 //1:账号登录 2:手机登录
      }
    })
  },

  /**
   * 更换手机号
   * @param data 更换手机号数据
   * @returns 更换结果
   */
  changePhone: (data) => {
    return request({
      url: '/uocs-open/user/changePhone',
      method: 'post',
      data
    })
  },

  /**
   * 开发者列表查询
   * @param data 查询数据
   * @returns 开发者列表
   */
  getDeveloperList: (data, type) => {
    return request({
      url: baseUrlMap[type] + '/uocs-open/developer/queryByPage',
      method: 'post',
      data
    })
  },

  /**
   * 开发者申请
   * @param data 申请数据
   * @returns 申请结果
   */
  applyDeveloper: (data, type) => {
    return request({
      url: baseUrlMap[type] + '/uocs-open/developer/submitDeveloper',
      method: 'post',
      data
    })
  },

  /**
   * 获取经营类型数据字典
   * @returns 经营类型数据字典
   */
  getBusinessTypeDict: () => {
    return request({
      url: '/uocs-open/developer/getDictListByBusinessCode',
      method: 'post',
      data: {
        businessTypeId: 87
      }
    })
  },

  /**
   * 省市区三级联动
   * @param parentId 父级ID
   * @returns 省市区列表
   */
  getAreaDict: (parentId) => {
    return request({
      url: '/uocs-open/developer/getDistrictByParentId',
      method: 'post',
      data: {
        distParentId: parentId || 'A000086000',
      }
    })
  },

  /**
   * 获取接口权限列表
   * @returns 接口权限列表
   */
  getInterfacesList: () => {
    return request({
      url: '/uocs-open/developer/getInterfacesList',
      method: 'get',
    })
  },

  /**
   * 查看密钥
   */
  getSecretKey: (userName) => {
    return request({
      url: '/uocs-open/developer/viewKey',
      method: 'get',
      params: {
        userName
      }
    })
  },

  /**
   * 开发者已通过审核接口列表
   */
  getPassedInterfacesList: (params) => {
    return request({
      url: '/uocs-open/developer/getDeveloperInterfacesList',
      method: 'get',
      params
    })
  },

  /**
   * 开发者提交接口权限
   */
  submitInterfaces: (data) => {
    return request({
      url: 'uocs-open/developer/submitDeveloperInterfaces',
      method: 'post',
      data
    })
  },

  /**
   * 编辑回调配置
   */
  editCallback: (data) => {
    return request({
      url: '/uocs-open/developer/editCallBackUrl',
      method: 'post',
      data
    })
  },

}


