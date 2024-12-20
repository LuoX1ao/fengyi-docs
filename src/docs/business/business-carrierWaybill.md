---
title: 查询运力是否可用接口 
date: 2024-12-13
description: 询丰翼在该地区范围内是否有无人机承运运力
author: 江建莉
# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---

> ***查询丰翼在该地区范围内是否有无人机承运运力***

- 接口地址：/uocs-tes/waybill/api/carrierWaybill
- 请求方法：POST
- 请求参数

    |字段名			|属性	    |类型	|是否必传	|说明                                            |
    |---------------|-----------|-------|-----------|------------------------------------------------|
	|devCode		|			|String	|是			|企业账号                                        |
	|gpsType		|			|Int	|是			|默认坐标系类型 1：WGS－84                       |
	|senderLon		|			|String	|是			|寄件人地址经度                                  |
	|senderLat		|			|String	|是			|寄件人地址纬度                                  |
	|goodsType		|			|Int	|是			|货物类型 默认传 10快递                          |
	|goodsWeight	|			|Int	|是			|货物重量(g) 默认传 2000                         |
	|receiverLon	|			|String	|是			|收件人地址经度                                  |
	|receiverLat	|			|String	|是			|收件人地址纬度                                  |

	
- 请求响应参数

    |字段名	 		|属性	    |类型	|是否必传	|说明	                                        |
    |---------------|-----------|-------|-----------|-----------------------------------------------|
	|requestId		|			|String	|是			|请求唯一标识                                   |
	|success		|			|Boolean|是			|true:成功 false:失败                           |
	|errorCode		|			|String	|否			|请求错误码                                     |
	|errorMessage	|			|String	|否			|请求错误信息(不可承运原因)                     |
	|date			|			|String	|是			|当前处理日期                                   |
	|version		|			|String	|否			|当前版本信息                                   |
	|obj			|			|T		|否			|业务结果类                                     |
	|				|gpsType	|Int	|是			|默认坐标系类型 1：WGS－84                      |
	|				|takeoffCode|String	|是			|起飞场航站代码                                 |
	|				|takeoffLon	|String	|是			|起飞场航站经度                                 |
	|				|takeoffLat	|String	|是			|起飞场航站纬度                                 |
	|				|takeoffName|String	|是			|起飞场航站名称                                 |
	|				|takeoffAddr|String	|是			|起飞场航站地址                                 |
	|				|takeoffTel	|String	|是			|起飞场航站手机                                 |
	|				|landingCode|String	|是			|降落场航站代码                                 |
	|				|landingLon	|String	|是			|降落场航站经度                                 |
	|				|landingLat	|String	|是			|降落场航站纬度                                 |
	|				|landingName|String	|是			|降落场航站名称                                 |
	|				|landingAddr|String	|是			|降落场航站地址                                 |
	|				|landingTel	|String	|是			|降落场航站手机                                 |
	|				|flightTime	|Int	|是			|预计飞行时长(min)                              |

		
- 请求示例
    ```json
    {
        "devCode": "tc123456",
    	"gpsType": 1,
    	"senderLon": "113.9311883",
    	"senderLat": "22.5616979",
    	"goodsType": 1,
    	"goodsWeight": 8000,
    	"receiverLon": "114.0267861",
    	"receiverLat": "22.5353805"
    }
    ```
- 响应示例：
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
    	"obj": {
    		"goodsType": 1,
            "takeoffCode":"CN001",
    		"takeoffLon":"114.1234567",
    		"takeoffLat":"26.1234567",
    		"takeoffName":"五和起降场A",
    		"takeoffAddr":"龙岗五和",
    		"landingCode":"CN001",
    		"landingLon":"114.1234567",
    		"landingLat":"26.1234567",
    		"landingName":"五和起降场A",
    		"landingAddr":"龙岗五和",
    		"flightTime":14
    	}
    }
    ```