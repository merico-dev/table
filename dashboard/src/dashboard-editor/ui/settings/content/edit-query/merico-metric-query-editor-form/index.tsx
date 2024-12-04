import { Group, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { SelectDataSource } from '../query-editor-form/select-data-source';
import { MoreActions } from './more-actions';
import { PreviewData } from './preview-data';
import { PreviewQueryAndVars } from './preview-query-and-vars';
import { QueryTabs } from './query-tabs';
import { RunQuery } from './run-query';
import { SelectMetric } from './select-metric';

type Props = {
  queryModel: QueryModelInstance;
};
export const MericoMetricQueryEditorForm = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack
      pt={8}
      pb={16}
      px={24}
      gap={8}
      styles={{
        root: {
          height: '100vh',
          overflow: 'hidden',
        },
      }}
    >
      <Group styles={{ root: { flexGrow: 0, flexShrink: 0 } }}>
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
              flexGrow: 0,
              width: 'calc(50% - 44px)',
            },
          }}
        />
      </Group>
      <Group justify="space-between" grow gap={8} align="flex-end" styles={{ root: { flexGrow: 0, flexShrink: 0 } }}>
        <Group justify="flex-start" grow gap={24} align="flex-end">
          <SelectDataSource queryModel={queryModel} size="xs" />
          <SelectMetric queryModel={queryModel} />
        </Group>
        <Group justify="flex-end">
          <RunQuery queryModel={queryModel} />
          <MoreActions queryModel={queryModel} />
        </Group>
      </Group>

      <Group
        justify="space-between"
        grow
        gap={12}
        align="flex-start"
        sx={{ flexGrow: 0, flexShrink: 1, overflowY: 'hidden' }}
      >
        <QueryTabs queryModel={queryModel} />
        <PreviewQueryAndVars queryModel={queryModel} />
      </Group>
      <PreviewData queryModel={queryModel} />
    </Stack>
  );
});
