---
title: 查询订单配送轨迹H5接口 
date: 2024-12-13
description: 对接系统提供回调url,丰翼将无人机状态推送回调系统
author: 江建莉

# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---

> ***对接系统提供回调url,丰翼将无人机状态推送回调系统***

- 接口地址：/uocs-tes/waybill/api/orderH5View
- 请求方法：POST
- 请求参数

    |字段名			|属性	    |类型	|是否必传   |说明      |
    |---------------|-----------|-------|-----------|----------|
	|devCode		|			|String	|是			|企业账号  |
	|fyCode		    |			|String	|是			|丰翼运单号|
                                                                                                                 
	
- 请求响应参数

    |字段名	 		|属性	    |类型	|是否必传	|说明	                  |
    |---------------|-----------|-------|-----------|-------------------------|
	|requestId		|			|String	|是			|请求唯一标识             |
	|success		|			|Boolean|是			|true:成功 false:失败     |
	|errorCode		|			|String	|否			|请求错误码               |
	|errorMessage	|			|String	|否			|请求错误信息             |
	|date			|			|String	|是			|当前处理日期             |
	|version		|			|String	|否			|当前版本信息             |
	|obj			|			|Object	|否			|业务结果类               |
	|			    | url		|String	|是			|H5地址                   |
	|		        | fyCode	|String	|是			|丰翼编码                 |
					

- 请求示例
    ```json
    {
        "devCode": "FY00001",
        "fyCode": "C123456"
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