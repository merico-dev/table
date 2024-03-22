import { Box, Button, ColorInput, NumberInput, Overlay, Select, Stack, Sx, Tabs, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconArrowsLeftRight, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';
import { DashboardViewRender } from '~/components/view';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType, TabModelInstance, ViewRenderModelInstance, ViewTabsConfigInstance } from '~/model';

const getStyles = ({ variant, orientation }: ViewTabsConfigInstance) => {
  const ret: Record<string, any> = {
    root: {
      height: '100%',
      overflow: 'hidden',
    },
    tabsList: {
      backgroundColor: 'white',
    },
    tab: {},
    panel: {
      padding: '16px',
    },
  };

  if (variant === 'pills' && orientation === 'horizontal') {
    ret.tab.paddingTop = '6px';
    ret.tab.paddingBottom = '6px';
  }
  if (orientation === 'vertical') {
    ret.tab['&.add-a-tab'] = {
      paddingTop: '1px',
      paddingBottom: '1px',
    };
    ret.tab['&.add-a-tab .mantine-Tabs-tabLabel'] = {
      marginLeft: 'auto',
      marginRight: 'auto',
    };
  }
  return ret;
};

const getTabSX = (t: TabModelInstance): Sx => {
  if (t.color) {
    return { '&[data-active], &[data-active]:hover': { borderColor: t.color ? t.color : '...' } };
  }
  return {};
};

export const PreviewViewTabs = observer(({ view }: { view: ViewRenderModelInstance }) => {
  const { t } = useTranslation();
  const modals = useModals();
  const model = useEditContentModelContext();
  const options = useMemo(
    () => model.views.options.filter((o) => o.type === EViewComponentType.Division),
    [view.id, model.views.options],
  );

  const config = view.config as ViewTabsConfigInstance;

  const remove = (index: number) =>
    modals.openConfirmModal({
      title: `${t('view.component.tabs.tab.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        config.removeTab(index);
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });

  const onlyOneTabLeft = config.tabs.length === 0;
  return (
    <Tabs
      className="preview-view-tabs"
      variant={config.variant}
      orientation={config.orientation}
      value={view.tab}
      onTabChange={view.setTab}
      styles={getStyles(config)}
    >
      <Tabs.List grow={config.grow}>
        {config.tabsInOrder.map((t) => (
          <Tabs.Tab key={t.id} value={t.id} sx={getTabSX(t)}>
            {t.name ?? t.id}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={config.addTab} value="add" className="add-a-tab">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {config.tabsInOrder.map((tab, i) => {
        const tabView = model.views.findByID(tab.view_id);
        return (
          <Tabs.Panel key={tab.id} value={tab.id} sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 }}>
              <Overlay opacity={0.8} color="#FFF" blur={10} zIndex={100} />

              <Stack mx="auto" mt={100} sx={{ width: '300px', position: 'relative', zIndex: 200 }}>
                <TextInput
                  label={t('view.component.tabs.tab.name')}
                  required
                  value={tab.name}
                  onChange={(e) => tab.setName(e.currentTarget.value)}
                />
                <Select label="View" value={tab.view_id} onChange={tab.setViewID} data={options} />
                <NumberInput
                  label={t('view.component.tabs.tab.order')}
                  required
                  value={tab.order}
                  onChange={(v) => tab.setOrder(v ? v : 0)}
                  min={0}
                  max={1000}
                  step={1}
                />
                <ColorInput
                  label={t('view.component.tabs.tab.color')}
                  value={tab.color}
                  onChange={tab.setColor}
                  disabled={config.variant !== 'default'}
                />

                {tabView && (
                  <Button
                    mt={20}
                    variant="gradient"
                    leftIcon={<IconArrowsLeftRight size={18} />}
                    gradient={{ from: 'cyan', to: 'indigo' }}
                    onClick={() => model.views.setIDOfVIE(tabView.id)}
                  >
                    {t('view.component.tabs.tab.switch_to_view', { name: tabView.name })}
                  </Button>
                )}

                <Button
                  mt={20}
                  variant="subtle"
                  color="red"
                  onClick={() => remove(i)}
                  disabled={onlyOneTabLeft}
                  leftIcon={<IconTrash size={14} />}
                >
                  {t('view.component.tabs.tab.delete')}
                </Button>
              </Stack>
            </Box>

            {tabView && <DashboardViewRender view={tabView} />}
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
});
