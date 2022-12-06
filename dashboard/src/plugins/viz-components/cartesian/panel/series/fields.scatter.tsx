import { Group } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { ScatterSizeSelect } from '../scatter-size-select';

interface IScatterFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function ScatterFields({ control, index }: IScatterFields) {
  return (
    <Controller
      name={`series.${index}.symbolSize`}
      control={control}
      render={({ field }) => <ScatterSizeSelect label="Size" {...field} />}
    />
  );
}
