import { Group, Header as MantineHeader, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';

export const DashboardEditorHeader = observer(() => {
  const model = useModelContext();
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <Text size="xl">{model.name}</Text>
        </Group>
        <Group position="right">TODO: Save & Revert & More</Group>
      </Group>
    </MantineHeader>
  );
});
