# 取消无人机运单

### 接口说明

特殊原因（如订单需求取消、恶劣天气、运力不足）需要取消无人机运单，可调用该接口进行操作，仅支持揽件状态前取消

### 接口地址

POST
待发布

### 请求参数

| 字段名  | 属性 | 类型   | 是否必传 | 说明       |
| ------- | ---- | ------ | -------- | ---------- |
| devCode |      | String | 是       | 开发者账号 |
| fyCode  |      | String | 是       | 丰翼运单号 |
| reason  |      | String | 否       | 取消原因   |


### 请求响应参数

| 字段名       | 属性 | 类型    | 是否必传 | 说明                       |
| ------------ | ---- | ------- | -------- | -------------------------- |
| requestId    |      | String  | 是       | 请求唯一标识               |
| success      |      | Boolean | 是       | true:成功 false:失败       |
| errorCode    |      | String  | 否       | 请求错误码                 |
| errorMessage |      | String  | 否       | 请求错误信息 |
| date         |      | String  | 是       | 当前处理日期               |
| version      |      | String  | 否       | 当前版本信息               |
| obj          |      | T       | 否       | 业务结果类                 |

### 请求示例

```json
{
 "devCode": "tc123456",
 "fyCode": "FC001",
 "reason": "取消原因"
}
```

### 响应示例：

```json
{
	"requestId": "123456789987",
	"success": true,
	"business": null,
	"errorCode": null,
	"errorMessage": null,
	"params": null,
	"date": "2022-11-23 16:32:58",
	"version": "1.0",
	"obj": 1
}
```