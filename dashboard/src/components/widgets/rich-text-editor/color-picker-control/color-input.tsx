import { TextInput } from '@mantine/core';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export const ColorInput = ({ value, onChange }: Props) => {
  const [color, setColor] = useState(value);

  useEffect(() => {
    console.log('🟢 setting', value);
    setColor(value);
  }, [value]);

  useEffect(() => {}, [color]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const v = e.currentTarget.value;
    console.log('⚫️ handleChange', v);
    setColor(v);
  }, []);
  console.log('⚪️', color, ';', value);
  return (
    <TextInput
      value={color}
      onChange={handleChange}
      // onFocus={setTrue}
      // onBlur={setFalse}
      size="xs"
      styles={{
        root: {
          flexGrow: 1,
        },
        input: {
          fontFamily: 'monospace',
          letterSpacing: 2,
          textAlign: 'center',
        },
      }}
    />
  );
};
