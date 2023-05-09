import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContentModelContext } from '~/contexts';

export const PickQueryForFilter = observer(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const model = useContentModelContext();
  const options = React.useMemo(() => {
    return model.queries.options;
  }, [model.queries.current]);
  const empty = options.length === 0;
  return (
    <Select
      label="Pick a query"
      data={options}
      value={value}
      onChange={onChange}
      allowDeselect={false}
      clearable
      sx={{ flexGrow: 1 }}
      disabled={empty}
      error={empty ? 'You need to add a query in Data Settings' : undefined}
    />
  );
});
