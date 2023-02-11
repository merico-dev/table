import { ActionIcon, Box, Select, Stack, Tabs, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { Plus } from 'tabler-icons-react';
import { useModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Tabs } from '~/model/views/view/tabs';
import { EViewComponentType } from '~/types';

export const PreviewViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const model = useModelContext();
  const options = useMemo(
    () => model.views.options.filter((o) => o.type === EViewComponentType.Division),
    [view.id, model.views.options],
  );

  const config = view.config as IViewConfigModel_Tabs;
  return (
    <Box className="preview-view-tabs">
      <Tabs
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={{
          // tab: {
          //   paddingTop: '0px',
          //   paddingBottom: '0px',
          // },
          panel: {
            padding: '16px',
          },
        }}
      >
        <Tabs.List>
          {config.tabs.map((t) => (
            <Tabs.Tab key={t.id} value={t.id}>
              {t.name ?? t.id}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={config.addTab} value="add">
            <ActionIcon>
              <Plus size={18} color="#228be6" />
            </ActionIcon>
          </Tabs.Tab>
        </Tabs.List>
        {config.tabs.map((t) => (
          <Tabs.Panel key={t.id} value={t.id}>
            <Stack sx={{ width: '300px' }}>
              <TextInput label="Tab Name" value={t.name} onChange={(e) => t.setName(e.currentTarget.value)} />
              <Select label="View" value={t.view_id} onChange={t.setViewID} data={options} />
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
      {children}
    </Box>
  );
});
