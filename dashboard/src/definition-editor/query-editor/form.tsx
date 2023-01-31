import { Stack, Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '../../model/queries';
import { QueryConfigurations } from './configurations';
import { DataPreview } from './data-preview';

import { TabPanel_SQL } from './tabs/sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}

export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
  const { width } = useViewportSize();
  const tabsOrientation = width >= 1440 ? 'vertical' : 'horizontal';
  const tabsStyles = width >= 1440 ? { tabLabel: { width: '100%' } } : {};
  const tabsPadding = width >= 1440 ? 'sm' : 0;

  return (
    <Stack sx={{ flexGrow: 1 }} my={0} p={0}>
      <Tabs defaultValue="SQL" orientation={tabsOrientation} styles={tabsStyles}>
        <Tabs.List grow={tabsOrientation === 'horizontal'}>
          <Tabs.Tab value="Configurations">Configurations</Tabs.Tab>
          {queryModel.typedAsSQL && <Tabs.Tab value="SQL">SQL</Tabs.Tab>}
          <Tabs.Tab value="Data">Data</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Configurations" p={tabsPadding}>
          <QueryConfigurations queryModel={queryModel} />
        </Tabs.Panel>

        {queryModel.typedAsSQL && (
          <Tabs.Panel value="SQL" p={tabsPadding}>
            <TabPanel_SQL queryModel={queryModel} />
          </Tabs.Panel>
        )}

        <Tabs.Panel value="Data" p={tabsPadding}>
          <DataPreview id={queryModel.id} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
