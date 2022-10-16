import { Box, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FilterModelInstance } from '../../model';
import { Filter } from '../filter';

interface IPreviewFilter {
  filter: FilterModelInstance;
}
export const PreviewFilter = observer(function _PreviewFilter({ filter }: IPreviewFilter) {
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
