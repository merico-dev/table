import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IBoxplotChartConf } from '../type';

interface IYAxisField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
}
export const YAxisField = ({ control, watch }: IYAxisField) => {
  watch(['y_axis']);
  return (
    <>
      <Group grow noWrap>
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label="Y Axis Name" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Y Axis Data Field" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
        <Controller
          name={'y_axis.label_formatter'}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </>
  );
};
