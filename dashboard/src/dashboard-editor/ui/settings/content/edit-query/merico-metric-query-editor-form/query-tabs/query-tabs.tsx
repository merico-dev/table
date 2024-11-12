import { Button, Group, Tabs } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { EditMetricQuery } from './edit-metric-query/edit-metric-query';

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
  return (
    <Tabs color="red" defaultValue="编辑查询" styles={TabsStyles}>
      <Group>
        <Tabs.List>
          <Tabs.Tab value="编辑查询" size="xs">
            编辑查询
          </Tabs.Tab>
          <Tabs.Tab value="加工请求" size="xs">
            加工请求
          </Tabs.Tab>
          <Tabs.Tab value="加工结果" size="xs">
            加工结果
          </Tabs.Tab>
          <Tabs.Tab value="设置" size="xs">
            设置
          </Tabs.Tab>
        </Tabs.List>
        <Button
          variant="subtle"
          ml="auto"
          size="xs"
          leftSection={<IconEye size={14} />}
          styles={{
            section: {
              marginInlineEnd: 4,
            },
          }}
        >
          预览查询
        </Button>
      </Group>

      <Tabs.Panel value="编辑查询" pt="xs">
        <EditMetricQuery queryModel={queryModel} />
      </Tabs.Panel>

      <Tabs.Panel value="加工请求" pt="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="加工结果" pt="xs">
        Settings tab content
      </Tabs.Panel>
      <Tabs.Panel value="设置" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
});
