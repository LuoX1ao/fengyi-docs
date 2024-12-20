---
title: 降落事件推送接口 (回调) 
date: 2024-12-13
description: 对接系统提供回调url,丰翼无人机降落事件推送回调系统
author: 江建莉
# tags:
#     - tag1
#     - tag2
category:
  - 业务管理
---

> ***对接系统提供回调url,丰翼无人机降落事件推送回调系统***

- 接口地址：{{回调url}}
- 请求方法：POST
- 请求参数

    |字段名			|属性	    |类型	|是否必传	|说明            |
    |---------------|-----------|-------|-----------|----------------|
	|fyCode			|			|String	|否			|丰翼编码        |
	|uavId			|			|String	|是			|无人机编码      |
	|taskId			|			|String	|是			|此次任务ID      |
	|landingCode	|			|String	|是			|降落航站编码    |
	|landingTime	|			|String	|是			|降落时间        |

	
- 请求响应参数

    |字段名	 		|属性	    |类型	|是否必传	|说明	                  |
    |---------------|-----------|-------|-----------|-------------------------|
	|code 			|			|String	|是			|请求错误码 0:成功 非0失败|
	|errorMsg		|			|Boolean|是			|请求错误信息             |


- 请求示例
    ```json
    {
        "fyCode": "FY00001",
        "uavId": "3012",
        "taskId": "211",
        "takeoffCode": "CN001",
        "takeoffTime": "2024-10-08 14:07:11"
    }
    ```
- 响应示例：
   
    ```json
	{
        "code":0,
        "errorMsg":null
	}
    ```