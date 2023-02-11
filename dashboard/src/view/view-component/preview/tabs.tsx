import { ActionIcon, Box, Select, Stack, Tabs, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { Plus } from 'tabler-icons-react';
import { useModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Tabs } from '~/model/views/view/tabs';
import { EViewComponentType } from '~/types';

const getStyles = ({ variant, orientation }: IViewConfigModel_Tabs) => {
  const ret: Record<string, any> = {
    tab: {},
    panel: {
      padding: '16px',
    },
  };

  if (variant === 'pills' && orientation === 'horizontal') {
    ret.tab.paddingTop = '1px';
    ret.tab.paddingBottom = '1px';
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
        variant={config.variant}
        orientation={config.orientation}
        defaultValue={config.tabs.length > 0 ? config.tabs[0].id : '0'}
        styles={getStyles(config)}
      >
        <Tabs.List>
          {config.tabs.map((t) => (
            <Tabs.Tab key={t.id} value={t.id}>
              {t.name ?? t.id}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={config.addTab} value="add" className="add-a-tab">
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
