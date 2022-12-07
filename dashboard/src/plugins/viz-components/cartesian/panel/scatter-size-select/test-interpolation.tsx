import { Group, NumberInput, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import { TScatterSize_Interpolation } from './types';

interface ITestSizeInterpolation {
  points: TScatterSize_Interpolation['points'];
}
export const TestSizeInterpolation = ({ points }: ITestSizeInterpolation) => {
  const [value, setValue] = useState<number | undefined>();
  const size = useMemo(() => {
    return value;
  }, [value]);
  return (
    <Group spacing={30}>
      <Group spacing={10}>
        <Text size={14}>Input value:</Text>
        <NumberInput size="xs" value={value} onChange={setValue} />
      </Group>
      <Group spacing={10}>
        <Text size={14}>Output size:</Text>
        <NumberInput size="xs" value={size} disabled />
      </Group>
    </Group>
  );
};
