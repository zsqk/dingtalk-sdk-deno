# dingtalk-sdk-deno

Dingtalk SDK for Deno

<a href="https://deno.land/x/dingtalk_sdk"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fdingtalk_sdk" alt="dingtalk_sdk latest /x/ version" /></a>

为 Deno 设计, 目前支持浏览器环境 (!!!基于安全原因, 不建议在浏览器中直接使用).

实现的钉钉功能:

1. 获取 token.
2. 通过 code 获取用户信息.
3. 通过 userid 获取用户信息.
4. 新增审批实例.

可能需要的环境变量:

- DINGTALK_AGENTID
- DINGTALK_ACCESSTOKEN
- DINGTALK_USERID
- DINGTALK_UNIONID
- DINGTALK_UNIONID_2
- DINGTALK_PROCESSCODE
- DINGTALK_APPKEY
- DINGTALK_APPSECRET
