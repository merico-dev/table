import { NumberInput } from '@mantine/core';
import { TScatterSize, TScatterSize_Static } from './types';

interface IStaticScatterSizeField {
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
}
export const StaticScatterSizeField = ({ value, onChange }: IStaticScatterSizeField) => {
  if (value.type !== 'static') {
    return null;
  }

  const changeSize = (size: TScatterSize_Static['size']) => {
    onChange({
      ...value,
      size,
    });
  };
  return (
    <>
      <NumberInput
        defaultValue={18}
        placeholder="1 ~ 100"
        label=" "
        hideControls
        value={value.size}
        onChange={changeSize}
      />
    </>
  );
};
