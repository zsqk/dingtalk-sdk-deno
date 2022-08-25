import { addDingtalkApprovalInstance } from './approval.ts';

const DINGTALK_ACCESSTOKEN = Deno.env.get('DINGTALK_ACCESSTOKEN') ?? '';
const DINGTALK_USERID = Deno.env.get('DINGTALK_USERID') ?? '';
const DINGTALK_PROCESSCODE = Deno.env.get('DINGTALK_PROCESSCODE') ?? '';

Deno.test('addDingtalkApprovalInstance', async () => {
  const res = await addDingtalkApprovalInstance({
    originatorUserId: DINGTALK_USERID,
    processCode: DINGTALK_PROCESSCODE,
    formComponentValues: [{ name: '审批内容', value: new Date().toString() }],
  }, DINGTALK_ACCESSTOKEN);
  console.log(res);
});
