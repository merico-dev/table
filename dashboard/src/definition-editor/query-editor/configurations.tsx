import { MultiSelect, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryModelInstance } from '~/model';

interface IQueryConfigurations {
  queryModel: QueryModelInstance;
}

export const QueryConfigurations = observer(({ queryModel }: IQueryConfigurations) => {
  return (
    <Stack>
      <MultiSelect
        label="Run query when these are truthy"
        data={queryModel.conditionOptions}
        value={queryModel.run_by}
        onChange={queryModel.setRunBy}
      />
    </Stack>
  );
});
