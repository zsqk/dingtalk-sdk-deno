import { assertEquals } from 'https://deno.land/std@0.152.0/testing/asserts.ts';
import { getDingtalkAccessToken } from './accesstoken.ts';

const DINGTALK_APPKEY = Deno.env.get('DINGTALK_APPKEY') ?? '';
const DINGTALK_APPSECRET = Deno.env.get('DINGTALK_APPSECRET') ?? '';

Deno.test('getDingtalkAccessToken', async () => {
  const res = await getDingtalkAccessToken(DINGTALK_APPKEY, DINGTALK_APPSECRET);
  console.log(res);
  assertEquals(typeof res.accessToken, 'string');
  assertEquals(typeof res.expireAt, 'number');
});
