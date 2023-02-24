import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { QueryEditorForm } from './query-editor-form';

export const EditQuery = observer(({ id }: { id: string }) => {
  const model = useModelContext();
  const query = useMemo(() => {
    return model.queries.findByID(id);
  }, [model.queries, id]);

  if (id === '') {
    return null;
  }

  if (!query) {
    return (
      <Text size={14} color="red">
        Invalid Query ID
      </Text>
    );
  }

  return (
    <Stack sx={{ height: '100%' }} spacing="sm">
      <QueryEditorForm queryModel={query} />
    </Stack>
  );
});
