/**
 * [Dingtalk] 根据 userid 获取用户详情 (查询用户详情)
 * [doc](https://developers.dingtalk.com/document/app/query-user-details)
 * [相似功能](https://developers.dingtalk.com/document/app/dingtalk-retrieve-user-information)
 *
 * 混合权限, 除了接口调用权限外, 返回数据还受到其他权限影响, 详见文档.
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
  title?: string;
  /** 职员工号 */
  number?: string;
  /** 入职时间 */
  hiredTime?: number;
  /** 头像 */
  avatar: string;
  /** 是否已激活钉钉 */
  active: boolean;
  unionid: string;
}> {
  const path = `https://oapi.dingtalk.com/topapi/v2/user/get`;
  const q = new URLSearchParams({ access_token: token });
  const res = await fetch(`${path}?${q}`, {
    method: 'POST',
    body: JSON.stringify({ userid: userID }),
  }).then((v) => v.json());
  if (res.errmsg !== 'ok' || res.errcode !== 0) {
    throw new Error(`dd error: ${res.errcode} ${res.errmsg}`);
  }
  const {
    name,
    mobile: phonenum,
    title,
    job_number: number,
    hired_date: hiredTime,
    avatar,
    active,
    unionid,
  } = res.result;
  if (typeof name !== 'string') {
    throw new TypeError('name');
  }
  if (typeof number !== 'string' && number !== undefined) {
    throw new TypeError(`number is ${typeof number}`);
  }
  if (typeof phonenum !== 'string') {
    throw new TypeError(`需要开通 fieldMobile 权限`);
  }
  if (hiredTime !== undefined && typeof hiredTime !== 'number') {
    throw new TypeError('hiredTime');
  }
  if (typeof title !== 'string' && title !== undefined) {
    throw new TypeError(`title is ${typeof title}`);
  }
  if (typeof avatar !== 'string') {
    throw new TypeError('avatar');
  }
  if (typeof active !== 'boolean') {
    throw new TypeError('active');
  }
  if (typeof unionid !== 'string') {
    throw new TypeError('unionid');
  }

  // 用于进一步实际调试类型
  // console.log(res.result);

  return { name, phonenum, title, number, hiredTime, avatar, active, unionid };
}

/**
 * [Dingtalk] 获取部门下的用户列表 (获取部门用户详情)
 * [doc](https://open.dingtalk.com/document/orgapp-server/queries-the-complete-information-of-a-department-user)
 */
export async function getDingtalkUserByDeptID(deptID: number, token: string) {
  const url = new URL(`https://oapi.dingtalk.com/topapi/v2/user/list`);
  url.searchParams.set('access_token', token);
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      dept_id: deptID,
      cursor: 0,
      size: 10,
    }),
  });
  const resBody = await res.json();
  if (resBody.errmsg !== 'ok') {
    throw new Error(''.concat(resBody.errcode + ': ').concat(resBody.errmsg));
  }
  return {
    status: res.status,
    body: resBody.result,
  };
}

/**
 * [Dingtalk] 根据手机号查询用户 ID (根据手机号查询用户)
 * [doc](https://open.dingtalk.com/document/orgapp-server/query-users-by-phone-number)
 */
export async function getDingtalkUserIDByPhonenum(
  phonenum: string,
  token: string,
): Promise<{ status: number; body: { userid: string } }> {
  const url = new URL(`https://oapi.dingtalk.com/topapi/v2/user/getbymobile`);
  url.searchParams.set('access_token', token);
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      mobile: phonenum,
    }),
  });
  const resBody = await res.json();
  if (resBody.errmsg !== 'ok') {
    throw new Error(''.concat(resBody.errcode + ': ').concat(resBody.errmsg));
  }
  return {
    status: res.status,
    body: resBody.result,
  };
}
