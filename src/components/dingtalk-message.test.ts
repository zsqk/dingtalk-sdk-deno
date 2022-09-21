import { assertEquals } from 'https://deno.land/std@0.148.0/testing/asserts.ts';
import { getDingtalkAccessToken } from 'https://deno.land/x/dingtalk_sdk@v0.0.2/src/components/accesstoken.ts';

const DINGTALK_AGENTID = Deno.env.get('DINGTALK_AGENTID')!;
const DINGTALK_APPKEY = Deno.env.get('DINGTALK_APPKEY')!;
const DINGTALK_APPSECRET = Deno.env.get('DINGTALK_APPSECRET')!;
const TEST_DINGTALK_USERID = Deno.env.get('DINGTALK_USERID')!;

import {
  Link,
  Markdown,
  MultCard,
  OA,
  sendDingtalkCorpMessage,
  sendDingtalkGroupMessage,
  SingleCard,
  Text,
} from './dingtalk-message.ts';

// 测试用的钉钉用户 ID，测试消息将发送到该用户
const dingtalkUserID = TEST_DINGTALK_USERID;

/**
 * 测试发送工作通知文本消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpText', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: Text = { textContent: 'test dingtalk corp msg' };
  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试发送工作通知链接消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpLink', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: Link = {
    linkTitle: '测试 Link',
    linkText: 'I am Text',
    messageURL: 'https://zsqk.com.cn',
    pictureURL: '@mediaidofimage',
  };
  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试发送工作通知 OA 消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpOA', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: OA = {
    messageURL: 'https://zsqk.com.cn',
    pcMessageURL: 'https://zsqk.com.cn',
    head: {
      bgcolor: '#ff0000',
      text: '测试 OA 消息',
    },
    statusBar: {
      statusValue: '正在进行中...',
    },
    body: {
      title: 'Body Title',
      form: [
        { key: '姓名', value: 'xingming' },
        { key: '年龄', value: '0' },
        { key: '其他', value: 'other' },
      ],
      rich: {
        num: '1',
        unit: '个',
      },
      content: 'i am content',
      author: 'tester',
    },
  };
  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试发送工作通知 Markdown 消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpMarkdown', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: Markdown = {
    mdTitle: 'markdown test',
    mdText:
      '# AAA\n**粗体**: AAA*斜体*BBB\n\n # BBB\n- zsqk\n- [zsqk-link](https://zsqk.com.cn)',
  };
  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试发送工作通知单按钮卡片消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpSingleCard', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: SingleCard = {
    title: '卡片标题',
    markdown:
      '# AAA\n**粗体**: AAA*斜体*BBB\n\n # BBB\n- zsqk\n- [zsqk-link](https://zsqk.com.cn)',
    singleTitle: '详情',
    singleURL: 'https://zsqk.com.cn',
  };

  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试发送工作通知多按钮卡片消息
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('corpMultCard', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );
  const msg: MultCard = {
    title: '卡片标题',
    markdown: 'content',
    buttonJSONList: [
      { title: '按钮一', action_url: 'https://zsqk.com.cn' },
      { title: '按钮二', action_url: 'https://zsqk.com.cn' },
    ],
  };

  const res = await sendDingtalkCorpMessage({
    message: msg,
    agentID: DINGTALK_AGENTID,
    dingtalkUserIDs: [dingtalkUserID],
  }, token.accessToken);
  console.log(res, res.code, res.message);
  assertEquals(res.code, 0);
});

/**
 * 测试企业群消息
 *
 * 创建群时会返回两个群回话 ID，文档中写到后续版本将不再使用 chatid，
 * 而使用 openConversationId 作为唯一标识，但发送群消息时仍然仅能使用 chatid
 * see https://open.dingtalk.com/document/orgapp-server/create-group-session
 *
 * @author zk <zk@go0356.com>
 */
Deno.test('group', async () => {
  const token = await getDingtalkAccessToken(
    DINGTALK_APPKEY,
    DINGTALK_APPSECRET,
  );

  // 创建群
  const url =
    `https://oapi.dingtalk.com/chat/create?access_token=${token.accessToken}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: '测试发送企业群消息',
      owner: dingtalkUserID,
      useridlist: [dingtalkUserID],
    }),
  });
  const result = await res.json();
  if (result.errcode !== 0) {
    console.log(result);
    throw new Error('create group error');
  }
  console.log(result);
  const chatid = result.chatid;

  // 发送群消息
  const msg: Text = { textContent: 'test dingtalk group msg' };
  const resp = await sendDingtalkGroupMessage(msg, chatid, token.accessToken);
  console.log(resp, resp.code, resp.message);
  assertEquals(resp.code, 0);
});
