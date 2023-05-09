import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';
import { SQLSnippetModelInstance } from '~/model';

export const AddASQLSnippet = observer(() => {
  const model = useContentModelContext();
  const add = () => {
    const id = new Date().getTime().toString();
    const v = {
      key: id,
      value: '',
    } as SQLSnippetModelInstance;
    model.sqlSnippets.append(v);
  };

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={add}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      Add a SQL Snippet
    </Button>
  );
});
