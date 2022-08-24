import { getDingtalkUserByUserID } from './user.ts';
import { assertEquals } from 'https://deno.land/std@0.152.0/testing/asserts.ts';

const DINGTALK_ACCESSTOKEN = Deno.env.get('DINGTALK_ACCESSTOKEN') ?? '';
const DINGTALK_USERID = Deno.env.get('DINGTALK_USERID') ?? '';

Deno.test('getDingtalkUserByUserID', async () => {
  const res = await getDingtalkUserByUserID(
    DINGTALK_USERID,
    DINGTALK_ACCESSTOKEN,
  );
  console.log('res', res);
  assertEquals(typeof res?.name, 'string');
});
