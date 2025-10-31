
# 无人机任务数据推送 

### 接口说明

无人机执行飞行任务时，会由丰翼回调对接方的回调地址，推送本次航班的创建、起飞、降落等事件

0-待起飞：航班任务创建时推送，推送全量数据
1-航线飞行中：无人机起飞时，进行推送
2-备降中：无人机执行备降操作时，进行推送
3-返航中：无人机执行返航时，进行推送
4-紧急迫降：无人机执行迫降时，进行推送
5-任务结束：无人机降到地面锁桨时，进行推送


 ### 接口地址

 POST
 回调URL

### 请求参数

| 字段名              | 属性 | 类型   | 是否必传 | 说明                                                         |
| ------------------- | ---- | ------ | -------- | ------------------------------------------------------------ |
| timestamp           |      | Long   | 是       | 当前时间，格式"yyyyMMddHHmmss"，例：20240124095000            |
| area                |      | String | 否       | 运行城市，例： 广东省东莞市                                  |
| createTm            |      | String | 是       | 任务开始时间，格式"yyyyMMddHHmmss"，例：20240124095000        |
| flightCode          |      | String | 是       | 航班号，例：CN010010R03K2411120004                           |
| comNum              |      | String | 是       | 无人机编号，无人机唯一标识，例：8325                        |
| uavType             |      | String | 是       | 机型，例：ARK40                      |
| takeoffTerminalCode |      | String | 是       | 起飞航站编号，例：CNB030259                                  |
| takeoffPointCode    |      | String | 是       | 起飞场编号，例：CNA250819-BA001                              |
| takeoffPointName    |      | String | 是       | 起飞场名称，例：松山湖可靠性测试起飞场                       |
| landTerminalCode    |      | String | 是       | 降落航站编号，例：CNA250819-BA001                           |
| landPointCode       |      | String | 是       | 降落场编号，例：CNA250819-BA002                              |
| landPointName       |      | String | 是       | 降落场名称，例：松山湖可靠性测试降落场                       |
| routeCode           |      | String | 是       | 航线编码，例：GZC01R40FL001                                  |
| flightStatus        |      | String | 是       | 航班当前状态：0-待起飞，1-航线飞行中，2-备降中，3-返航中，4-紧急迫降，5-任务结束 |
| planFlyTime         |      | Double | 否       | 计划飞行时长，单位min，保留1位小数。例：3.1                  |
| planFlyDist         |      | Double | 否       | 计划飞行距离，单位km。例：8.53                  |
| realTakeoffTime     |      | String | 否       | 实际起飞时间，格式"yyyyMMddHHmmss"，例：20240124095000        |
| eArrivalTime        |      | String | 否       | 预计到达时间，格式"yyyyMMddHHmmss"，例：20240124095000(仅ARK40机型支持) |
| realLandTime        |      | String | 否       | 实际降落时间，格式"yyyyMMddHHmmss"，例：20240124095000         |
| factFlyR            |      | Double | 否       | 实际飞行距离，单位km。例：8.53                   |

### 请求响应参数

| 字段名   | 属性 | 类型    | 是否必传 | 说明                      |
| -------- | ---- | ------- | -------- | ------------------------- |
| code     |      | Integer | 是       | 请求错误码 0:成功 非0:失败 |
| errorMsg |      | String  | 否       | 请求错误信息              |

​					

### 请求示例
```json
{
    "area": "广东省深圳市",
    "routeCode": "CN010007R00WL003",
    "takeoffPointCode": "CN110075-QA003",
    "uavType": "AMOS-ARK80",
    "factFlyR": 4.104,
    "flightCode": "CN010007R00W2509180004",
    "landPointCode": "CN110075-QA004",
    "flightStatus": "5",
    "takeoffPointName": "ARK80-3D深圳点A",
    "realLandTime": "20250918145324",
    "takeoffTerminalCode": "CN110075",
    "landPointName": "ARK80-3D深圳点B",
    "eArrivalTime": "20250918144834",
    "landTerminalCode": "CN110075",
    "planFlyDist": 3.83,
    "createTm": "20250918144738",
    "realTakeoffTime": "20250918144826",
    "comNum": "55555",
    "planFlyTime": 5.0,
    "timestamp": 20250918145327
}
```

### 响应示例(成功code一定要是0)

```json
{
    "code":0,
    "errorMsg":null
}
```