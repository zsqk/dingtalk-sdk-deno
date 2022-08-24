/**
 * [Dingtalk] 创建钉钉待办任务
 * [doc](https://open.dingtalk.com/document/orgapp-server/add-dingtalk-to-do-task)
 *
 * 权限点: `Todo.Todo.Write`
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function addDingtalkTodo(
  {
    unionID,
    subject,
    description,
    dueTime,
    executorUnionIDs,
    participantUnionIDs,
    isOnlyShowExecutor = false,
    priority,
  }: {
    /** 要分配给谁 unionid */
    unionID: string;
    /** 待办标题 */
    subject: string;
    /** 待办描述 */
    description?: string;
    /** 截止时间, UNIX 时间戳 毫秒 */
    dueTime?: number;
    /** 执行者 unionid */
    executorUnionIDs?: string[];
    /** 参与者 unionid */
    participantUnionIDs?: string[];
    /** 生成的待办是否仅展示在执行者的待办列表中, 默认否 */
    isOnlyShowExecutor?: boolean;
    /** 优先级 */
    priority?: 10 | 20 | 30 | 40;
  },
  token: string,
) {
  const path = `https://api.dingtalk.com/v1.0/todo/users/${unionID}/tasks`;
  // 经实测, 文档中描述的 operatorId 参数并无额外作用.
  // 如果 operatorId 与 unionID 不一致, 则无任何效果, 也不报错.
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'x-acs-dingtalk-access-token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject,
      description,
      dueTime,
      executorIds: executorUnionIDs,
      participantIds: participantUnionIDs,
      isOnlyShowExecutor,
      priority,
    }),
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
