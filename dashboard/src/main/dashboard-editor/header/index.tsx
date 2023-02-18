import { ActionIcon, Group, Header as MantineHeader, Text, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';

export const DashboardEditorHeader = observer(({ saveDashboardChanges }: { saveDashboardChanges: () => void }) => {
  const model = useModelContext();

  const revertChanges = () => {
    model.reset();
  };

  const hasChanges = model.changed;

  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <Text size="xl">{model.name}</Text>
        </Group>
        <Group position="right">
          <Group spacing={0} sx={ActionIconGroupStyle}>
            <Tooltip label="Save Changes">
              <ActionIcon variant="default" size="md" onClick={saveDashboardChanges} disabled={!hasChanges}>
                <IconDeviceFloppy size={20} color="green" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Revert Changes">
              <ActionIcon variant="default" size="md" disabled={!hasChanges} onClick={revertChanges}>
                <IconRecycle size={20} color="red" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </MantineHeader>
  );
});
