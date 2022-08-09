import React from 'react';
import { Filter } from '../filter';
import { Box, Stack, Text } from '@mantine/core';
import { FilterModelInstance } from '../../model';

interface IPreviewFilter {
  filter: FilterModelInstance;
}
export function PreviewFilter({ filter }: IPreviewFilter) {
  // @ts-expect-error
  const defaultValue = filter.config.default_value;
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Box sx={{ maxWidth: '30em' }}>
      <Text pb="md" color="gray">
        Preview
      </Text>
      <Filter filter={filter} value={value} onChange={setValue} />
      <pre>{JSON.stringify(filter, null, 4)}</pre>
    </Box>
  );
}
