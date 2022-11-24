import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext } from '~/contexts';

export const PickQueryForFilter = observer(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const model = useModelContext();
  const options = React.useMemo(() => {
    return model.queries.current.map((d) => ({
      value: d.id,
      label: d.id,
    }));
  }, [model.queries.current]);
  const empty = options.length === 0;
  return (
    <Select
      label="Pick a query"
      data={options}
      value={value}
      onChange={onChange}
      allowDeselect={false}
      clearable={false}
      sx={{ flexGrow: 1 }}
      disabled={empty}
      error={empty ? 'You need to add a query in Data Settings' : undefined}
    />
  );
});
