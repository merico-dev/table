import { Select, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { useEditContentModelContext } from '~/contexts';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';
import { getSelectChangeHandler } from '~/utils/mantine';

export interface ISwitchTabOperationConfig {
  viewID: string;
  tab: string;
}

const SwitchTabOperationSettings = observer((props: IOperationConfigProps) => {
  const { t } = useTranslation();
  const model = useEditContentModelContext();
  const { value, set } = useStorageData<ISwitchTabOperationConfig>(props.operation.operationData, 'config');

  const { viewID = '', tab = '' } = value ?? {};
  const setViewID = (viewID: string) => void set({ viewID, tab });
  const setTab = (tab: string) => void set({ viewID, tab });
  return (
    <Stack gap="xs">
      <Select
        defaultValue={viewID}
        value={viewID}
        onChange={getSelectChangeHandler(setViewID)}
        label={t('interactions.operation.switch_tab.view')}
        data={model.views.tabViewOptions}
        comboboxProps={{
          withinPortal: true,
          zIndex: 340,
        }}
        maxDropdownHeight={500}
      />
      <Select
        defaultValue={tab}
        value={tab}
        onChange={getSelectChangeHandler(setTab)}
        label={t('interactions.operation.switch_tab.tab')}
        data={model.views.tabOptions(viewID)}
        comboboxProps={{
          withinPortal: true,
          zIndex: 340,
        }}
        maxDropdownHeight={500}
      />
    </Stack>
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<ISwitchTabOperationConfig>('config');
  const { viewID, tab } = config;
  window.dispatchEvent(new CustomEvent('switch_tab', { detail: { viewID, tab } }));
}

export const SwitchTab: IDashboardOperationSchema = {
  displayName: 'interactions.operation.switch_tab.label',
  id: 'builtin:op:switch_tab',
  configRender: SwitchTabOperationSettings,
  run,
};
