import { Badge, Divider, Group } from '@mantine/core';

export const Hints = ({ max_days }: { max_days: number }) => {
  if (!max_days) {
    return null;
  }
  return (
    <>
      <Group position="right">
        <Badge size="xs">{max_days} days max</Badge>
      </Group>
      <Divider variant="dashed" my={10} />
    </>
  );
};
