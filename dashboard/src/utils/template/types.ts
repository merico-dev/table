import { TNumberFormat } from '../../components/panel/settings/common/numbro-format-selector';
import { AggregationType } from '../aggregation';

export type ColorConfType =
  | {
      type: 'static';
      staticColor: string;
    }
  | {
      type: 'continuous';
      valueRange: number[];
      colorRange: string[];
    }
  | {
      type: 'piecewise'; // TODO
    };

export interface ITemplateVariable {
  name: string;
  data_field: string;
  aggregation: AggregationType;
  formatter: TNumberFormat;
  color: ColorConfType;
  size: string;
  weight: string;
}
