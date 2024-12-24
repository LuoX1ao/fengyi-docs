---
title: 外部用户鉴权接口
date: 2024-12-20
description: 对接平台的所有接口，首先应通过该接口进行身份鉴权认证，认证通过以后系统就返回接口token, 后续所有接口均需要带上在请求头上带上token
author: 江建莉

# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---


### 接口说明

对接平台的所有接口，首先应通过该接口进行身份鉴权认证，认证通过以后系统就返回接口token, 后续所有接口均需要带上在请求头上带上token

### 接口地址

POST
/apis-auth/login/auth

### 请求参数

| 字段名    | 属性 | 类型   | 是否必传 | 说明                                             |
| --------- | ---- | ------ | -------- | ------------------------------------------------ |
| appKey    |      | String | 是       | appKey （固定值 IE-UOCS-OUT）                    |
| appSecret |      | String | 是       | appKey 秘钥 （固定值fykj12345678）               |
| deviceId  |      | String | 是       | 设备ID                                           |
| hostName  |      | String | 是       | 设备名                                           |
| requestId |      | String | 否       | 请求ID                                           |
| ip        |      | String | 是       | IP地址                                           |
| userId    |      | String | 是       | 用户账号（丰翼分配 xcy0001）                     |
| password  |      | String | 是       | 密码（丰翼分配79323c441a34b5599aec5c1f56eda196） |

### 请求响应参数

| 字段名       | 属性   | 类型    | 是否必传 | 说明                 |
| ------------ | ------ | ------- | -------- | -------------------- |
| requestId    |        | String  | 是       | 请求唯一标识         |
| success      |        | Boolean | 是       | true:成功 false:失败 |
| errorCode    |        | String  | 否       | 请求错误码           |
| errorMessage |        | String  | 否       | 请求错误信息         |
| date         |        | String  | 是       | 当前处理日期         |
| version      |        | String  | 否       | 当前版本信息         |
| obj          |        | Object  | 否       | 业务结果类           |
|              | userId | String  | 是       | 用户账号             |
|              | token  | String  | 是       | 用户token 有效期7天  |
		
		
### 请求示例

```json
{
    "appKey":"IE-UOCS-OUT",
    "appSecret": "fykj12345678",
    "deviceId": "00:FF:16:4B:63:57",
    "hostName": "SF0001304522C",
    "requestId": "123456789",
    "ip": "192.168.255.10",
    "userId": "fc0001",
    "password": "8bb2423a0e1c4d0a"
}
```

### 响应示例

```json
{
    "requestId":"xxxxxxx",
    "success":true,
    "business":null,
    "errorCode":null,
    "errorMessage":null,
    "date":null,
    "version":null,
    "obj":{
        "userId":"fc0001",
        "token":"DEF_A3_537bc42380b6dafb5f480d9eaa4da0a91684302908599"
    }
}
```