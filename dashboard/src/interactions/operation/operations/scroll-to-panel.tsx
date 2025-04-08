import { Group, Select, Text, SelectProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStorageData, vizNameToKeys } from '~/components/plugins';
import { useEditContentModelContext } from '~/contexts';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';
import { getSelectChangeHandler } from '~/utils/mantine';

export interface IScrollToPanelOperationConfig {
  panelID: string;
}

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
  const { t } = useTranslation();
  const o = option as any;
  return (
    <Group justify="space-between" flex="1" gap="xs">
      <Text size="xs">{o.label}</Text>
      <Text size="xs">{t(vizNameToKeys[o.viz_type]?.displayName) ?? o.viz_type}</Text>
    </Group>
  );
};

const ScrollToPanelOperationSettings = observer((props: IOperationConfigProps) => {
  const { t } = useTranslation();
  const model = useEditContentModelContext();
  const { value, set } = useStorageData<IScrollToPanelOperationConfig>(props.operation.operationData, 'config');

  const panelID = value?.panelID || '';
  const setViewID = (panelID: string) => void set({ panelID });
  return (
    <Select
      defaultValue={panelID}
      value={panelID}
      onChange={getSelectChangeHandler(setViewID)}
      label={t('interactions.operation.scroll_to_panel.panel')}
      data={model.panels.options}
      comboboxProps={{
        withinPortal: true,
        zIndex: 340,
      }}
      maxDropdownHeight={500}
      renderOption={renderSelectOption}
    />
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<IScrollToPanelOperationConfig>('config');
  const panelID = config.panelID;
  window.dispatchEvent(new CustomEvent('scroll_to_panel', { detail: { panelID } }));
}

export const ScrollToPanel: IDashboardOperationSchema = {
  displayName: 'interactions.operation.scroll_to_panel.label',
  id: 'builtin:op:scroll_to_panel',
  configRender: ScrollToPanelOperationSettings,
  run,
};
