import { NumberInput } from '@mantine/core';
import { SymbolSize, SymbolSize_Static } from './types';

interface IStaticSymbolSizeField {
  value: SymbolSize;
  onChange: (v: SymbolSize) => void;
}
export const StaticSymbolSizeField = ({ value, onChange }: IStaticSymbolSizeField) => {
  if (value.type !== 'static') {
    return null;
  }

  const changeSize = (size: SymbolSize_Static['size']) => {
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
