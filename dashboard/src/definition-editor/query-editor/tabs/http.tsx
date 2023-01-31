import { Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { InlineFunctionInput } from '~/components/inline-function-input';
import { QueryModelInstance } from '~/model';

export const DEFAULT_HTTP_REQ_PROCESSING = {
  pre: [
    'function build_request({ context, filters }, utils) {',
    '    // build the quest',
    '    return { method, url, params, headers, data }',
    '}',
  ].join('\n'),
  post: ['function process_result(res, utils) {', '    // your code goes here', '    return data', '}'].join('\n'),
};

export const TabPanel_HTTP = observer(({ queryModel }: { queryModel: QueryModelInstance }) => {
  // UI stuff
  const { width } = useViewportSize();
  const subTabsOrientation = width >= 1440 ? 'horizontal' : 'vertical';

  if (!queryModel.typedAsHTTP) {
    return null;
  }
  return (
    <Tabs defaultValue="pre_process" orientation={subTabsOrientation}>
      <Tabs.List>
        <Tabs.Tab value="pre_process">Build Request</Tabs.Tab>
        <Tabs.Tab value="preview pre_process">Preview Request</Tabs.Tab>
        <Tabs.Tab value="post_process">Process Result</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="pre_process" sx={{ position: 'relative' }} p="sm">
        <InlineFunctionInput
          label=""
          value={queryModel.pre_process}
          onChange={queryModel.setPreProcess}
          defaultValue={DEFAULT_HTTP_REQ_PROCESSING.pre}
        />
      </Tabs.Panel>
      <Tabs.Panel value="preview pre_process" sx={{ position: 'relative' }} p="sm">
        TODO
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
