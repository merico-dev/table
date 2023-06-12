import { ActionIcon, Sx, Table, TextInput } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useContentModelContext } from '~/contexts';
import { useStorageData } from '~/plugins';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

const TableSx: Sx = {
  'tbody tr': {
    opacity: 0.5,
    transition: 'opacity 200ms ease',
  },
  'tr[data-affected=true]': {
    opacity: 1,
  },
};
const PayloadKeyInput = ({ value = '', onChange }: { value?: string; onChange: (k: string) => void }) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);
  const submit = () => {
    onChange(v);
  };

  return (
    <TextInput
      size="xs"
      label=""
      value={v}
      onChange={(e) => setV(e.currentTarget.value)}
      sx={{ flexGrow: 1 }}
      rightSection={
        <ActionIcon color="green" size="xs" onClick={submit} disabled={v === value}>
          <IconDeviceFloppy />
        </ActionIcon>
      }
    />
  );
};

export interface ISetFilterValuesOperationConfig {
  dictionary: Record<string, string>;
}

const defaultValue: ISetFilterValuesOperationConfig = { dictionary: {} };

const SetFilterValuesOperationSettings = observer((props: IOperationConfigProps) => {
  const model = useContentModelContext();
  const { value = defaultValue, set } = useStorageData<ISetFilterValuesOperationConfig>(
    props.operation.operationData,
    'config',
  );

  const { dictionary = {} } = value;
  console.log({ value: { ...value }, dictionary: { ...dictionary }, filters: [...model.filters.keyLabelOptions] });

  const handleChange = (filterKey: string, payloadKey: string) => {
    if (payloadKey === '') {
      const newDict = {
        ...dictionary,
      };
      delete newDict[filterKey];
      set({
        dictionary: newDict,
      });
      return;
    }

    set({
      dictionary: {
        ...dictionary,
        [filterKey]: payloadKey,
      },
    });
  };

  return (
    <Table sx={TableSx}>
      <thead>
        <tr>
          <th>Set filter</th>
          <th>with</th>
        </tr>
      </thead>
      <tbody>
        {[...model.filters.keyLabelOptions].map((o) => {
          const affected = o.value in dictionary;
          return (
            <tr key={o.value} data-affected={affected}>
              <td>{o.label}</td>
              <td>
                {/* <NativeSelect
                  size="xs"
                  data={payloadOptions}
                  label=""
                  value={dictionary[o.value] ?? '$undefined'}
                  onChange={(e) => handleChange(o.value, e.currentTarget.value)}
                /> */}
                <PayloadKeyInput
                  value={dictionary[o.value]}
                  onChange={(payloadKey: string) => handleChange(o.value, payloadKey)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<ISetFilterValuesOperationConfig>('config');
  const dictionary = config.dictionary;
  window.dispatchEvent(new CustomEvent('set-filter-values', { detail: { dictionary, payload } }));
}

export const SetFilterValues: IDashboardOperationSchema = {
  displayName: 'Set Filter Values',
  id: 'builtin:op:set_filter_values',
  configRender: SetFilterValuesOperationSettings,
  run,
};
