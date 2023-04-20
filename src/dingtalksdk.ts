import { WithLog } from './common/log.ts';
import { getDingtalkAccessToken } from './components/accesstoken.ts';
import {
  addDingtalkApprovalInstance,
  addDingtalkApprovalProcess,
  getDingtalkApprovalProcess,
} from './components/approval.ts';
import {
  sendDingtalkCorpMessage,
  sendDingtalkGroupMessage,
} from './components/dingtalk-message.ts';
import { addDingtalkTodo, getDingtalkTodoList } from './components/todo.ts';
import { getDingtalkUserBaseByCode } from './components/user-login.ts';
import {
  getDingtalkUserByDeptID,
  getDingtalkUserByUserID,
} from './components/user.ts';

export class DingtalkSDK extends WithLog {
  /** appkey, 在钉钉开发者后台获取 */
  readonly appkey: string;

  /** appsecret, 在钉钉开发者后台获取 */
  private readonly appsecret: string;

  /** token 缓存相关 */
  private readonly getToken:
    | (() => Promise<
      {
        accessToken: string;
        /** accessToken 过期时间, UNIX 时间戳 (毫秒) */
        tokenExpireAt: number;
      }
    >)
    | undefined;
  private readonly setToken:
    | ((accessToken: string, tokenExpireAt: number) => Promise<void>)
    | undefined;

  /** 后端鉴权 token */
  private accessToken = '';

  /** accessToken 过期时间, UNIX 时间戳 (毫秒) */
  private tokenExpireAt = 0;

  constructor(
    { appkey, appsecret, getToken, setToken, isDebug = false }: {
      appkey: string;
      appsecret: string;
      getToken?: () => Promise<{ accessToken: string; tokenExpireAt: number }>;
      setToken?: (accessToken: string, tokenExpireAt: number) => Promise<void>;
      /** 调试模式, 默认 false */
      isDebug?: boolean;
    },
  ) {
    super(isDebug);
    this.appkey = appkey;
    this.appsecret = appsecret;
    getToken && (this.getToken = getToken);
    setToken && (this.setToken = setToken);
  }

  /**
   * 初始化功能 (确保 accessToken 可用)
   * @param opt
   * @returns
   */
  async init(opt: {
    /** 如果首次想避免自动生成 token, 可以直接传入 */
    token?: string;
    /** 如果想重置 token 的过期时间, 可以直接传入 */
    tokenExpireAt?: number;
  } = {}) {
    if (opt.token) {
      this.log('log', '使用了外部的 token', opt);
      this.accessToken = opt.token;
    }
    if (opt.tokenExpireAt) {
      this.log('log', '使用了外部的 tokenExpireAt', opt);
      this.tokenExpireAt = opt.tokenExpireAt;
    }

    // 不过期则直接使用
    if (this.tokenExpireAt > Date.now()) {
      return;
    }

    // 从缓存中获取
    if (this.getToken) {
      this.log('log', '准备从缓存中获取 accessToken');
      const res = await this.getToken();
      this.log('log', '已经从缓存中获取 accessToken', res);
      const tokenExpireAt = res.tokenExpireAt - 60000;
      if (tokenExpireAt > Date.now()) {
        this.accessToken = res.accessToken;
        this.tokenExpireAt = tokenExpireAt;
        return;
      }
    }

    // 重新获得 token
    const res = await getDingtalkAccessToken(this.appkey, this.appsecret);
    this.accessToken = res.accessToken;
    this.tokenExpireAt = res.expireAt * 1000 - 60000;

    // 写入缓存
    if (this.setToken) {
      this.setToken(this.accessToken, this.tokenExpireAt);
    }
  }

  /**
   * [Dingtalk] 获取钉钉用户基础信息 (通过免登码获取用户信息)
   * [doc](https://bit.ly/3sXTWuT)
   */
  async getUserBaseByCode(code: string) {
    await this.init();
    return getDingtalkUserBaseByCode(code, this.accessToken);
  }

  /**
   * [Dingtalk] 根据 userid 获取用户详情 (旧版 查询用户详情)
   * [doc](https://developers.dingtalk.com/document/app/query-user-details)
   */
  async getUserByUserID(userID: string) {
    await this.init();
    return getDingtalkUserByUserID(userID, this.accessToken);
  }

  /**
   * [Dingtalk] 获取部门下的用户列表 (获取部门用户详情)
   * [doc](https://open.dingtalk.com/document/orgapp-server/queries-the-complete-information-of-a-department-user)
   */
  async getUserByDeptID(deptID: number) {
    await this.init();
    return getDingtalkUserByDeptID(deptID, this.accessToken);
  }

  /**
   * [Dingtalk] 发起审批实例
   * [doc](https://open.dingtalk.com/document/orgapp-server/create-an-approval-instance)
   */
  async addApprovalInstance(d: {
    deptId?: number;
    originatorUserId: string;
    processCode: string;
    microappAgentId?: string;
    formComponentValues: Array<{
      id?: string;
      name: string;
      value: string;
    }>;
    targetSelectActioners?: [];
  }) {
    await this.init();
    return addDingtalkApprovalInstance(d, this.accessToken);
  }

  /**
   * [Dingtalk] 获取审批流程信息 (获取表单 schema)
   * [doc](https://open.dingtalk.com/document/orgapp-server/obtain-the-form-schema)
   */
  async getApprovalProcess(processCode: string) {
    await this.init();
    return getDingtalkApprovalProcess(processCode, this.accessToken);
  }

  /**
   * [Dingtalk] 创建审批流程 (创建或更新审批表单模板)
   * [doc](https://open.dingtalk.com/document/orgapp-server/create-an-approval-form-template)
   */
  async addApprovalProcess(
    d: Parameters<typeof addDingtalkApprovalProcess>[0],
  ) {
    await this.init();
    return addDingtalkApprovalProcess(d, this.accessToken);
  }

  /**
   * [Dingtalk] 创建钉钉待办任务
   * [doc](https://open.dingtalk.com/document/orgapp-server/add-dingtalk-to-do-task)
   */
  async addTodo(d: Parameters<typeof addDingtalkTodo>[0]) {
    await this.init();
    return addDingtalkTodo(d, this.accessToken);
  }

  /**
   * [Dingtalk] 查看用户钉钉待办任务 (查询企业下用户待办列表)
   * [doc](https://open.dingtalk.com/document/orgapp-server/query-the-to-do-list-of-enterprise-users)
   */
  async getTodoList(
    unionID: string,
    opt?: Parameters<typeof getDingtalkTodoList>[2],
  ) {
    await this.init();
    return getDingtalkTodoList(unionID, this.accessToken, opt);
  }

  /**
   * [Dingtalk] 发送工作通知
   * [doc](https://open.dingtalk.com/document/orgapp-server/asynchronous-sending-of-enterprise-session-messages)
   */
  async sendDingtalkCorpMessage(
    d: Parameters<typeof sendDingtalkCorpMessage>[0],
  ) {
    await this.init();
    return sendDingtalkCorpMessage(d, this.accessToken);
  }

  /**
   * [Dingtalk] 发送消息到企业群
   * [doc](https://open.dingtalk.com/document/orgapp-server/send-group-messages)
   */
  async sendDingtalkGroupMessage(
    message: Parameters<typeof sendDingtalkGroupMessage>[0],
    chatID: Parameters<typeof sendDingtalkGroupMessage>[1],
  ) {
    await this.init();
    return sendDingtalkGroupMessage(message, chatID, this.accessToken);
  }
}
