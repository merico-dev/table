import { Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const QueriesSettingsButton = observer(() => {
  const model = useEditDashboardContext();
  return (
    <Button
      variant="subtle"
      // leftIcon={<IconSettings size={14} />}
      rightIcon={<IconSettings size={14} />}
      size="sm"
      px="xs"
      mb={0}
      color="blue"
      onClick={() => model.editor.setPath(['_QUERIES_'])}
      sx={{ width: '100%', borderRadius: 0, fontWeight: 'normal' }}
      styles={{
        inner: {
          justifyContent: 'space-between',
        },
      }}
    >
      Settings
    </Button>
  );
});
