import {
  getDingtalkUserByDeptID,
  getDingtalkUserByUserID,
  getDingtalkUserIDByPhonenum,
} from './user.ts';
import { assertEquals } from 'https://deno.land/std@0.152.0/testing/asserts.ts';

const DINGTALK_ACCESSTOKEN = Deno.env.get('DINGTALK_ACCESSTOKEN') ?? '';
const DINGTALK_USERID = Deno.env.get('DINGTALK_USERID') ?? '';
const DINGTALK_PHONENUM = Deno.env.get('DINGTALK_PHONENUM') ?? '';

Deno.test('getDingtalkUserByUserID', async () => {
  const res = await getDingtalkUserByUserID(
    DINGTALK_USERID,
    DINGTALK_ACCESSTOKEN,
  );
  console.log('res', res);
  assertEquals(typeof res?.name, 'string');
});

Deno.test('getDingtalkUserByDeptID', async () => {
  const res = await getDingtalkUserByDeptID(
    1,
    DINGTALK_ACCESSTOKEN,
  );
  console.log('res', res);
});

Deno.test('getDingtalkUserIDByPhonenum', async () => {
  const res = await getDingtalkUserIDByPhonenum(
    DINGTALK_PHONENUM,
    DINGTALK_ACCESSTOKEN,
  );
  console.log('res', res);
  assertEquals(typeof res?.body?.userid, 'string');
});
