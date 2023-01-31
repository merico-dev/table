import { Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/model';

export const TabPanel_HTTP = observer(({ queryModel }: { queryModel: QueryModelInstance }) => {
  // UI stuff
  const { width } = useViewportSize();
  const subTabsOrientation = width >= 1440 ? 'horizontal' : 'vertical';

  if (!queryModel.typedAsHTTP) {
    return null;
  }
  return (
    <Tabs defaultValue="Edit" orientation={subTabsOrientation}>
      <Tabs.List>
        <Tabs.Tab value="pre_process">Build Request</Tabs.Tab>
        <Tabs.Tab value="pre_process">Preview Request</Tabs.Tab>
        <Tabs.Tab value="post_process">Process Result</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="pre_process" sx={{ position: 'relative' }} p="sm">
        TODO
      </Tabs.Panel>
      <Tabs.Panel value="preview pre_process" sx={{ position: 'relative' }} p="sm">
        TODO
      </Tabs.Panel>
      <Tabs.Panel value="post_process" p="sm">
        TODO
      </Tabs.Panel>
    </Tabs>
  );
});
