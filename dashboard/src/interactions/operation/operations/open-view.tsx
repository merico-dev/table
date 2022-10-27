import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { LayoutStateContext, useModelContext } from '~/contexts';
import { useStorageData } from '~/plugins';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

export interface IOpenViewOperationConfig {
  viewID: string;
}

const OpenViewOperationSettings = observer((props: IOperationConfigProps) => {
  const model = useModelContext();
  const { value, set } = useStorageData<IOpenViewOperationConfig>(props.operation.operationData, 'config');
  console.log({ value, viewID: value?.viewID });

  const viewID = value?.viewID || '';
  const setViewID = (viewID: string) => void set({ viewID });
  return <Select defaultValue={viewID} value={viewID} onChange={setViewID} label="View" data={model.views.options} />;
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const model = useModelContext();
  const { inEditMode } = useContext(LayoutStateContext);
  const config = await operation.operationData.getItem<IOpenViewOperationConfig>('config');
  const viewID = config.viewID;
  if (viewID) {
    console.log('appendToVisibles');
    model.views.appendToVisibles(viewID);
    if (inEditMode) {
      console.log('setIDOfVIE');
      model.views.setIDOfVIE(viewID);
    }
  } else {
    console.error(new Error('[Open View] Needs to pick a view first'));
  }
}

export const OpenView: IDashboardOperationSchema = {
  displayName: 'Open View',
  id: 'builtin:op:open_view',
  configRender: OpenViewOperationSettings,
  run,
};
