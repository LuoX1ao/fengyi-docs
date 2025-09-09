
# 无人机任务数据推送 

### 接口说明

无人机执行飞行任务时，会由丰翼回调对接方的回调地址，推送本次航班的创建、起飞、降落等事件

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

| 字段名              | 属性 | 类型   | 是否必传 | 说明                                                         |
| ------------------- | ---- | ------ | -------- | ------------------------------------------------------------ |
| timestamp           |      | Long   | 是       | 当前时间，格式"yyyyMMddHHmmss"，例：2024012409500            |
| area                |      | String | 否       | 运行城市，例： 广东省东莞市                                  |
| createTm            |      | String | 是       | 任务开始时间，格式"yyyyMMddHHmmss"，例：2024012409500        |
| flightCode          |      | String | 是       | 航班号，例：CN010010R03K2411120004                           |
| comNum              |      | String | 是       | 无人机编号，无人机唯一标识，例：8325                        |
| uasType             |      | String | 是       | 机型，例：ARK40                      |
| takeoffTerminalCode |      | String | 是       | 起飞航站编号，例：CNB030259                                  |
| takeoffPointCode    |      | String | 是       | 起飞场编号，例：CNA250819-BA001                              |
| takeoffPointName    |      | String | 是       | 起飞场名称，例：松山湖可靠性测试起飞场                       |
| landTerminalCode    |      | String | 是       | 降落航站编号，例：CNA250819-BA001                           |
| landPointCode       |      | String | 是       | 降落场编号，例：CNA250819-BA002                              |
| landPointName       |      | String | 是       | 降落场名称，例：松山湖可靠性测试降落场                       |
| routeCode           |      | String | 是       | 航线编码，例：GZC01R40FL001                                  |
| flightStatus        |      | String | 是       | 航班当前状态：0-待起飞，1-航线飞行中，2-备降中，3-返航中，4-紧急迫降，5-任务结束 |
| planFlyTime         |      | Double | 否       | 计划飞行时长，单位min，保留1位小数。例：3.1                  |
| planFlyDist         |      | Double | 否       | 计划飞行距离，单位km，保留1位小数。例：8.5                   |
| realTakeoffTime     |      | String | 否       | 实际起飞时间，格式"yyyyMMddHHmmss"，例：2024012409500        |
| eArrivalTime        |      | String | 否       | 预计到达时间，格式"yyyyMMddHHmmss"，例：202401240950(仅ARK40机型支持) |
| realLandTime        |      | String | 否       | 实际降落时间，格式"yyyyMMddHHmmss"，例：202401240950         |
| factFlyR            |      | Double | 否       | 实际飞行距离，单位km，保留1位小数。例：8.5                   |

### 请求响应参数

| 字段名   | 属性 | 类型    | 是否必传 | 说明                      |
| -------- | ---- | ------- | -------- | ------------------------- |
| code     |      | Integer | 是       | 请求错误码 0:成功 非0:失败 |
| errorMsg |      | String  | 否       | 请求错误信息              |

​					

### 请求示例
```json
{
	"timestamp": 2024012409500,
	"area": "广东深圳宝安区",
	"createTm": 2024012409500,
	"flightCode": "CN010010R03K2411120004",
	"comNum": "3005",
	"uasType": "ARK40",
	"takeoffTerminalCode": "CNB030259",
	"takeoffPointCode": "CNA250819-BA001",
	"takeoffPointName": "测试起飞场",
	"landTerminalCode": "CNB030259",
	"landPointCode": "CNA250819-BA001",
	"landPointName": "测试降落场",
	"routeCode": "R001",
	"flightStatus": 1,
	"planFlyTime": 8.6,
	"planFlyDist": 15.8,
	"realTakeoffTime": 2024012409500,
	"realLandTime": 2024012409500,
	"factFlyR": 20.5
}
```

### 响应示例(成功code一定要是0)

```json
{
    "code":0,
    "errorMsg":null
}
```