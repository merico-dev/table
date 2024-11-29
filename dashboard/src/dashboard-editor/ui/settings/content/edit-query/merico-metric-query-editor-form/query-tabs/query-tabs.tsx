import { Button, Group, Tabs } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { EditMetricQuery } from './edit-metric-query/edit-metric-query';
import { QueryUsage } from '../../query-editor-form/query-usage';
import { InlineFunctionInput } from '~/components/widgets';
import { PreviewMetricQuery } from './preview-metric-query';
import { useState } from 'react';

const DEFAULT_MMQ_REQ_POST_PROCESSING = [
  'function process_result(resp, utils, state) {',
  '    return resp.data',
  '}',
].join('\n');

const TabsStyles = {
  root: {
    minHeight: '350px',
    maxHeight: '50vh',
    height: '100%',
    overflow: 'hidden',
  },
  list: {
    '&::before': {
      borderColor: 'transparent',
    },
  },
  panel: {
    height: 'calc(100% - 36px)',
    overflowY: 'auto',
  },
} as const;

type Props = {
  queryModel: QueryModelInstance;
};
export const QueryTabs = observer(({ queryModel }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('编辑查询');

  return (
    <Tabs color="red" defaultValue="编辑查询" styles={TabsStyles} value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="编辑查询" size="xs">
          编辑查询
        </Tabs.Tab>
        <Tabs.Tab value="加工结果" size="xs">
          加工结果
        </Tabs.Tab>
        <Tabs.Tab value="使用情况" size="xs">
          使用情况
        </Tabs.Tab>
        <Tabs.Tab value="预览查询" size="xs" leftSection={<IconEye size={14} />} ml="auto">
          预览查询
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="编辑查询" pt="xs">
        <EditMetricQuery queryModel={queryModel} />
      </Tabs.Panel>

      <Tabs.Panel value="加工结果" pt="xs">
        <InlineFunctionInput
          label=""
          value={queryModel.post_process}
          onChange={queryModel.setPostProcess}
          defaultValue={DEFAULT_MMQ_REQ_POST_PROCESSING}
        />
      </Tabs.Panel>
      <Tabs.Panel value="使用情况" pt="xs">
        <QueryUsage queryModel={queryModel} />
      </Tabs.Panel>
      <Tabs.Panel value="预览查询" pt="xs">
        <PreviewMetricQuery queryModel={queryModel} />
      </Tabs.Panel>
    </Tabs>
  );
});
