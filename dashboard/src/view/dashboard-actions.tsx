import { Button, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PlaylistAdd } from 'tabler-icons-react';
import { useModelContext } from '../contexts';

interface IDashboardActions {
  inUseMode: boolean;
}

export const DashboardActions = observer(function _DashboardActions({ inUseMode }: IDashboardActions) {
  const model = useModelContext();

  if (inUseMode) {
    return null;
  }

  return (
    <Group position="right" pt={0} px={10} pb="xs">
      <Group position="right" sx={{ button: { minWidth: '40px' } }}>
        <Button
          variant="filled"
          size="xs"
          disabled={!model.views.VIE}
          onClick={model.views.addAPanelToVIE}
          leftIcon={<PlaylistAdd size={20} />}
        >
          Add a Panel
        </Button>
      </Group>
    </Group>
  );
});
