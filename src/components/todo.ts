/**
 * [Dingtalk] 创建钉钉待办任务
 * [doc](https://open.dingtalk.com/document/orgapp-server/add-dingtalk-to-do-task)
 *
 * 权限点: `Todo.Todo.Write`
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function addTask({ unionID, operatorID }: {
  /** 要分配给谁 unionid */
  unionID: string;
  /** 谁分配的 unionid */
  operatorID?: string;
  /** 待办标题 */
  subject: string;
  /** 待办描述 */
  description?: string;
  /** 截止时间, UNIX 时间戳 毫秒 */
  dueTime?: number;
  /** 执行者 unionid */
  executorIds?: string[];
  /** 参与者 unionid */
  participantIds?: string[];
  /** 生成的待办是否仅展示在执行者的待办列表中 */
  isOnlyShowExecutor?: boolean;
  /** 优先级 */
  priority?: 10 | 20 | 30 | 40;
}, token: string) {
  const path = `https://api.dingtalk.com/v1.0/todo/users/${unionID}/tasks`;
  const url = new URL(path);
  operatorID && url.searchParams.set('operatorId', operatorID);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-acs-dingtalk-access-token': token,
      'Content-Type': 'application/json',
    },
  });
  if (res.status >= 500) {
    throw new Error(`DINGTALK HTTP ${res.status}`);
  }
  // TODO: 返回类型
  return {
    status: res.status,
    body: await res.json(),
  };
}
