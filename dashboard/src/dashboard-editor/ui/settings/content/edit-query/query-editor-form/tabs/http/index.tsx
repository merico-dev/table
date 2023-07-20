import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { InlineFunctionInput } from '~/components/widgets/inline-function-input';
import { QueryVariablesModal } from '~/dashboard-editor/ui/settings/content/view-query-vars/query-variables-modal';
import { QueryModelInstance } from '~/dashboard-editor/model';

export const DEFAULT_HTTP_REQ_PROCESSING = {
  pre: [
    'function build_request({ context, filters }, utils) {',
    '    // build the quest',
    "    return { method: 'POST', url: '/', params: {}, headers: {}, data: {} }",
    '}',
  ].join('\n'),
  post: ['function process_result(res, utils) {', '    // your code goes here', '    return data', '}'].join('\n'),
};

export const TabPanel_HTTP = observer(({ queryModel }: { queryModel: QueryModelInstance }) => {
  if (!queryModel.typedAsHTTP) {
    return null;
  }
  return (
    <Tabs defaultValue="pre_process" orientation="vertical" sx={{ flexGrow: 1 }}>
      <Tabs.List>
        <Tabs.Tab value="pre_process">Build Request</Tabs.Tab>
        <Tabs.Tab value="post_process">Process Result</Tabs.Tab>
        <QueryVariablesModal />
      </Tabs.List>
      <Tabs.Panel value="pre_process" sx={{ position: 'relative' }} p="sm">
        <InlineFunctionInput
          label=""
          value={queryModel.pre_process}
          onChange={queryModel.setPreProcess}
          defaultValue={DEFAULT_HTTP_REQ_PROCESSING.pre}
        />
      </Tabs.Panel>
      <Tabs.Panel value="post_process" p="sm">
        <InlineFunctionInput
          label=""
          value={queryModel.post_process}
          onChange={queryModel.setPostProcess}
          defaultValue={DEFAULT_HTTP_REQ_PROCESSING.post}
        />
      </Tabs.Panel>
    </Tabs>
  );
});
