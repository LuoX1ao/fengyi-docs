---
title: 无人机态抛数据推送  
date: 2024-12-13
description: 无人机起飞后，丰翼云后台将定频进行无人机态势数据推送
author: 江建莉

# tags:
#     - tag1
#     - tag2
category:
  - 飞行管理
---


#### 无人机态抛数据推送
> ***无人机起飞后，丰翼云后台将定频进行无人机态势数据推送***

- 接口地址：{{回调URL}}
- 请求方法：POST
- 请求参数

    |字段名			    |属性	    |类型	|是否必传   |说明                             |
    |-------------------|-----------|-------|-----------|---------------------------------|
	|orderID			|			|String	|是			|厂商的无人机生产序列号（sn）－8位起飞日期（YYYYMMDD）－8位随机码（数字或字母均可）如：1581F5FHD25G100C1SDN-20240320-owvGyLqe|	
	|sn                 |			|String	|是			|厂商的无人机生产序列号|	
	|flightStatus		|			|String	|是			|TakeOff：代表当前架次飞行的首个轨迹点Inflight：代表当前架次飞行中除首尾以外的其它轨迹点Land：代表当前架次飞行的最后一个轨迹点|
	|manufacturerID     |			|String |是     	|生产厂商的统一社会信用代码|
    |uasID              |			|String |是     	|若无登记号，推送默认值 “UAS-DEFAULT"|
    |timeStamp          |			|String |是     	|格式"yyyyMMddHHmmss"，例：20240124095001|
    |uasModel           |			|String |是     	|字母、数字与符号的组合|
    |coordinate         |			|Integer|是     	|1：代表WGS-84 2：代表CGCS2000 3：代表GLONASS-PZ90|
    |longitude          |			|Long   |是     	|单位：度（°）精确到小数点后7位，乘10的7次方后传输|
    |latitude           |			|Long   |是     	|单位：度（°）精确到小数点后7位，乘10的7次方后传输|
    |heightType         |			|Integer|是     	|1.相对于起飞点的真高  2.相对于当前位置的真高|
    |height             |			|Integer|是     	|单位：米（m）精确到小数点后1位，乘10以后传输|
    |altitude           |			|Integer|是     	|单位：米（m）精确到小数点后1位，乘10以后传输|
    |VS                 |			|Integer|是     	|单位：米每秒（m/s）精确到小数点后1位，乘10后传输|
    |GS                 |			|Integer|是     	|单位：米每秒（m/s）精确到小数点后1位，乘10后传输|
    |course             |			|Integer|是     	|无人驾驶航空器当前时刻所在位置真北方向顺时针量至地速方向的夹角，范围（0度，360度］。暂不具备航迹角测算能力的型号产品，应报送默认值999.0”精确到小数点后1位，乘10后传输|
	
- 请求响应参数

    |字段名	 		|属性	    |类型	|是否必传	|说明	                  |
    |---------------|-----------|-------|-----------|-------------------------|
	|code 			|			|String	|是			|请求错误码 0:成功 非0失败|
	|errorMsg		|			|Boolean|是			|请求错误信息             |


					

- 请求示例
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
- 响应示例：
   
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