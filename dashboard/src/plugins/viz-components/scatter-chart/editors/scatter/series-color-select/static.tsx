import { ColorInput } from '@mantine/core';
import { TSeriesColor, TSeriesColor_Static } from './types';

interface IStaticSeriesColorField {
  value: TSeriesColor;
  onChange: (v: TSeriesColor) => void;
}
export const StaticSeriesColorField = ({ value, onChange }: IStaticSeriesColorField) => {
  if (value.type !== 'static') {
    return null;
  }

  const handleChange = (color: TSeriesColor_Static['color']) => {
    onChange({
      ...value,
      color,
    });
  };
  return <ColorInput label=" " format="rgb" value={value.color} onChange={handleChange} />;
};
