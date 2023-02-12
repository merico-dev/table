import { Box, Sx, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Tabs, ViewConfigModel_Tabs_Tab_Instance } from '~/model/views/view/tabs';

const getTabSX = (t: ViewConfigModel_Tabs_Tab_Instance): Sx => {
  if (t.color) {
    return { '&[data-active], &[data-active]:hover': { borderColor: t.color ? t.color : '...' } };
  }
  return {};
};

export const RenderViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const config = view.config as IViewConfigModel_Tabs;
  return (
    <Box className="render-view-tabs">
      <Tabs
        variant={config.variant}
        orientation={config.orientation}
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={{
          panel: {
            padding: '16px',
          },
        }}
      >
        <Tabs.List grow={config.grow}>
          {config.tabs.map((t) => (
            <Tabs.Tab key={t.id} value={t.id} sx={getTabSX(t)}>
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
