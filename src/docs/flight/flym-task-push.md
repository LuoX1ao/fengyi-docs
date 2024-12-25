# 无人机任务推送 

### 接口说明

无人机执行飞进时，会生成本次任务的航班，航班的创建、起飞、降落等事件会进行数据推送
0-待起飞：航班任务创建时推送，推送列量全量数据
1-航线飞行中：无人机起发时，进行推送
2-备降中：无人机执行备降操作时，进行推送
3-返航中：无人机执行返航时，进行推送
4-紧急迫降：无人机执行迫降时，进行推送
5-任务结束：无人机降到地面锁浆时，进行推送


 ### 接口地址

 POST
 回调URL

### 请求参数

| 字段名          | 属性        | 类型     | 是否必传 | 说明                                                               |
| --------------- | ----------- | -------- | -------- | ------------------------------------------------------------------ |
| timestamp       |             | Long     | 是       | 当前时间                                                           |
| area            |             | String   | 否       | 运行城市                                                           |
| createTm        |             | String   | 是       | 任务开始时间                                                       |
| flightCode      |             | String   | 是       | 航班号                                                             |
| uas             |             | String   | 是       | 无人机                                                             |
| uasType         |             | String   | 是       | 机型                                                               |
| takeoffPoint    |             | String   | 否       | 起飞场名称                                                         |
|                 | takeoff_lon | String   | 否       | 起飞点经度                                                         |
|                 | takeoff_lat | String   | 否       | 起飞点纬度                                                         |
|                 | takeoff_alt | Double   | 否       | 起飞点高度                                                         |
| landPoint       |             | String   | 否       | 降落场名称                                                         |
|                 | land_lon    | String   | 否       | 降落点经度                                                         |
|                 | land_lat    | String   | 否       | 降落点纬度                                                         |
|                 | land_alt    | Double   | 否       | 降落点高度                                                         |
| routeCode       |             | String   | 否       | 航线编码                                                           |
| wayPointList    | T           | List<T\> | 否       | 航线航点                                                           |
|                 | cruise_lon  | String   | 否       | 巡航点经度                                                         |
|                 | cruise_lat  | String   | 否       | 巡航点纬度                                                         |
|                 | cruise_alt  | Double   | 否       | 巡航点高度                                                         |
| flightStatus    |             | Int      | 是       | 0-待起飞，1-航线飞行中，2-备降中，3-返航中，4-紧急迫降，5-任务结束 |
| planFlyTime     |             | String   | 否       | 计划飞行时长                                                       |
| planFlyDist     |             | Double   | 否       | 计划飞行距离                                                       |
| realTakeoffTime |             | String   | 否       | 实际起飞时间                                                       |
| realLandTime    |             | String   | 否       | 实际降落时间                                                       |
| factFlyR        |             | Double   | 否       | 实际飞行距离                                                       |
	
### 请求响应参数

| 字段名       | 属性 | 类型    | 是否必传 | 说明                 |
| ------------ | ---- | ------- | -------- | -------------------- |
| requestId    |      | String  | 是       | 请求唯一标识         |
| success      |      | Boolean | 是       | true:成功 false:失败 |
| errorCode    |      | String  | 否       | 请求错误码           |
| errorMessage |      | String  | 否       | 请求错误信息         |
| date         |      | String  | 是       | 当前处理日期         |
| version      |      | String  | 否       | 当前版本信息         |
| obj          |      | Object  | 否       | 业务结果类           |

					

### 请求示例
```json
{
	"timestamp": 1718934400000,
	"area": "广东深圳宝安区",
	"createTm": "2024-12-18 08:00:00",
	"flightCode": "CA1234",
	"uas": "UAS80000001",
	"uasType": "ARK40",
	"takeoffPoint": "XXX起飞位",
	"takeoff_lon": "116.12345",
	"takeoff_lat": "39.12345",
	"takeoff_alt": 100.5,
	"landPoint": "XXX降落位",
	"land_lon": "116.56789",
	"land_lat": "39.56789",
	"land_alt": 90.5,
	"routeCode": "R001",
	"wayPointList": [{
			"seq":0,
		"cruise_lon": "116.23456",
		"cruise_lat": "39.23456",
		"cruise_alt": 110.5
	}, {
			"seq":1,
		"cruise_lon": "116.34567",
		"cruise_lat": "39.34567",
		"cruise_alt": 115.5
	}],
	"flightStatus": 1,
	"planFlyTime": "8.6",
	"planFlyDist": 15.8,
	"realTakeoffTime": "2024-12-18 08:30:00",
	"realLandTime": "2024-12-18 10:30:00",
	"factFlyR": 20.5
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