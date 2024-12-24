---
title:  开发说明
date: 2024-12-13
author: 江建莉
order: 1
category:
  - 开发说明
---


## 开发流程

![](https://ie-uocs-core-shenzhen-futian1-oss.sf-express.com/v1.2/AUTH_IE-UOCS-CORE/sfosspublic001/test/aaa.png)

## 对接环境
测试环境地址：http://ie-uocs-out.sit.sf-express.com:8000/	
生产环境地址：https://ie-uocs-lvs.sf-express.com/

  > **提示**
  > 在使用接口前，需通过 <外部鉴权接口> 获取 Token，此后使用其他接口时，均要在请求头中添加此 token




## 错误码
| 错误码   | 错误信息                       |
| -------- | ------------------------------ |
| 10002    | 参数错误                       |
| 10006    | 接口异常                       |
| 09020101 | token为空，请重新获取          |
| 09020102 | token失效，请重新获取          |
| 09020206 | 鉴权校验不通过，请检查用户权限 |

