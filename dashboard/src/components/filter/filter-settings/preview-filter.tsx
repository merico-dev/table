import { CodeHighlight } from '@mantine/code-highlight';
import { Box, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { FilterMetaInstance } from '~/model';

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
      {/* <Text pb="md" c="gray">
        Preview
      </Text>
      <Filter filter={filter} value={value} onChange={setValue} /> */}

      <Text pt="0" pb="md" c="gray">
        {t('common.titles.config')}
      </Text>
      <CodeHighlight mt={22} language="json" withCopyButton={false} code={JSON.stringify(filter, null, 4)} />
    </Box>
  );
});
