import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { QueryEditorForm } from './query-editor-form';
import { QueryModelInstance } from '~/dashboard-editor/model/queries';
import { MericoMetricQueryEditorForm } from './merico-metric-query-editor-form';

export const EditQuery = observer(({ id }: { id: string }) => {
  const content = useEditContentModelContext();
  const query = content.queries.findByID(id) as QueryModelInstance;

  if (id === '') {
    return null;
  }

  if (!query) {
    return (
      <Text size={'14px'} c="red">
        Invalid Query ID
      </Text>
    );
  }

  if (query.isMericoMetricQuery) {
    return <MericoMetricQueryEditorForm queryModel={query} />;
  }
  return <QueryEditorForm queryModel={query} />;
});
