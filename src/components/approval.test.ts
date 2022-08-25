import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.152.0/testing/asserts.ts';
import {
  addDingtalkApprovalInstance,
  addDingtalkApprovalProcess,
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
  assertEquals(res.schemaContent.items[0].componentType, 'TextField');
  assertEquals(res.schemaContent.items[1].componentType, 'MoneyField');
});

Deno.test('addDingtalkApprovalProcess-s', async () => {
  const res = await addDingtalkApprovalProcess({
    name: 'test name',
    description: 'desc',
    formComponents: [{
      componentType: 'TextField',
      props: {
        label: 'test input',
        placeholder: 'lala',
        required: false,
      },
    }],
  }, DINGTALK_ACCESSTOKEN);
  console.log(res);
  assertEquals(typeof res.processCode, 'string');
});

Deno.test('addDingtalkApprovalProcess-500', async () => {
  const res = await addDingtalkApprovalProcess({
    name: '',
    description: '',
    formComponents: [{
      componentType: 'TextField',
      props: {
        label: 'test',
        placeholder: 'lala',
        required: false,
      },
    }],
  }, DINGTALK_ACCESSTOKEN);
  console.log(res);
});
