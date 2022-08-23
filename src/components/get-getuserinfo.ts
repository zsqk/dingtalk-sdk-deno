/**
 * [Dingtalk] 获取钉钉用户基础信息 (通过免登码获取用户信息)
 * [doc](https://bit.ly/3sXTWuT)
 * @param code
 * @param token
 * @returns
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkUserInfo(
  code: string,
  token: string,
): Promise<{
  deviceID: string;
  name: string;
  unionID: string;
  userID: string;
  isAdmin: boolean;
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
    typeof name !== 'string' ||
    typeof unionID !== 'string' ||
    typeof userID !== 'string' ||
    typeof isAdmin !== 'boolean' ||
    typeof sysLevel !== 'number'
  ) {
    throw TypeError('dd error');
  }
  // 实测没有 associated_unionid 该属性
  // sys_level: 1 | 2 | 100 | 0
  return { deviceID, name, unionID, userID, isAdmin };
}
