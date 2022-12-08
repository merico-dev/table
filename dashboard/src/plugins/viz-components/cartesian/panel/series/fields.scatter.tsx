import { Control, Controller } from 'react-hook-form';
import { AnyObject } from '~/types';
import { ICartesianChartConf } from '../../type';
import { ScatterSizeSelect } from '../scatter-size-select';

interface IScatterFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  data: AnyObject[];
}

export function ScatterFields({ control, index, data }: IScatterFields) {
  return (
    <Controller
      name={`series.${index}.symbolSize`}
      control={control}
      render={({ field }) => <ScatterSizeSelect label="Size" data={data} {...field} />}
    />
  );
}
