import { Badge, CloseButton, ColorInput, Stack, Table } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { PreviewGradientAndApplyPalette } from './preview-gradient-and-apply-palette';

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export const GrandientEditor = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const colors = useMemo(() => {
    return value.map((value) => ({
      id: uuidv4(),
      value,
    }));
  }, [value]);

  const append = (v: string) => {
    onChange([...value, v]);
  };
  const remove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  const replace = (colors: string[]) => {
    onChange([...colors]);
  };
  const getChangeHandler = (index: number) => (v: string) => {
    const newValue = [...value];
    newValue[index] = v;
    onChange(newValue);
  };

  const [newColor, setNewColor] = useState('');
  const addNewColor = () => {
    if (newColor) {
      append(newColor);
      setNewColor('');
    }
  };

  return (
    <Stack>
      <PreviewGradientAndApplyPalette colors={value} applyPalette={replace} />
      <Table withBorder={false} withColumnBorders={false} sx={{ td: { borderTop: 'none !important' } }}>
        <tbody>
          {colors.map((c, index) => (
            <tr key={c.id}>
              <td style={{ width: '60px' }}>
                <Badge>{index}</Badge>
              </td>
              <td>
                <ColorInput
                  styles={{
                    root: {
                      flexGrow: 1,
                    },
                  }}
                  withinPortal
                  dropdownZIndex={340}
                  size="xs"
                  value={c.value}
                  onChange={getChangeHandler(index)}
                />
              </td>
              <td style={{ width: '40px' }}>
                <CloseButton onClick={() => remove(index)} />
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ width: '60px' }} />
            <td>
              <ColorInput
                withinPortal
                dropdownZIndex={340}
                placeholder={t('chart.color.click_to_add_a_color')}
                value={newColor}
                onChange={setNewColor}
                onBlur={addNewColor}
                size="xs"
              />
            </td>
            <td style={{ width: '40px' }} />
          </tr>
        </tbody>
      </Table>
    </Stack>
  );
};
