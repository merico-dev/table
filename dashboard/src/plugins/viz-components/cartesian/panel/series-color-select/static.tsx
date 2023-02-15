import { ColorInput } from '@mantine/core';
import { TSeriesColor, TSeriesColor_Static } from './types';

interface IStaticScatterSizeField {
  value: TSeriesColor;
  onChange: (v: TSeriesColor) => void;
}
export const StaticScatterSizeField = ({ value, onChange }: IStaticScatterSizeField) => {
  if (value.type !== 'static') {
    return null;
  }

  const handleChange = (color: TSeriesColor_Static['color']) => {
    onChange({
      ...value,
      color,
    });
  };
  return <ColorInput format="rgb" value={value.color} onChange={handleChange} />;
};
