import { Box, Sx, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { DashboardViewRender } from '~/components/view';
import { useRenderContentModelContext } from '~/contexts';
import { TabModelInstance, ViewMetaInstance, ViewTabsConfigInstance } from '~/model';

const getTabSX = (t: TabModelInstance): Sx => {
  if (t.color) {
    return { '&[data-active], &[data-active]:hover': { borderColor: t.color ? t.color : '...' } };
  }
  return {};
};

export const RenderViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewMetaInstance }) => {
  const model = useRenderContentModelContext();
  const config = view.config as ViewTabsConfigInstance;
  return (
    <Box className="render-view-tabs">
      <Tabs
        variant={config.variant}
        orientation={config.orientation}
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={{
          panel: {
            padding: config.orientation === 'horizontal' ? '16px 0px' : '0',
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
