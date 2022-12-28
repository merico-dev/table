import { Group, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { AnyObject } from '~/types';
import { IBoxplotChartConf } from '../type';

interface IXAxisField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  data: AnyObject[];
  watch: UseFormWatch<IBoxplotChartConf>;
}
export const XAxisField = ({ control, data, watch }: IXAxisField) => {
  watch(['x_axis']);
  return (
    <Group grow noWrap>
      <Controller
        name="x_axis.name"
        control={control}
        render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
      />
      <Controller
        name="x_axis.data_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
        )}
      />
    </Group>
  );
};
