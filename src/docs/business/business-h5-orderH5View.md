# 查询订单配送轨迹H5接口 

### 接口说明

可获取一个订单的无人机配送位置H5链接，可进行内嵌或发送给用户

### 接口地址

POST
待发布

### 请求参数

| 字段名  | 属性 | 类型   | 是否必传 | 说明       |
| ------- | ---- | ------ | -------- | ---------- |
| devCode |      | String | 是       | 企业账号   |
| fyCode  |      | String | 是       | 丰翼运单号 |
                                                                                                                 
	
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
|              | url    | String  | 是       | H5地址               |
|              | fyCode | String  | 是       | 丰翼运单号           |
					

### 请求示例
    
```json
{
    "devCode": "FY00001",
    "fyCode": "C123456"
}
```
  
### 响应示例
   
```json
{
    "requestId":"xxxxxxx",
    "success":true,
    "errorCode":null,
    "date":"2022-09-27 10:04:43",
    "timestamp":1664244283963,
    "version":"1.0",
    "errorMessage":null,
    "obj":null      
}
```