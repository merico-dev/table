import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { SymbolSizeSelector } from '../../../../common-echarts-fields/symbol-size';

interface IScatterFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function ScatterFields({ control, index }: IScatterFields) {
  return (
    <Controller
      name={`series.${index}.symbolSize`}
      control={control}
      render={({ field }) => <SymbolSizeSelector label="Size" {...field} />}
    />
  );
}
