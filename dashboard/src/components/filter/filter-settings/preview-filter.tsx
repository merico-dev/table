import { CodeHighlight } from '@mantine/code-highlight';
import { Box, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { FilterModelInstance } from '~/dashboard-editor/model/filters/filter-model';

type Props = {
  filter: FilterModelInstance;
};
export const PreviewFilter = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  // const [value, setValue] = React.useState(filter.plainDefaultValue);

  // React.useEffect(() => {
  //   setValue(filter.plainDefaultValue);
  // }, [filter]);

  return (
    <Tabs defaultValue="config">
      <Tabs.List>
        <Tabs.Tab value="config">{t('common.titles.config')}</Tabs.Tab>
        <Tabs.Tab value="usage">{t('filter.usage.label')}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="config">
        <Box sx={{ maxWidth: '480px' }}>
          {/*
          <Text pb="md" c="gray" size="sm">
          Preview
          </Text>
          <Filter filter={filter} value={value} onChange={setValue} />
          */}
          <CodeHighlight mt={22} language="json" withCopyButton={false} code={JSON.stringify(filter, null, 4)} />
        </Box>
      </Tabs.Panel>
      <Tabs.Panel value="usage">TODO</Tabs.Panel>
    </Tabs>
  );
});
