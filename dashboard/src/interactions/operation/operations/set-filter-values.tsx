import { ActionIcon, Table, TextInput } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { useEditContentModelContext } from '~/contexts';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

const TableSx: EmotionSx = {
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
  const { t } = useTranslation();
  const model = useEditContentModelContext();
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
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('interactions.operation.set_filter_values.set_filter')}</Table.Th>
          <Table.Th>{t('interactions.operation.set_filter_values.with')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[...model.filters.keyLabelOptions].map((o) => {
          const affected = o.value in dictionary;
          return (
            <Table.Tr key={o.value} data-affected={affected}>
              <Table.Td>{o.label}</Table.Td>
              <Table.Td>
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
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
});

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<ISetFilterValuesOperationConfig>('config');
  const dictionary = config.dictionary;
  window.dispatchEvent(new CustomEvent('set-filter-values', { detail: { dictionary, payload } }));
}

export const SetFilterValues: IDashboardOperationSchema = {
  displayName: 'interactions.operation.set_filter_values.label',
  id: 'builtin:op:set_filter_values',
  configRender: SetFilterValuesOperationSettings,
  run,
};
