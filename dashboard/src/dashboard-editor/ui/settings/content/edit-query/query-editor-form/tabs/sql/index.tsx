import { Group, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { InlineFunctionInput } from '~/components/widgets/inline-function-input';
import { QueryVariablesModal } from '~/dashboard-editor/ui/settings/content/view-query-vars/query-variables-modal';
import { QueryRenderModelInstance } from '~/model';
import { DBExplorerModal } from '../../../../db-explorer-modal';
import { EditSQL } from './edit-sql';
import { PreviewSQL } from './preview-sql';

export const DEFAULT_SQL_REQ_PROCESSING = {
  pre: [
    'function process_request({ context, filters, sql }, utils) {',
    '    // modify and return sql',
    '    return sql',
    '}',
  ].join('\n'),
  post: [
    'function process_result(data, utils) {',
    '    // process data and return the result',
    '    return data',
    '}',
  ].join('\n'),
};

export const TabPanel_SQL = observer(({ queryModel }: { queryModel: QueryRenderModelInstance }) => {
  if (!queryModel.typedAsSQL) {
    return null;
  }
  return (
    <Tabs
      defaultValue="Edit"
      orientation="vertical"
      sx={{ flexGrow: 1 }}
      styles={{ tabLabel: { width: '100%', height: '28px', lineHeight: '28px' } }}
      keepMounted={false}
    >
      <Tabs.List>
        <Tabs.Tab value="Edit">
          <Group spacing={14} position="apart">
            Edit SQL
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="Preview">Preview SQL</Tabs.Tab>
        <Tabs.Tab value="pre_process">Process Request</Tabs.Tab>
        <Tabs.Tab value="post_process">Process Result</Tabs.Tab>
        <QueryVariablesModal />
        {queryModel.datasource && <DBExplorerModal dataSource={queryModel.datasource} />}
      </Tabs.List>
      <Tabs.Panel value="Edit" sx={{ position: 'relative' }} p="sm">
        <EditSQL value={queryModel.sql} onChange={queryModel.setSQL} defaultValue="SELECT 1" />
      </Tabs.Panel>
      <Tabs.Panel value="Preview" p={0} pl={4}>
        <PreviewSQL value={queryModel.sql} />
      </Tabs.Panel>
      <Tabs.Panel value="pre_process" sx={{ position: 'relative' }} p="sm">
        <InlineFunctionInput
          label=""
          value={queryModel.pre_process}
          onChange={queryModel.setPreProcess}
          defaultValue={DEFAULT_SQL_REQ_PROCESSING.pre}
        />
      </Tabs.Panel>
      <Tabs.Panel value="post_process" p="sm">
        <InlineFunctionInput
          label=""
          value={queryModel.post_process}
          onChange={queryModel.setPostProcess}
          defaultValue={DEFAULT_SQL_REQ_PROCESSING.post}
        />
      </Tabs.Panel>
    </Tabs>
  );
});
