import { dingtalkFetch } from '../common/dingtalk-fetch.ts';

/**
 * [Dingtalk] 发起审批实例
 * [doc](https://open.dingtalk.com/document/orgapp-server/create-an-approval-instance)
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function addDingtalkApprovalInstance(
  d: {
    originatorUserId: string;
    processCode: string;
    formComponentValues: Array<{
      id?: string;
      name: string;
      value: string;
    }>;
    deptId?: number;
    microappAgentId?: string;
    targetSelectActioners?: [];
  },
  token: string,
) {
  const path = '/v1.0/workflow/processInstances';
  // 注意, 虽然文档里标注 deptId 为可选, 可是实际执行上, 为必填.
  // 但是 deptId 并不需要额外查找, 因为实测不要求与用户相符, 为 1 即可.
  const res = await dingtalkFetch(path, token, {
    body: { deptId: 1, ...d },
  });
  // TODO: 完善类型
  return res.body;
}

/**
 * [Dingtalk] 获取审批流程信息
 * [doc](https://open.dingtalk.com/document/orgapp-server/obtain-the-form-schema)
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function getDingtalkApprovalProcess(
  processCode: string,
  token: string,
) {
  const path = '/v1.0/workflow/forms/schemas/processCodes';
  const res = await dingtalkFetch(path, token, {
    query: [['processCode', processCode]],
  });
  // TODO: 完善类型
  return res.body.result;
}
