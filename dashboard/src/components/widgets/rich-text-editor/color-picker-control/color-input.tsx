import { ColorInput as MantineColorInput } from '@mantine/core';
import chroma from 'chroma-js';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  shouldPatch: boolean;
};

export const ColorInput = ({ value, onChange, shouldPatch }: Props) => {
  const [color, setColor] = useState(value);

  useEffect(() => {
    shouldPatch && setColor(value);
  }, [value, shouldPatch]);

  const handleChange = useCallback((v: string) => {
    if (chroma.valid(v)) {
      return;
    }

    setColor(v);
  }, []);

  const submit = useCallback(
    (v: string) => {
      setColor(v);
      onChange(v);
    },
    [onChange],
  );

  return (
    <MantineColorInput
      value={color}
      onChange={handleChange}
      onChangeEnd={submit}
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
