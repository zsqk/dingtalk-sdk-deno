/**
 * [Dingtalk] 获取后端 token
 * https://developers.dingtalk.com/document/app/obtain-orgapp-token
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkAccessToken(
  appkey: string,
  appsecret: string,
): Promise<{
  accessToken: string;
  expireAt: number;
}> {
  const now = Math.trunc(Date.now() / 1000);
  const q = new URLSearchParams({
    appkey,
    appsecret,
  });
  const res = await fetch(`https://oapi.dingtalk.com/gettoken?${q}`).then(
    (res) => res.json(),
  );
  if (res.errmsg !== 'ok' || res.errcode !== 0) {
    throw new Error(`dd error: ${res.errmsg}`);
  }
  const accessToken = res.access_token;
  const expireAt = now + res.expires_in;
  if (typeof accessToken !== 'string') {
    throw new TypeError('dd error: no accessToken');
  }
  if (typeof expireAt !== 'number') {
    throw new TypeError('dd error: no expireAt');
  }
  return { accessToken, expireAt };
}
