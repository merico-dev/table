import { CloseButton, ColorInput } from '@mantine/core';
import { forwardRef } from 'react';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};
export const TempColorInput = forwardRef<HTMLInputElement, Props>(({ value, onChange, label, placeholder }, ref) => {
  return (
    <ColorInput
      ref={ref}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size="xs"
      popoverProps={{
        withinPortal: true,
        zIndex: 340,
      }}
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
