/**
 * [Dingtalk] 根据 userid 获取用户详情 (查询用户详情)
 * [doc](https://developers.dingtalk.com/document/app/query-user-details)
 * [相似功能](https://developers.dingtalk.com/document/app/dingtalk-retrieve-user-information)
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkUserByUserID(
  userID: string,
  token: string,
): Promise<{
  /** 职员姓名 */
  name: string;
  /** 职员手机号 */
  phonenum: string;
  /** 职员职位 */
  title: string;
  /** 职员工号 */
  number: string;
  /** 入职时间 */
  hiredTime?: number;
  /** 头像 */
  avatar: string;
  /** 是否已激活钉钉 */
  active: boolean;
}> {
  const path = `https://oapi.dingtalk.com/topapi/v2/user/get`;
  const q = new URLSearchParams({ access_token: token });
  const res = await fetch(`${path}?${q}`, {
    method: 'POST',
    body: JSON.stringify({ userid: userID }),
  }).then((v) => v.json());
  if (res.errmsg !== 'ok' || res.errcode !== 0) {
    throw new Error(`dd error: ${res.errmsg}`);
  }
  const {
    name,
    mobile: phonenum,
    title,
    job_number: number,
    hired_date: hiredTime,
    avatar,
    active,
  } = res.result;
  if (typeof name !== 'string') {
    throw new TypeError('name');
  }
  if (typeof number !== 'string') {
    throw new TypeError('number');
  }
  if (typeof phonenum !== 'string') {
    throw new TypeError('phonenum');
  }
  if (hiredTime !== undefined && typeof hiredTime !== 'number') {
    throw new TypeError('hiredTime');
  }
  if (typeof title !== 'string') {
    throw new TypeError('title');
  }
  if (typeof avatar !== 'string') {
    throw new TypeError('avatar');
  }
  if (typeof active !== 'boolean') {
    throw new TypeError('active');
  }
  console.log(res.result);
  return { name, phonenum, title, number, hiredTime, avatar, active };
}
