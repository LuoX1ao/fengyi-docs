---
title: 创建运单的接口
date: 2024-12-13
description: 在查询到丰翼无人机有承运运力之后，通过该接口向丰翼无人机下订单
author: 江建莉

# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---

> ***在查询到丰翼无人机有承运运力之后，通过该接口向丰翼无人机下订单***

- 接口地址：/uocs-tes/waybill/api/createWaybill
- 请求方法：POST
- 请求参数

    |字段名			|属性	    |类型	|是否必传	|说明                                            |
    |---------------|-----------|-------|-----------|------------------------------------------------|
	|devCode		|			|String	|是			|企业账号                                        |
	|pushTime		|			|String	|是			|推单时间 2024-10-21 17:00:00                    |
	|useCab		    |			|Int	|是			|是否使用接驳柜寄件 1：否；2：是  默认:1         |
	|boxCode		|			|String	|否			|接驳柜编码 useCab为2 必填                       |
	|bizCode		|			|String	|是			|客户单号                                        |
	|gpsType		|			|Int	|是			|默认坐标系 1：WGS－84                           |
	|senderCode		|			|String	|是			|寄件人航站编码                                  |
	|senderLon		|			|String	|是			|寄件人地址经度                                  |
	|senderLat		|			|String	|是			|寄件人地址纬度                                  |
	|senderAddr		|			|String	|是			|寄件人详细地址                                  |
	|senderTel		|			|String	|是			|寄件人电话                                      |
	|senderName		|			|String	|是			|寄件人姓名                                      |
	|goodsType		|			|Int	|是			|货物类型 默认传 10快递                          |
	|goodsWeight	|			|Int	|是			|货物重量(g) 默认传 2000                         |
	|receiverCode	|			|String	|是			|收件人航站编码                                  |
	|receiverLon	|			|String	|是			|收件人地址经度                                  |
	|receiverLat	|			|String	|是			|收件人地址纬度                                  |
	|receiverAddr	|			|String	|是			|收件人详细地址                                  |
	|receiverTel	|			|String	|是			|收件人电话                                      |
	|receiverName	|			|String	|是			|收件人姓名                                      |
	|amount			|			|Double	|否			|订单金额(元)                                    |
	|goodsCode		|			|String	|否			|货物编码 多个，隔开                             |
	|remark			|			|String	|否			|备注                                            |

	
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
	|				|fyCode		|String	|是			|丰翼编号	                     				|
	|				|sendCode	|String	|是			|寄件码(起飞场为丰巢柜时                        |

		
- 请求示例
    ```json
    {
        "devCode": "tc123456",
        "pushTime": "2024-10-08 14:07:11",
        "useCab": 1,
        "bizCode": "tc123456899",
        "senderCode": "CN001",
        "receiverCode": "CN0023",
        "gpsType": 1,
        "senderLon": "114.1234567",
        "senderLat": "26.1234567",
        "senderAddr": "深圳市",
        "senderTel": "13699847593",
        "senderName": "jacky",
        "goodsType": 1,
        "goodsWeight": 2000,
        "receiverLon": "114.1234567",
        "receiverLat": "26.1234567",
        "receiverAddr": "深圳市",
        "receiverTel": "13699847593",
        "receiverName": "jacky",
        "amount": 20.5,
        "remark": null
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
			"fyCode":"C123456",
			"sendCode":"65875"
		}
	}
    ```