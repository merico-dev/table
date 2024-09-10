import { Button } from '@mantine/core';
import { forwardRef, useCallback } from 'react';
import { PreviewColor } from './color-input';
import { ColorPickerPopover, TriggerProps } from './color-picker-popover';

const getTrigger: (p: { color: string; label: string }) => any = ({ color, label }) =>
  forwardRef<HTMLButtonElement, TriggerProps>(({ onClick }, ref) => {
    return (
      <Button ref={ref} size="sm" variant="default" leftIcon={<PreviewColor value={color} />} onClick={onClick}>
        {label}
      </Button>
    );
  });

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export const ColorPickerPopoverForViz = forwardRef<HTMLElement, Props>(({ value, onChange, label }, ref) => {
  const clear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <ColorPickerPopover value={value} onChange={onChange} clear={clear} Trigger={getTrigger({ color: value, label })} />
  );
});
