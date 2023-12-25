import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { QueryEditorForm } from './query-editor-form';
import { QueryModelInstance } from '~/dashboard-editor/model/queries';

export const EditQuery = observer(({ id }: { id: string }) => {
  const content = useEditContentModelContext();
  const query = content.queries.findByID(id) as QueryModelInstance;

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

  return <QueryEditorForm queryModel={query} />;
});
