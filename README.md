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

## 使用

使用方式有两种, 一是使用类, 二是使用函数.
类是函数的包裹, 主要解决函数使用上的基础问题.

类的方式使用, 比如:

```ts
const dingtalk = new DingtalkSDK({
  appkey: DINGTALK_APPKEY,
  appsecret: DINGTALK_APPSECRET,
  getToken: getTokenWithPg,
  setToken: setTokenWithPg,
});
```

其中, `getTokenWithPg`, `setTokenWithPg` 是从系统缓存读写数据.
比如 getTokenWithPg 是从 PostgreSQL 数据库中获取 token. setTokenWithPg 是更新
PostgreSQL 数据库中的 token.

## 开发

测试时可能需要的环境变量:

- DINGTALK_ACCESSTOKEN
- DINGTALK_UNIONID
- `TEST_DINGTALK_PHONENUM` 测试用 钉钉 用户手机号码
- DINGTALK_UNIONID_2
- DINGTALK_PROCESSCODE
- `DINGTALK_AGENTID`
- `DINGTALK_APPKEY`
- `DINGTALK_APPSECRET`
- `TEST_DINGTALK_USERID` 测试用 钉钉 userid
