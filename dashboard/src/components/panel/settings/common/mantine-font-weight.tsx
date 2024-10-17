import { Box, Slider, Stack, Text } from '@mantine/core';
import React from 'react';

const marks = [
  {
    label: 'initial',
    value: 0,
  },
  {
    label: '500',
    value: 25,
  },
  {
    label: '700',
    value: 50,
  },
  {
    label: 'semibold',
    value: 75,
  },
  {
    label: 'bold',
    value: 100,
  },
];

interface IMantineFontWeightSlider {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function _MantineFontWeightSlider({ label, value, onChange }: IMantineFontWeightSlider, ref: $TSFixMe) {
  const [mark, setMark] = React.useState(marks.find((m) => m.label === value)?.value ?? marks[0].value);

  React.useEffect(() => {
    const match = marks.find((s) => s.value === mark);
    if (match) {
      onChange(match.label);
    }
  }, [mark]);

  return (
    <Stack gap={0} mt="sm" mb="lg">
      <Text size="sm">{label}</Text>
      <Box px="1.5em">
        <Slider label={null} marks={marks} value={mark} onChange={setMark} step={25} ref={ref} />
      </Box>
    </Stack>
  );
}

export const MantineFontWeightSlider = React.forwardRef(_MantineFontWeightSlider);
