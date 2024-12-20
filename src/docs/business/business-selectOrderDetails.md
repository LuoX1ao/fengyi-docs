---
title: 查询订单详情信息接口  
date: 2024-12-13
description: 创建订单后，可以通过该接口查询订单当前相关配送信息
author: 江建莉
# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---

> ***创建订单后，可以通过该接口查询订单当前相关配送信息***

- 接口地址：/uocs-tes/waybill/api/selectOrderDetails
- 请求方法：POST
- 请求参数

    |字段名			|属性	    |类型	|是否必传	|说明                                            |
    |---------------|-----------|-------|-----------|------------------------------------------------|
	|devCode		|			|String	|是			|企业账号                                        |
	|fyCode			|			|String	|是			|丰翼运单号                                      |

	
- 请求响应参数

    |字段名	 		|属性	    |类型	|是否必传	|说明	                                        															
    |---------------|-----------|-------|-----------|---------------------------------------------------------------------------------------------------------------|															
	|requestId		|			|String	|是			|请求唯一标识                                   													    		|
	|success		|			|Boolean|是			|true:成功 false:失败                           																|	
	|errorCode		|			|String	|否			|请求错误码                                     																|	
	|errorMessage	|			|String	|否			|请求错误信息(不可承运原因)                     																|	
	|date			|			|String	|是			|当前处理日期                                   																|	
	|version		|			|String	|否			|当前版本信息                                   																|	
	|obj			|			|T		|否			|业务结果类                                     																|	
	|fyCode			|			|String	|是			|丰翼编码                                       																|	
	|bizCode		|			|String	|是			|客户单号                                       																|	
	|uavId			|			|String	|否			|无人机编码                                     																|	
	|taskId			|			|String	|否			|此次任务ID                                     																|	
	|takeoffCode	|			|String	|否			|起飞航站编码                                   																|	
	|takeoffTime	|			|String	|否			|起飞时间                                       																|	
	|receiveTime	|			|String	|否			|揽件时间                                       																|	
	|sendTime		|			|String	|否			|派件时间                                       																|	
	|landingCode	|			|String	|否			|降落航站编码                                   																|	
	|landingTime	|			|String	|否			|降落时间                                       																|	
	|pickUpCode		|			|String	|否			|取件码                                         																|	
	|orderStatus	|			|int	|否			|订单状态 0待揽件/1待起飞/2飞行中/3待接收/4已完成/5异常                                                 		|
	|taskStatus		|			|int	|否			|无人机任务状态 1:未飞行 2:任务中 3:正常降落航班      4:备降降落航班 5:返航降落航班 6:迫降降落航班 7:异常航班   |
	|sendCode		|			|String	|否			|寄件码                                                                                                 		|
	|exceptionReason|			|String	|否			|异常原因                                                                                               		|
		
- 请求示例
    ```json
   {
        "devCode": "tc123456",
        "fyCode": "FC001"
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
		"obj":null
	}
    ```