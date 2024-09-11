import { ColorSwatch, TextInput } from '@mantine/core';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { isColorValidToPreview, isInputColorValid } from './utils';
import { useTranslation } from 'react-i18next';

export const PreviewColor = ({ value }: { value: string }) => {
  if (isColorValidToPreview(value)) {
    return <ColorSwatch ml={8} size={16} color={value} />;
  }
  return <ColorSwatch ml={8} size={16} color={''} />;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  shouldPatch: boolean;
};

export const ColorInput = ({ value, onChange, shouldPatch }: Props) => {
  const { t } = useTranslation();
  const [color, setColor] = useState(value);

  useEffect(() => {
    shouldPatch && setColor(value);
  }, [value, shouldPatch]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const v = e.currentTarget.value;
      setColor(v);

      if (isInputColorValid(v)) {
        onChange(v);
      }
    },
    [onChange],
  );

  return (
    <TextInput
      value={color}
      onChange={handleChange}
      icon={<PreviewColor value={color} />}
      size="xs"
      placeholder={t('chart.color.not_set')}
      styles={{
        root: {
          flexGrow: 1,
        },
        input: {
          fontFamily: 'monospace',
          letterSpacing: 2,
          textAlign: 'center',
          textTransform: 'uppercase',
        },
      }}
    />
  );
};
