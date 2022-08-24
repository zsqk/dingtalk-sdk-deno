import { addDingtalkTodo } from './todo.ts';

const DINGTALK_ACCESSTOKEN = Deno.env.get('DINGTALK_ACCESSTOKEN') ?? '';
const DINGTALK_UNIONID = Deno.env.get('DINGTALK_UNIONID') ?? '';
const DINGTALK_UNIONID_2 = Deno.env.get('DINGTALK_UNIONID_2') ?? '';

Deno.test('todo-base', async () => {
  const res = await addDingtalkTodo(
    { unionID: DINGTALK_UNIONID, subject: 'test todo-base' },
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
});

Deno.test('todo-executor', async () => {
  const res = await addDingtalkTodo(
    {
      unionID: DINGTALK_UNIONID,
      subject: 'test todo-executor',
      executorUnionIDs: [DINGTALK_UNIONID_2],
    },
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
});

Deno.test('todo-participant', async () => {
  const res = await addDingtalkTodo(
    {
      unionID: DINGTALK_UNIONID,
      subject: 'test todo-participant',
      participantUnionIDs: [DINGTALK_UNIONID_2],
    },
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
});

Deno.test('todo-dueTime', async () => {
  const res = await addDingtalkTodo(
    {
      unionID: DINGTALK_UNIONID,
      subject: 'test todo-dueTime',
      executorUnionIDs: [DINGTALK_UNIONID],
      dueTime: Date.now() + 600000,
    },
    DINGTALK_ACCESSTOKEN,
  );
  console.log(res);
});
