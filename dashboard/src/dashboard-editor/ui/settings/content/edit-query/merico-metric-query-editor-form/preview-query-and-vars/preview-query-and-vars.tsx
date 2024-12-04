import { CodeHighlight } from '@mantine/code-highlight';
import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const PreviewQueryAndVars = observer(({ queryModel }: Props) => {
  const model = useEditDashboardContext();

  return (
    <Tabs
      defaultValue="查询预览"
      styles={{
        root: {
          borderRadius: 4,
          backgroundColor: '#F9F9FA',
          height: '100%',
          minHeight: '350px',
          maxHeight: '50vh',
          overflow: 'hidden',
        },
      }}
      color="red"
    >
      <Tabs.List>
        <Tabs.Tab value="查询预览">查询预览</Tabs.Tab>
        <Tabs.Tab value="看板变量预览">看板变量预览</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="查询预览">
        <CodeHighlight
          language="json"
          sx={{ width: '100%', height: '100%', minHeight: '400px', overflowY: 'auto' }}
          withCopyButton={false}
          code={queryModel.metricQueryPayloadString}
        />
      </Tabs.Panel>

      <Tabs.Panel value="看板变量预览">
        <CodeHighlight
          language="json"
          sx={{ width: '100%', height: '100%', minHeight: '400px', overflowY: 'auto' }}
          withCopyButton={false}
          code={model.queryVariablesString}
        />
      </Tabs.Panel>
    </Tabs>
  );
});
