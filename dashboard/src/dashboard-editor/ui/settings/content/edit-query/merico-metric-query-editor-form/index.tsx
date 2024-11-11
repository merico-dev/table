import { Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { SelectDataSource } from '../query-editor-form/select-data-source';
import { SelectMetric } from './select-metric';

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
      <Group justify="space-between" grow gap={8}>
        <Group justify="flex-start" grow gap={24}>
          <SelectDataSource queryModel={queryModel} />
          <SelectMetric queryModel={queryModel} />
        </Group>
        <Group justify="flex-end"></Group>
      </Group>
    </Stack>
  );
});
