import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { IMericoEstimationChartConf } from '../../type';

interface ITooltipMetricField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  index: number;
  remove: (index: number) => void;
}

export const TooltipMetricField = ({ control, index, remove }: ITooltipMetricField) => {
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`metrics.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`metrics.${index}.data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Field" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Metric
      </Button>
    </Stack>
  );
};
