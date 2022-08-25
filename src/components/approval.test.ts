import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.152.0/testing/asserts.ts';
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
  assertEquals(typeof res.instanceId, 'string');
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
  assertEquals(typeof res.instanceId, 'string');
});

Deno.test('getDingtalkApprovalProcess', async () => {
  const res = await getDingtalkApprovalProcess(
    DINGTALK_PROCESSCODE,
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
  assertEquals(res.schemaContent.items[0].props.label, '审批内容');
  assertEquals(res.schemaContent.items[1].props.label, '审批金额');
  assertEquals(res.schemaContent.items[0].componentName, 'TextField');
  assertEquals(res.schemaContent.items[1].componentName, 'MoneyField');
});
