/**
 * [Dingtalk] 获取钉钉用户基础信息 (通过免登码获取用户信息)
 * [doc](https://bit.ly/3sXTWuT)
 * @param code 免登授权码
 * @param token 调用服务端 API 的应用凭证
 * @returns
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkUserBaseByCode(
  code: string,
  token: string,
): Promise<{
  /** 设备ID */
  deviceID: string;
  /** 用户名字 */
  name: string;
  /** 用户的 unionID */
  unionID: string;
  /** 用户的 userID */
  userID: string;
  /** 是否是管理员 */
  isAdmin: boolean;
  /**
   * 级别。
   * 1：主管理员
   * 2：子管理员
   * 100：老板
   * 0：其他（如普通员工）
   */
  sysLevel: 1 | 2 | 100 | 0;
}> {
  const path = 'https://oapi.dingtalk.com/topapi/v2/user/getuserinfo';
  const q = new URLSearchParams({ access_token: token });
  const res = await fetch(`${path}?${q}`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  }).then((v) => v.json());
  if (res.errmsg !== 'ok' || res.errcode !== 0) {
    throw new Error(`dd error: ${res.errmsg}`);
  }
  const {
    device_id: deviceID,
    name,
    sys: isAdmin,
    sys_level: sysLevel,
    unionid: unionID,
    userid: userID,
  } = res.result;
  if (
    typeof deviceID !== 'string' ||
    typeof isAdmin !== 'boolean'
  ) {
    throw TypeError('dd error deviceID/isAdmin');
  }
  if (typeof unionID !== 'string') {
    throw TypeError('dd error unionID');
  }
  if (typeof userID !== 'string') {
    throw TypeError('dd error userID');
  }
  if (typeof name !== 'string') {
    throw TypeError('dd error name');
  }
  if (sysLevel !== 1 && sysLevel !== 2 && sysLevel !== 100 && sysLevel !== 0) {
    throw TypeError('dd error sysLevel');
  }
  // 实测没有 associated_unionid 该属性
  return { deviceID, name, unionID, userID, isAdmin, sysLevel };
}
