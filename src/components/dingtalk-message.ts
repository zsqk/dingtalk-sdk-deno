/**
 * 钉钉消息模块
 *
 * 消息类型文档：{@link https://open.dingtalk.com/document/orgapp-server/message-types-and-data-format}
 *
 * @example
 * 调用方法：
 *  const dm = new DingtalkMessage(token);                              // 创建类实例
 *  const res = await dm.corp(DINGTALK_AGENTID, msg, [dingtalkUserID]); // 发送工作通知
 *  const res = await dm.group(msg, chatid);                            // 发送群消息
 *  const res = await dm.chat(msg, dingtalkUserID, chatid);             // 发送普通消息
 */

/**
 * 响应类型
 *
 * 钉钉消息 API 不论调用成功或失败都返回 code 和 message 字段
 * code 为 0 表示调用成功（仅代表钉钉 API 接口调用成功，并不表示接收者一定收到消息）
 *
 * @author zk <zk@go0356.com>
 */
export type Resp = {
  /** code 表示请求响应码，0 表示成功 */
  code: number;
  message: string;
};

/**
 * 文本消息
 *
 * @author zk <zk@go0356.com>
 */
export type Text = {
  textContent: string;
};

/**
 * 图片消息
 *
 * @author zk <zk@go0356.com>
 */
export type Image = {
  imageMediaID: string;
};

/**
 * 语音消息
 *
 * @author zk <zk@go0356.com>
 */
export type Voice = {
  voiceMediaID: string;
  duration: string;
};

/**
 * 文件消息
 *
 * @author zk <zk@go0356.com>
 */
export type File = {
  fileMediaID: string;
};

/**
 * 链接消息
 *
 * @author zk <zk@go0356.com>
 */
export type Link = {
  linkTitle: string;
  linkText: string;
  /** messageURL 表示消息点击链接地址，支持小程序跳转链接 */
  messageURL: string;
  /** pictureURL 表示钉钉内的图片 MediaID */
  pictureURL: string;
};

/**
 * OA 消息
 *
 * @author zk <zk@go0356.com>
 */
export type OA = {
  /** messageURL 表示消息点击链接地址，支持小程序跳转链接 */
  messageURL: string;
  /** pcMessageURL 表示 PC 端点击消息时跳转到的地址 */
  pcMessageURL?: string;
  head: {
    /** text 表示消息头部内容 */
    text: string;
    /** bgcolor 表示消息头部背景颜色，限制为 8 个英文字符，前 2 位表示透明度。例：FFBBBBBB */
    bgcolor: string;
  };
  /** body 表示消息体 */
  body: {
    title?: string;
    /** form 表示消息体的表单，最多显示 6 个 */
    form?: Array<{
      key?: string;
      value?: string;
    }>;
    rich?: {
      num?: string;
      unit?: string;
    };
    content?: string;
    image?: string;
    fileCount?: number;
    /** author 表示作者名字 */
    author?: string;
  };
  statusBar?: {
    statusValue?: string;
    statusBgcolor?: string;
  };
};

/**
 * markdown 消息
 *
 * @author zk <zk@go0356.com>
 */
export type Markdown = {
  mdTitle: string;
  mdText: string;
};

/**
 * 单按钮卡片消息（整体跳转）
 *
 * @author zk <zk@go0356.com>
 */
export type SingleCard = {
  title: string;
  markdown: string;
  singleTitle: string;
  singleURL: string;
};

/**
 * 多按钮卡片消息（独立跳转）
 *
 * @author zk <zk@go0356.com>
 */
export type MultCard = {
  title: string;
  markdown: string;
  buttonJSONList: Array<{
    title: string;
    action_url: string;
  }>;
};

/**
 * 全部消息类型
 *
 * @author zk <zk@go0356.com>
 */
export type MessageType =
  | Text
  | Image
  | Voice
  | File
  | Link
  | OA
  | Markdown
  | SingleCard
  | MultCard;

// TODO: 整理入 DingtalkSDK 以一致化体验
/**
 * 钉钉消息
 *
 * 提供了 3 种消息发送方式
 *  - 工作通知
 *  - 企业群消息
 *  - 普通消息
 *
 * 每种消息发送方式都可以发送以下消息类型
 *  - 文本消息
 *  - 图片消息
 *  - 语音消息
 *  - 文件消息
 *  - 链接消息
 *  - OA 消息
 *  - Markdown 消息
 *  - 单按钮卡片消息
 *  - 多按钮卡片消息
 */

/**
 * 获取消息类型
 *
 * @author zk <zk@go0356.com>
 */
function getType(message: MessageType): string {
  if ('textContent' in message) {
    return 'text';
  } else if ('imageMediaID' in message) {
    return 'image';
  } else if ('voiceMediaID' in message) {
    return 'voice';
  } else if ('fileMediaID' in message) {
    return 'file';
  } else if ('linkTitle' in message) {
    return 'link';
  } else if ('body' in message) {
    return 'oa';
  } else if ('mdTitle' in message) {
    return 'markdown';
  } else if ('singleTitle' in message) {
    return 'single_action_card';
  } else if ('buttonJSONList' in message) {
    return 'mult_action_card';
  }

  return 'unknown';
}

/**
 * 生成消息 JSON 字符串
 *
 * @author zk <zk@go0356.com>
 */
function getMessageBody(message: MessageType): Record<string, unknown> {
  let data: MessageType;
  switch (getType(message)) {
    case 'text':
      data = message as Text;
      return {
        msgtype: 'text',
        text: {
          content: data.textContent,
        },
      };
    case 'image':
      data = message as Image;
      return {
        msgtype: 'image',
        image: {
          media_id: data.imageMediaID,
        },
      };
    case 'voice':
      data = message as Voice;
      return {
        msgtype: 'voice',
        voice: {
          media_id: data.voiceMediaID,
          duration: data.duration,
        },
      };
    case 'file':
      data = message as File;
      return {
        msgtype: 'file',
        file: {
          media_id: data.fileMediaID,
        },
      };
    case 'link':
      data = message as Link;
      return {
        msgtype: 'link',
        link: {
          messageUrl: data.messageURL,
          picUrl: data.pictureURL,
          title: data.linkTitle,
          text: data.linkText,
        },
      };
    case 'oa':
      data = message as OA;
      return {
        msgtype: 'oa',
        oa: {
          message_url: data.messageURL,
          head: {
            bgcolor: data.head.bgcolor,
            text: data.head.text,
          },
          body: {
            title: data.body.title,
            form: data.body.form,
            rich: data.body.rich,
            content: data.body.content,
            image: data.body.image,
            file_count: data.body.fileCount,
            author: data.body.author,
          },
        },
      };
    case 'markdown':
      data = message as Markdown;
      return {
        msgtype: 'markdown',
        markdown: {
          title: data.mdTitle,
          text: data.mdText,
        },
      };
    case 'single_action_card':
      data = message as SingleCard;
      return {
        msgtype: 'action_card',
        action_card: {
          title: data.title,
          markdown: data.markdown,
          single_title: data.singleTitle,
          single_url: data.singleURL,
        },
      };
    case 'mult_action_card':
      data = message as MultCard;
      return {
        msgtype: 'action_card',
        action_card: {
          title: data.title,
          markdown: data.markdown,
          btn_orientation: 1,
          btn_json_list: data.buttonJSONList,
        },
      };
    default:
      console.log('dingtalk-message error: invalid message type');
      throw new Error('dingtalk-message error: invalid message type');
  }
}

/**
 * 发送工作通知
 *
 * 工作通知文档：{@link https://open.dingtalk.com/document/orgapp-server/asynchronous-sending-of-enterprise-session-messages}
 *
 * @author zk <zk@go0356.com>
 */
export async function sendDingtalkCorpMessage(
  { message, agentID, dingtalkUserIDs, dingtalkDeptIDs, toAllUser }: {
    /**
     * 消息内容
     */
    message: MessageType;
    /**
     * 发送消息时使用的微应用的 AgentID
     */
    agentID: string;
    /**
     * 接收者的钉钉 userid 列表，最大长度为 100
     */
    dingtalkUserIDs?: string[];
    /**
     * 接收者的部门 ID 列表（包括子部门），最大长度为 20
     */
    dingtalkDeptIDs?: string[];
    /**
     * 是否发送给企业全部用户
     */
    toAllUser?: boolean;
  },
  token: string,
): Promise<Resp> {
  // 验证接收者不为空
  if (
    (dingtalkUserIDs === undefined || dingtalkUserIDs.length === 0) &&
    (dingtalkDeptIDs === undefined || dingtalkDeptIDs?.length === 0) &&
    toAllUser === false
  ) {
    throw Error('dingtalk-message error: no receivers set');
  }

  const url =
    `https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=${token}`;
  const data: {
    msg: Record<string, unknown>;
    agent_id: string;
    userid_list?: string;
    dept_id_list?: string;
    to_all_user?: boolean;
  } = {
    agent_id: agentID,
    msg: getMessageBody(message),
  };

  data.userid_list = dingtalkUserIDs === undefined
    ? undefined
    : dingtalkUserIDs.join(',');
  data.dept_id_list = dingtalkDeptIDs === undefined
    ? undefined
    : dingtalkDeptIDs.join(',');
  data.to_all_user = toAllUser === undefined ? false : toAllUser;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  const resp: Resp = {
    code: result.errcode,
    message: result.errmsg,
  };

  return resp;
}

/**
 * 发送普通消息
 * 普通消息文档：{@link https://open.dingtalk.com/document/orgapp-server/send-normal-messages}
 *
 * @author zk <zk@go0356.com>
 */
export async function sendDingtalkChatMessage(
  /**
   * 消息内容
   */
  message: MessageType,
  /**
   * 消息发送者的钉钉 userid
   */
  dingtalkUserID: string,
  /**
   * 群会话或者个人会话的 ID
   */
  chatID: string,
  token: string,
): Promise<Resp> {
  const url =
    `https://oapi.dingtalk.com/message/send_to_conversation?access_token=${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: dingtalkUserID,
      cid: chatID,
      msg: getMessageBody(message),
    }),
  });

  const result = await res.json();
  const resp: Resp = {
    code: result.errcode,
    message: result.errmsg,
  };

  return resp;
}

/**
 * 发送企业群消息
 * 群消息文档：{@link https://open.dingtalk.com/document/orgapp-server/enterprise-group-message-overview}
 *
 * @author zk <zk@go0356.com>
 */
export async function sendDingtalkGroupMessage(
  /**
   * 消息内容
   */
  message: MessageType,
  /**
   * 群会话的 ID
   */
  chatID: string,
  token: string,
): Promise<Resp> {
  const url = `https://oapi.dingtalk.com/chat/send?access_token=${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatid: chatID,
      msg: getMessageBody(message),
    }),
  });

  const result = await res.json();
  const resp: Resp = {
    code: result.errcode,
    message: result.errmsg,
  };

  return resp;
}
