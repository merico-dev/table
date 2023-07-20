import { Box, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FilterModelInstance } from '~/dashboard-editor/model';
import { Filter } from '../filter';

interface IPreviewFilter {
  filter: FilterModelInstance;
}
export const PreviewFilter = observer(function _PreviewFilter({ filter }: IPreviewFilter) {
  const [value, setValue] = React.useState(filter.plainDefaultValue);

  React.useEffect(() => {
    setValue(filter.plainDefaultValue);
  }, [filter]);

  return (
    <Box sx={{ maxWidth: '480px' }}>
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
