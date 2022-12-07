import { Group, NumberInput, Text } from '@mantine/core';
import { interpolate } from 'popmotion';
import { useMemo, useState } from 'react';
import { TScatterSize_Interpolation } from './types';

interface ITestSizeInterpolation {
  points: TScatterSize_Interpolation['points'];
}
export const TestSizeInterpolation = ({ points }: ITestSizeInterpolation) => {
  const [value, setValue] = useState<number | undefined>();
  const mapper = useMemo(() => {
    return interpolate(
      points.map((p) => p.value),
      points.map((p) => p.size),
      {
        clamp: true,
      },
    );
  }, [points]);

  const size = useMemo(() => {
    if (value === undefined) {
      return value;
    }
    return mapper(value);
  }, [value, mapper]);
  return (
    <Group spacing={30}>
      <Group spacing={10}>
        <Group spacing={4}>
          <Text size={14}>Input</Text>
          <Text color="rgb(255, 107, 107)" sx={{ fontWeight: 'bold' }}>
            value
          </Text>
        </Group>
        <NumberInput size="xs" value={value} onChange={setValue} />
      </Group>
      <Group spacing={10}>
        <Group spacing={4}>
          <Text size={14}>Output</Text>
          <Text color="rgb(51, 154, 240)" sx={{ fontWeight: 'bold' }}>
            size
          </Text>
        </Group>
        <NumberInput
          size="xs"
          value={size}
          disabled
          sx={{ 'input.mantine-NumberInput-disabled': { color: 'black', backgroundColor: '#f5f5f5' } }}
        />
      </Group>
    </Group>
  );
};
