import {
  addDingtalkApprovalInstance,
  getDingtalkApprovalProcess,
} from './approval.ts';

const DINGTALK_ACCESSTOKEN = Deno.env.get('DINGTALK_ACCESSTOKEN') ?? '';
const DINGTALK_USERID = Deno.env.get('DINGTALK_USERID') ?? '';
const DINGTALK_PROCESSCODE = Deno.env.get('DINGTALK_PROCESSCODE') ?? '';

Deno.test('addDingtalkApprovalInstance-base', async () => {
  const res = await addDingtalkApprovalInstance({
    originatorUserId: DINGTALK_USERID,
    processCode: DINGTALK_PROCESSCODE,
    formComponentValues: [{ name: '审批内容', value: new Date().toString() }],
  }, DINGTALK_ACCESSTOKEN);
  console.log(res);
});

Deno.test('addDingtalkApprovalInstance-opt', async () => {
  const res = await addDingtalkApprovalInstance({
    originatorUserId: DINGTALK_USERID,
    processCode: DINGTALK_PROCESSCODE,
    formComponentValues: [
      { name: '审批内容', value: new Date().toString() },
      { name: '审批金额', value: '100' },
    ],
  }, DINGTALK_ACCESSTOKEN);
  console.log(res);
});

Deno.test('getDingtalkApprovalProcess', async () => {
  const res = await getDingtalkApprovalProcess(
    DINGTALK_PROCESSCODE,
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
});
