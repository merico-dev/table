import { Divider, Group, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { IHeatmapConf } from '../../type';

interface IScatterField {
  control: Control<IHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<IHeatmapConf>;
  data: $TSFixMe[];
}
export function ScatterField({ data, control, watch }: IScatterField) {
  watch(['heat_block']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="heat_block.data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label="Style" labelPosition="center" />
      TODO
      <Divider mb={-15} variant="dashed" label="Label" labelPosition="center" />
    </Stack>
  );
}
