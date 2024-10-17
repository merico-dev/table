import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { useEditContentModelContext } from '~/contexts';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';
import { getSelectChangeHandler } from '~/utils/mantine';

export interface IOpenViewOperationConfig {
  viewID: string;
}

const OpenViewOperationSettings = observer((props: IOperationConfigProps) => {
  const { t } = useTranslation();
  const model = useEditContentModelContext();
  const { value, set } = useStorageData<IOpenViewOperationConfig>(props.operation.operationData, 'config');
  console.log({ value, viewID: value?.viewID });

  const viewID = value?.viewID || '';
  const setViewID = (viewID: string) => void set({ viewID });
  return (
    <Select
      defaultValue={viewID}
      value={viewID}
      onChange={getSelectChangeHandler(setViewID)}
      label={t('interactions.operation.open_view.view')}
      data={model.views.options}
      comboboxProps={{
        withinPortal: true,
        zIndex: 340,
      }}
      maxDropdownHeight={500}
    />
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<IOpenViewOperationConfig>('config');
  const viewID = config.viewID;
  window.dispatchEvent(new CustomEvent('open-view', { detail: { viewID } }));
}

export const OpenView: IDashboardOperationSchema = {
  displayName: 'interactions.operation.open_view.label',
  id: 'builtin:op:open_view',
  configRender: OpenViewOperationSettings,
  run,
};
