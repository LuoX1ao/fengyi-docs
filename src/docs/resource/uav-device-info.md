# 无人机设备信息

<!-- ### 无人机设备信息接口 
*更新时间： 2024-12-13* -->

### 接口说明

查询无人机在线状态、SN机型、飞行时间、里程、架次等信息

### 接口地址

GET
/v1/aircrafts?uavId=uavId


### 请求参数

|字段名			|属性	    |类型	|是否必传	|说明          |
|---------------|-----------|-------|-----------|--------------|
|uavId			|		    |Int	|是			|无人机通信ID  |

### 请求响应参数

|字段名	 		|属性	    	|类型	|是否必传	|说明	               |
|---------------|---------------|-------|-----------|----------------------|
|requestId		|				|String	|是			|请求唯一标识          |
|success		|				|Boolean|是			|true:成功 false:失败  |
|errorCode		|				|String	|否			|请求错误码            |
|errorMessage	|				|String	|否			|请求错误信息          |
|date		   	| 				|String	|是			|当前处理日期          |
|version		|				|String	|否			|当前版本信息          |
|obj			|				|Object	|是			|业务结果类            |
|				|serverId		|String	|是			|无人机通信ID          |
|				|onlineStatus	|Int	|是			|无人机在线状态        |
|				|SN             |String |是			|无人机SN信息          |
|               |uavType        |String |是         |无人机机型            |
|               |flightTime     |Double |否         |无人机总飞行时间      |
|               |flightMileage  |Double |否         |无人机总飞行里程      |
|				|flightSorties	|Double	|否         |无人机总飞行架次      |
	
### 请求示例

```json
无
```

### 响应示例

```json
{
	"success": true,
	"errorCode": 200,
	"errorMessage": "ok",
	"date": "2024-03-22 11:31:03",
	"version": "1.0",
	"obj": {
		"total": 1,
		"records": [
			"uavId":5001,
			"onlineStatus":1,  
			"sn":"BM11927500MXM3N186",
			"uavType":"ARK40",
			"flightTime":100.2,
			"flightMileage":1023.42,
			"flightSorties":100  //飞行架次
		]
	}
}

```