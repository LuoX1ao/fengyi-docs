# 开发说明


## 开发流程

![](https://ie-uocs-core-shenzhen-futian1-oss.sf-express.com/v1.2/AUTH_IE-UOCS-CORE/sfosspublic001/test/dev_process.png)

## 对接环境
测试环境地址：待发布
生产环境地址：待发布

  > **提示**
  > 在使用接口前，需通过 <外部鉴权接口> 获取 Token，此后使用其他接口时，均要在请求头中添加此 token
  > 接口采用http(s)+JSON数据格式进行交互

## 安全要求
  为了解决公网数据传输防止信息被篡改的问题，对关键敏捷接口进行数据签名，具体签名过程如下：
  签名放请求头中，属性如下
  | 属性           | 错误信息                       |
  | -------------- | ------------------------------ |
  |X-DJI-Timestamp | 随机时间戳                     |
  |X-DJI-Nonce     | UUID随机数                     |
  |Method          | 使用方法GET、POST、PUT         |
  |X-DJI-Signature | 生成的签名值			        |
  
  签名算法
  HmacSHA256("userId+Method+X-DJI-Timestamp+X-DJI-Nonce",password)
  
  > **提示**
  > userId:   分配给第三方的ak
  > password: 分配给第三方的sk



## 错误码
| 错误码   | 错误信息                       |
| -------- | ------------------------------ |
| 10002    | 参数错误                       |
| 10006    | 接口异常                       |
| 09020101 | token为空，请重新获取          |
| 09020102 | token失效，请重新获取          |
| 09020206 | 鉴权校验不通过，请检查用户权限 |

