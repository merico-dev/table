import { Stack, Tabs, Text, Tooltip } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryModelInstance } from '../../model/queries';
import { QueryConfigurations } from './configurations';
import { DataPreview } from './data-preview';
import { TabPanel_HTTP } from './tabs/http';

import { TabPanel_SQL } from './tabs/sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}

export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
  const { width } = useViewportSize();
  const tabsOrientation = width >= 1440 ? 'vertical' : 'horizontal';
  const tabsStyles = width >= 1440 ? { tabLabel: { width: '100%' } } : {};
  const tabsPadding = width >= 1440 ? 'sm' : 0;

  const defaultTab = useMemo(() => {
    if (!queryModel.datasource) {
      return 'Configurations';
    }
    return queryModel.typedAsHTTP ? 'HTTP' : 'SQL';
  }, [queryModel.datasource, queryModel.typedAsHTTP]);

  return (
    <Stack sx={{ flexGrow: 1 }} my={0} p={0}>
      <Tabs defaultValue={defaultTab} orientation={tabsOrientation} styles={tabsStyles}>
        <Tabs.List grow={tabsOrientation === 'horizontal'}>
          <Tabs.Tab value="Configurations">Configurations</Tabs.Tab>
          {queryModel.typedAsSQL && <Tabs.Tab value="SQL">SQL</Tabs.Tab>}
          {queryModel.typedAsHTTP && <Tabs.Tab value="HTTP">Request</Tabs.Tab>}
          <Tabs.Tab value="Data" disabled={!queryModel.datasource}>
            <Tooltip label={'Need to pick a Data Source first'} disabled={queryModel.datasource} withinPortal>
              <Text>Data</Text>
            </Tooltip>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Configurations" pt={0} p={tabsPadding}>
          <QueryConfigurations queryModel={queryModel} />
        </Tabs.Panel>

        {queryModel.typedAsSQL && (
          <Tabs.Panel value="SQL" pt={0} p={tabsPadding}>
            <TabPanel_SQL queryModel={queryModel} />
          </Tabs.Panel>
        )}
        {queryModel.typedAsHTTP && (
          <Tabs.Panel value="HTTP" pt={0} p={tabsPadding}>
            <TabPanel_HTTP queryModel={queryModel} />
          </Tabs.Panel>
        )}

        <Tabs.Panel value="Data" pt={0} p={tabsPadding}>
          <DataPreview id={queryModel.id} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
