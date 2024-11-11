import { Box, Group, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { SelectDataSource } from '../query-editor-form/select-data-source';
import { MoreActions } from './more-actions';
import { RunQuery } from './run-query';
import { SelectMetric } from './select-metric';
import { QueryVariablesGuide } from '../../view-query-vars/query-variables-guide';
import { QueryTabs } from './query-tabs';
import { QueryVariablesPreview } from './query-variables-preview';

type Props = {
  queryModel: QueryModelInstance;
};
export const MericoMetricQueryEditorForm = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();
  const usage = content.findQueryUsage(queryModel.id);
  const noUsage = usage.length === 0;

  return (
    <Stack py={8} px={24} gap={8}>
      <TextInput
        size="xs"
        placeholder={t('query.name_description')}
        label={t('query.name')}
        value={queryModel.name}
        onChange={(e) => {
          queryModel.setName(e.currentTarget.value);
        }}
        styles={{
          root: {
            flex: 1,
            width: '300px',
          },
        }}
      />
      <Group justify="space-between" grow gap={8} align="flex-end">
        <Group justify="flex-start" grow gap={24}>
          <SelectDataSource queryModel={queryModel} size="xs" />
          <SelectMetric queryModel={queryModel} />
        </Group>
        <Group justify="flex-end">
          <RunQuery queryModel={queryModel} />
          <MoreActions queryModel={queryModel} />
        </Group>
      </Group>

      <Group justify="space-between" grow gap={12} align="flex-start">
        <QueryTabs queryModel={queryModel} />
        <QueryVariablesPreview />
      </Group>
    </Stack>
  );
});
