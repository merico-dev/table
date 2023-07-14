import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';

export const AddAView = observer(() => {
  const model = useContentModelContext();

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={model.views.addARandomNewView}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      Add a View
    </Button>
  );
});
