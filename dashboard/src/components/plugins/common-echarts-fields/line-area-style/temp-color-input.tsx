import { CloseButton, ColorInput } from '@mantine/core';
import { forwardRef } from 'react';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};
export const TempColorInput = forwardRef(({ value, onChange, label, placeholder }: Props) => {
  return (
    <ColorInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size="xs"
      withinPortal
      dropdownZIndex={340}
      rightSection={
        !!value ? (
          <CloseButton
            onClick={() => {
              onChange('');
            }}
          />
        ) : null
      }
    />
  );
});
