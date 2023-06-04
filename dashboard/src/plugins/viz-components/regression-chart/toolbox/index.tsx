import { Group } from '@mantine/core';
import { IRegressionDescription, RegressionDescription } from './regression-description';

export function Toolbox(props: IRegressionDescription) {
  return (
    <Group position="apart" sx={{ position: 'absolute', top: 0, left: 0, height: '22px', zIndex: 1 }}>
      <RegressionDescription {...props} />
    </Group>
  );
}
