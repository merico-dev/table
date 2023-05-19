import { Group } from '@mantine/core';
import { IRegressionDescription, RegressionDescription } from './regression-description';

export function Toolbox(props: IRegressionDescription) {
  return (
    <Group position="apart">
      <RegressionDescription {...props} />
    </Group>
  );
}
