import { Center, Divider, MultiSelect, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/model';
import { SelectDataSource } from '../select-data-source';
import { DeleteQuery } from './delete-query';

interface IQueryConfigurations {
  queryModel: QueryModelInstance;
}

export const QueryConfigurations = observer(({ queryModel }: IQueryConfigurations) => {
  return (
    <Center ml={20} mt={20} sx={{ maxWidth: '600px' }}>
      <Stack spacing={10} sx={{ width: '100%' }}>
        <Divider mb={-10} variant="dashed" label="Basics" labelPosition="center" />
        <TextInput
          placeholder="A unique name"
          label="Name"
          required
          sx={{ flex: 1 }}
          value={queryModel.name}
          onChange={(e) => {
            queryModel.setName(e.currentTarget.value);
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
          data={queryModel.conditionOptions}
          value={[...queryModel.run_by]}
          onChange={queryModel.setRunBy}
        />

        <Divider mt={20} mb={10} variant="dashed" />
        <DeleteQuery queryModel={queryModel} />
      </Stack>
    </Center>
  );
});
