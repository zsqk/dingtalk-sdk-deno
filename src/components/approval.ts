/**
 * [Dingtalk] 发起审批实例
 * https://open.dingtalk.com/document/orgapp-server/create-an-approval-instance
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function addDingtalkApprovalInstance(
  d: {
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
  },
  token: string,
) {
  const path = 'https://api.dingtalk.com/v1.0/workflow/processInstances';
  // 注意, 虽然文档里标注 deptId 为可选, 可是实际执行上, 为必填.
  // 但是 deptId 并不需要额外查找, 因为实测不要求与用户相符, 为 1 即可.
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'x-acs-dingtalk-access-token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deptId: 1, ...d }),
  });
  if (res.status >= 500) {
    throw new Error(`DINGTALK HTTP ${res.status}`);
  }
  const obj = await res.json();
  // TODO: 完善类型
  return obj;
}

/**
 * [Dingtalk] 获取审批流程信息
 * https://open.dingtalk.com/document/orgapp-server/obtain-the-form-schema
 * @param processCode
 * @param token
 * @returns
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkApprovalProcess(
  processCode: string,
  token: string,
) {
  const path =
    'https://api.dingtalk.com/v1.0/workflow/forms/schemas/processCodes';
  const q = new URLSearchParams({ processCode });
  const res = await fetch(`${path}?${q}`, {
    method: 'GET',
    headers: {
      'x-acs-dingtalk-access-token': token,
    },
  });
  if (res.status >= 500) {
    throw new Error(`DINGTALK HTTP ${res.status}`);
  }
  const obj = await res.json();
  // TODO: 完善类型
  return obj.result;
}
