import { Box, Sx, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Tabs, ViewConfigModel_Tabs_Tab_Instance } from '~/model/views/view/tabs';
import { DashboardViewRender } from '~/view';

const getTabSX = (t: ViewConfigModel_Tabs_Tab_Instance): Sx => {
  if (t.color) {
    return { '&[data-active], &[data-active]:hover': { borderColor: t.color ? t.color : '...' } };
  }
  return {};
};

export const RenderViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const model = useModelContext();
  const config = view.config as IViewConfigModel_Tabs;
  return (
    <Box className="render-view-tabs">
      <Tabs
        variant={config.variant}
        orientation={config.orientation}
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={{
          panel: {
            padding: '16px 0px',
          },
        }}
        keepMounted={false}
      >
        <Tabs.List grow={config.grow}>
          {config.tabs.map((t) => (
            <Tabs.Tab key={t.id} value={t.id} sx={getTabSX(t)} disabled={!t.view_id}>
              {t.name ?? t.id}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {config.tabs.map((t) => {
          const tabView = model.views.findByID(t.view_id);
          if (!tabView) {
            return null;
          }
          return (
            <Tabs.Panel key={t.id} value={t.id}>
              <DashboardViewRender view={tabView} />
            </Tabs.Panel>
          );
        })}
      </Tabs>
      {children}
    </Box>
  );
});
