import { NumberInput } from '@mantine/core';
import { TNumberOrDynamic, TNumberOrDynamic_Static } from '../types';

interface IProps {
  value: TNumberOrDynamic;
  onChange: (v: TNumberOrDynamic) => void;
}
export const StaticNumberField = ({ value: conf, onChange }: IProps) => {
  if (conf.type !== 'static') {
    return null;
  }

  const handleChange = (v: number | string) => {
    const value = typeof v === 'string' ? '' : v;
    onChange({
      ...conf,
      value,
    });
  };
  return <NumberInput defaultValue={18} label=" " hideControls value={conf.value} onChange={handleChange} />;
};
