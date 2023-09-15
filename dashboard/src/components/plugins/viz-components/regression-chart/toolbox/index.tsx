import { Group } from '@mantine/core';
import { IRegressionDescription, RegressionDescription } from './regression-description';
import { paddings } from '~/styles/viz-box';

export function Toolbox(props: IRegressionDescription) {
  return (
    <Group
      position="apart"
      sx={{ position: 'absolute', top: 0, left: paddings.left, right: paddings.right, height: '22px', zIndex: 1 }}
    >
      <RegressionDescription {...props} />
    </Group>
  );
}
