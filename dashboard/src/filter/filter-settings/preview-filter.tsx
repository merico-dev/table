import React from 'react';
import { Filter } from '../filter';
import { Box, Stack, Text } from '@mantine/core';
import { FilterModelInstance } from '../../model';
import { observer } from 'mobx-react-lite';
import { Prism } from '@mantine/prism';

interface IPreviewFilter {
  filter: FilterModelInstance;
}
export const PreviewFilter = observer(function _PreviewFilter({ filter }: IPreviewFilter) {
  // @ts-expect-error default_value
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

      <Text pt="lg" pb="md" color="gray">
        Config
      </Text>
      <Prism language="json" colorScheme="dark" noCopy>
        {JSON.stringify(filter, null, 4)}
      </Prism>
    </Box>
  );
});
