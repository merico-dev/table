import { ActionIcon, Center, Divider, MultiSelect, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/model';
import { SelectDataSource } from './select-data-source';
import { DeleteQuery } from './delete-query';
import { useEffect, useState } from 'react';
import { IconDeviceFloppy } from '@tabler/icons';

interface IQueryConfigurations {
  queryModel: QueryModelInstance;
}

export const QueryConfigurations = observer(({ queryModel }: IQueryConfigurations) => {
  const [name, setName] = useState(queryModel.name);
  useEffect(() => {
    setName(queryModel.name);
  }, [queryModel.name]);
  return (
    <Center ml={20} mt={20} sx={{ maxWidth: '600px' }}>
      <Stack spacing={10} sx={{ width: '100%' }}>
        <Divider mb={-10} variant="dashed" label="Basics" labelPosition="center" />
        <TextInput
          placeholder="A unique name"
          label="Name"
          required
          sx={{ flex: 1 }}
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          rightSection={
            <ActionIcon
              variant="filled"
              color="blue"
              size="sm"
              onClick={() => queryModel.setName(name)}
              disabled={name === queryModel.name}
            >
              <IconDeviceFloppy size={16} />
            </ActionIcon>
          }
          onBlur={() => {
            queryModel.setName(name);
          }}
        />
        <SelectDataSource
          value={{
            type: queryModel.type,
            key: queryModel.key,
          }}
          onChange={({ type, key }) => {
            queryModel.setKey(key);
            queryModel.setType(type);
          }}
        />
        <Divider mt={10} mb={-10} variant="dashed" label="Conditions" labelPosition="center" />
        <MultiSelect
          label="Run query when these are truthy"
          placeholder="Always run this query on load"
          data={queryModel.conditionOptions}
          value={[...queryModel.run_by]}
          onChange={queryModel.setRunBy}
        />
        {queryModel.typedAsHTTP && (
          <MultiSelect
            label="Re-run query when these changed"
            placeholder="Leave it empty to never re-run this query"
            data={queryModel.conditionOptions}
            value={[...queryModel.react_to]}
            onChange={queryModel.setReactTo}
          />
        )}

        <Divider mt={20} mb={10} variant="dashed" />
        <DeleteQuery queryModel={queryModel} />
      </Stack>
    </Center>
  );
});
