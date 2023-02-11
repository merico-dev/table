import { Box, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Tabs } from '~/model/views/view/tabs';

export const RenderViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const config = view.config as IViewConfigModel_Tabs;
  return (
    <Box className="render-view-tabs">
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
        </Tabs.List>
        {config.tabs.map((t) => (
          <Tabs.Panel key={t.id} value={t.id}>
            {t.view_id}
          </Tabs.Panel>
        ))}
      </Tabs>
      {children}
    </Box>
  );
});
