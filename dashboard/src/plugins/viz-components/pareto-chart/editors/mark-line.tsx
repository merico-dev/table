import { Button, Collapse, Stack, Text, Textarea } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useState } from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { IParetoChartConf } from '../type';

const structure = `
{
  // 80-20 line stuff
  percentage: {
    x: string; // 20%
    y: string; // 80%
  };
  count: {
    left: number; // 2
    right: number; // 8
  };

  // chart configs
  x_axis: {
    name: string;
  };
  bar: {
    name: string;
  };
  line: {
    name: string;
  };
}
`;

export const DescribeParetoParams = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened((o) => !o)}>
        {opened ? 'Close' : 'Click to see params for Label Template'}
      </Button>

      <Collapse in={opened}>
        <Prism language="typescript" noCopy colorScheme="dark">
          {structure}
        </Prism>
      </Collapse>
    </>
  );
};

interface IMarkLineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function MarkLineField({ control, watch }: IMarkLineField) {
  watch(['markLine']);
  return (
    <Stack>
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller
          name="markLine.color"
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Stack spacing={4}>
        <Controller
          name="markLine.label_template"
          control={control}
          render={({ field }) => (
            <Textarea autosize minRows={2} maxRows={4} label="Label Template" sx={{ flex: 1 }} {...field} />
          )}
        />
        <DescribeParetoParams />
      </Stack>
    </Stack>
  );
}
