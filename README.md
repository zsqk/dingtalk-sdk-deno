# dingtalk-sdk-deno

Dingtalk SDK for Deno

<a href="https://deno.land/x/dingtalk_sdk"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdingtalk_sdk" alt="dingtalk_sdk latest /x/ version" /></a>

为 Deno 设计, 目前支持浏览器环境 (!!!基于安全原因, 不建议在浏览器中直接使用).

## 功能

实现的钉钉功能:

1. 获取 token.
2. 通过 code 获取用户信息.
3. 通过 userid 获取用户信息.
4. 新增审批实例.
5. 创建钉钉待办任务.
6. 查看用户钉钉待办任务.
7. 根据手机号查询用户 ID.
8. 获取部门下的用户列表.
9. 根据 userid 获取用户详情.

## 开发

测试时可能需要的环境变量:

- DINGTALK_ACCESSTOKEN
- DINGTALK_USERID
- DINGTALK_UNIONID
- DINGTALK_PHONENUM
- DINGTALK_UNIONID_2
- DINGTALK_PROCESSCODE
- DINGTALK_AGENTID
- DINGTALK_APPKEY
- DINGTALK_APPSECRET
