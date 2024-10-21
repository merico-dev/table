import { Tabs } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { DashboardViewRender } from '~/components/view';
import { useRenderContentModelContext } from '~/contexts';
import { TabModelInstance, ViewRenderModelInstance, ViewTabsConfigInstance } from '~/model';

const getTabSX = (t: TabModelInstance): EmotionSx => {
  if (t.color) {
    return { '&[data-active], &[data-active]:hover': { borderColor: t.color ? t.color : '...' } };
  }
  return {};
};

export const RenderViewTabs = observer(({ view }: { view: ViewRenderModelInstance }) => {
  const model = useRenderContentModelContext();
  const config = view.config as ViewTabsConfigInstance;
  return (
    <Tabs
      className="render-view-tabs"
      variant={config.variant}
      orientation={config.orientation}
      value={view.tab}
      onChange={view.setTab}
      styles={{
        root: {
          height: '100%',
          overflow: config.orientation === 'horizontal' ? 'hidden' : 'auto',
        },
        panel: {
          padding: config.orientation === 'horizontal' ? '0px 0px 36px' : '0',
          height: '100%',
          overflow: 'auto',
        },
      }}
      keepMounted={false}
    >
      <Tabs.List grow={config.grow}>
        {config.tabsInOrder.map((t) => (
          <Tabs.Tab key={t.id} value={t.id} sx={getTabSX(t)} disabled={!t.view_id}>
            {t.name ?? t.id}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {config.tabsInOrder.map((t) => {
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
  );
});
