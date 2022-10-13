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
): Promise<{ instanceId: string }> {
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
): Promise<{
  /** 创建人 userId */
  creatorUserId: string;
  /** 表单名称 */
  name: string;
  schemaContent: {
    /** 表单名称 */
    title: string;
    /** 图标代号, 比如 `maintenance` */
    icon: string;
    /** 控件列表 */
    items: FormItem[];
  };
}> {
  const path = '/v1.0/workflow/forms/schemas/processCodes';
  const res = await dingtalkFetch(path, token, {
    query: [['processCode', processCode]],
    method: 'GET',
  });
  res.body.result.schemaContent.items = res.body.result.schemaContent.items.map(
    ({ componentName, ...rest }: { componentName: string }) => {
      return { ...rest, componentType: componentName };
    },
  );
  return res.body.result;
}

/**
 * [Dingtalk] 创建审批流程 (创建或更新审批表单模板)
 * [doc](https://open.dingtalk.com/document/orgapp-server/create-an-approval-form-template)
 *
 * @author Lian Zheren <lzr@go0356.com>
 */
export async function addDingtalkApprovalProcess(d: {
  name: string;
  description: string;
  formComponents: FormItem[];
}, token: string): Promise<{ processCode: string }> {
  const path = `/v1.0/workflow/forms`;
  const res = await dingtalkFetch(path, token, {
    body: d,
  });
  return res.body.result;
}

/** 表单控件 */
interface FormItem {
  /** 控件类型, 详见文档 */
  componentType:
    | 'TextField'
    | 'TextareaField'
    | 'NumberField'
    | 'DDSelectField'
    | 'DDMultiSelectField'
    | 'DDDateField'
    | 'DDDateRangeField'
    | 'TextNote'
    | 'PhoneField'
    | 'DDPhotoField'
    | 'MoneyField'
    | 'TableField'
    | 'DDAttachment'
    | 'InnerContactField'
    | 'DepartmentField'
    | 'RelateField'
    | 'AddressField'
    | 'StarRatingField'
    | 'FormRelateField';
  props: {
    /** 控件名称 (用户设置的名称) */
    label: string;
    /** 控件说明 */
    placeholder: string;
    /** 是否必填 */
    required: boolean;
  };
}

/**
 * [Dingtalk] 根据实例ID获取审批
 * [doc](https://open.dingtalk.com/document/orgapp-server/obtains-the-details-of-a-single-approval-instance-pop)
 *
 * @author Macong <504542565@qq.com>
 */
export async function getDingtalkApprovalByInstanceID(
  InstanceID: string,
  token: string,
) {
  const path = '/v1.0/workflow/processInstances';
  const res = await dingtalkFetch(path, token, {
    query: [['processInstanceId', InstanceID]],
    method: 'GET',
  });
  return res.body.result;
}
