import { MultiSelect, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useStorageData } from '~/components/plugins';
import { useEditContentModelContext } from '~/contexts';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

export interface IClearFilterValuesOperationConfig {
  filter_keys: string[];
}

const defaultValue: IClearFilterValuesOperationConfig = { filter_keys: [] };

const ClearFilterValuesOperationSettings = observer((props: IOperationConfigProps) => {
  const model = useEditContentModelContext();
  const { value = defaultValue, set } = useStorageData<IClearFilterValuesOperationConfig>(
    props.operation.operationData,
    'config',
  );

  const { filter_keys = [] } = value;
  const setFilterKeys = (v: string[]) => {
    set({
      filter_keys: [...v],
    });
  };

  const filterKeyOptions = useMemo(() => {
    return model.filters.current.map((f) => ({
      label: f.label,
      value: f.key,
    }));
  }, [model.filters.values]);

  return (
    <Stack spacing={10}>
      <MultiSelect
        label="Select Filters to Clear"
        data={filterKeyOptions}
        value={filter_keys}
        onChange={setFilterKeys}
      />
    </Stack>
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<IClearFilterValuesOperationConfig>('config');
  const filter_keys = config.filter_keys;
  window.dispatchEvent(new CustomEvent('clear-filter-values', { detail: { filter_keys, payload } }));
}

export const ClearFilterValues: IDashboardOperationSchema = {
  displayName: 'Clear Filter Values',
  id: 'builtin:op:clear_filter_values',
  configRender: ClearFilterValuesOperationSettings,
  run,
};
