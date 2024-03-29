import { Box, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FilterMetaInstance } from '~/model';
import { Filter } from '../filter';
import { useTranslation } from 'react-i18next';

interface IPreviewFilter {
  filter: FilterMetaInstance;
}
export const PreviewFilter = observer(function _PreviewFilter({ filter }: IPreviewFilter) {
  const { t } = useTranslation();
  // const [value, setValue] = React.useState(filter.plainDefaultValue);

  // React.useEffect(() => {
  //   setValue(filter.plainDefaultValue);
  // }, [filter]);

  return (
    <Box sx={{ maxWidth: '480px' }}>
      {/* <Text pb="md" color="gray">
        Preview
      </Text>
      <Filter filter={filter} value={value} onChange={setValue} /> */}

      <Text pt="0" pb="md" color="gray">
        {t('common.titles.config')}
      </Text>
      <Prism mt={22} language="json" colorScheme="dark" noCopy>
        {JSON.stringify(filter, null, 4)}
      </Prism>
    </Box>
  );
});
