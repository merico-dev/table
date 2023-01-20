import { ActionIcon, Button, Flex, Stack, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Trash } from 'tabler-icons-react';
import { useModelContext } from '~/contexts';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { useStorageData } from '~/plugins';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

export interface ISetFilterValuesOperationConfig {
  dictionary: Record<string, string>;
}

const defaultValue: ISetFilterValuesOperationConfig = { dictionary: {} };

const SetFilterValuesOperationSettings = observer((props: IOperationConfigProps) => {
  const model = useModelContext();
  const { value = defaultValue, set } = useStorageData<ISetFilterValuesOperationConfig>(
    props.operation.operationData,
    'config',
  );

  const { dictionary = {} } = value;
  const setDictionary = (key: string, value: string) => {
    set({
      dictionary: {
        ...dictionary,
        [key]: value,
      },
    });
  };

  const append = () => {
    setDictionary(model.filters.firstFilterValueKey, '');
  };

  const remove = (filterKey: string) => {
    const newDict = {
      ...dictionary,
    };
    delete newDict[filterKey];
    set({
      dictionary: newDict,
    });
  };

  return (
    <Stack spacing={10}>
      <Text>Mapping Rules</Text>
      {Object.entries(dictionary).map(([filterKey, payloadKey]) => (
        <Flex justify="space-between" gap={10} key={filterKey}>
          <TextInput
            label="Payload key"
            value={payloadKey}
            onChange={(e) => {
              setDictionary(filterKey, e.currentTarget.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          {/* <Text sx={{ flexGrow: 0, flexShrink: 0 }}>as</Text> */}
          <DataFieldSelector
            data={[model.filters.values]}
            value={filterKey}
            onChange={(key) => {
              setDictionary(key, payloadKey);
            }}
            label="Filter key"
            sx={{ flexGrow: 1 }}
          />
          <ActionIcon onClick={() => remove(filterKey)} sx={{ marginTop: '26px', flexGrow: 0 }}>
            <Trash size={14} color="red" />
          </ActionIcon>
        </Flex>
      ))}
      <Button size="xs" onClick={append} sx={{ alignSelf: 'center', width: '300px' }}>
        Add one mapping rule
      </Button>
    </Stack>
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
