import { getDingtalkAccessToken } from './components/accesstoken.ts';
import {
  addDingtalkApprovalInstance,
  getDingtalkApprovalProcess,
} from './components/approval.ts';
import { getDingtalkUserBaseByCode } from './components/user-login.ts';
import { getDingtalkUserByUserID } from './components/user.ts';

export class DingtalkSDK {
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
    { appkey, appsecret, getToken, setToken }: {
      appkey: string;
      appsecret: string;
      getToken?: () => Promise<{ accessToken: string; tokenExpireAt: number }>;
      setToken?: (accessToken: string, tokenExpireAt: number) => Promise<void>;
    },
  ) {
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
  async init(opt: { token?: string; tokenExpireAt?: number } = {}) {
    if (opt.token) {
      this.accessToken = opt.token;
      if (opt.tokenExpireAt) {
        this.tokenExpireAt = opt.tokenExpireAt;
      } else {
        this.tokenExpireAt = Date.now() - 60000;
      }
      return;
    }

    // 不过期则直接使用
    if (this.tokenExpireAt > Date.now()) {
      return;
    }

    // 从缓存中获取
    if (this.getToken) {
      const res = await this.getToken();
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
}
