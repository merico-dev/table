import { Button, Group, Select, Text } from '@mantine/core';
import { IconArrowCurveRight } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';

export const PickQueryForFilter = observer(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const contentModel = useEditContentModelContext();
  const options = React.useMemo(() => {
    return contentModel.queries.options;
  }, [contentModel.queries.current]);
  const empty = options.length === 0;
  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };
  return (
    <Select
      label={
        <Group position="apart">
          <Text>{t('filter.widget.common.use_query_data_as_options')}</Text>
          {value && (
            <Button
              size="xs"
              leftIcon={<IconArrowCurveRight size={16} />}
              variant="subtle"
              color="blue"
              onClick={() => navigateToQuery(value)}
            >
              {t('query.open')}
            </Button>
          )}
        </Group>
      }
      data={options}
      value={value}
      onChange={onChange}
      allowDeselect={false}
      clearable
      sx={{ flexGrow: 1 }}
      disabled={empty}
      error={empty ? 'You need to add a query in Data Settings' : undefined}
      styles={{ label: { display: 'block' } }}
    />
  );
});
