import { Box, Button, ColorInput, Overlay, Select, Stack, Sx, Tabs, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconArrowsLeftRight, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { Plus } from 'tabler-icons-react';
import { DashboardViewRender } from '~/components/view';
import { useContentModelContext } from '~/contexts';
import { EViewComponentType, TabModelInstance, ViewMetaInstance, ViewTabsConfigInstance } from '~/model';

const getStyles = ({ variant, orientation }: ViewTabsConfigInstance) => {
  const ret: Record<string, any> = {
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

export const PreviewViewTabs = observer(({ children, view }: { children: ReactNode; view: ViewMetaInstance }) => {
  const modals = useModals();
  const model = useContentModelContext();
  const options = useMemo(
    () => model.views.options.filter((o) => o.type === EViewComponentType.Division),
    [view.id, model.views.options],
  );

  const config = view.config as ViewTabsConfigInstance;

  const remove = (index: number) =>
    modals.openConfirmModal({
      title: 'Delete this tab?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        config.removeTab(index);
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });

  const onlyOneTabLeft = config.tabs.length === 0;
  return (
    <Box className="preview-view-tabs">
      <Tabs
        variant={config.variant}
        orientation={config.orientation}
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={getStyles(config)}
      >
        <Tabs.List grow={config.grow}>
          {config.tabs.map((t) => (
            <Tabs.Tab key={t.id} value={t.id} sx={getTabSX(t)}>
              {t.name ?? t.id}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={config.addTab} value="add" className="add-a-tab">
            <Plus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {config.tabs.map((t, i) => {
          const tabView = model.views.findByID(t.view_id);
          return (
            <Tabs.Panel key={t.id} value={t.id} sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 }}>
                <Overlay opacity={0.8} color="#FFF" blur={10} zIndex={100} />

                <Stack mx="auto" mt={100} sx={{ width: '300px', position: 'relative', zIndex: 200 }}>
                  <TextInput label="Tab Name" value={t.name} onChange={(e) => t.setName(e.currentTarget.value)} />
                  <Select label="View" value={t.view_id} onChange={t.setViewID} data={options} />
                  <ColorInput
                    label="Color"
                    value={t.color}
                    onChange={t.setColor}
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
                      Swith to View: {tabView.name}
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
                    Delete This Tab
                  </Button>
                </Stack>
              </Box>

              {tabView && <DashboardViewRender view={tabView} />}
            </Tabs.Panel>
          );
        })}
      </Tabs>
      {children}
    </Box>
  );
});
