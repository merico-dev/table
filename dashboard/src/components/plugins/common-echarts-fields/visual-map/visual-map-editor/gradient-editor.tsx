import { Badge, Box, CloseButton, ColorInput, Divider, Group, Stack, Table, Tooltip } from '@mantine/core';
import { useMemo, useState } from 'react';
import { ArrayPath, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getVisualMapPalettes } from '../utils';
import { VisualMapPartialForm } from './types';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};
const palettes = getVisualMapPalettes();

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
  const backgroundImage = `linear-gradient(to right,  ${value.join(', ')})`;
  return (
    <Stack>
      <Divider label={t('chart.color.color_gradient')} labelPosition="left" variant="dashed" />
      <Stack mt={-6}>
        <Box
          style={{
            height: '20px',
            width: '100%',
            backgroundImage,
            borderRadius: 4,
          }}
        />
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
                <td style={{ width: '60px' }}>
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
              <td style={{ width: '60px' }} />
            </tr>
          </tbody>
        </Table>
        <Stack>
          <Divider variant="dashed" label={t('chart.visual_map.built_in_palettes')} labelPosition="left" />
          <Group px={70} sx={{ rowGap: 8 }}>
            {Object.entries(palettes).map(([name, colors]) => (
              <Tooltip key={name} label={t('chart.visual_map.use_palette_x', { x: name })}>
                <Box
                  style={{
                    height: '20px',
                    width: '100px',
                    backgroundImage: `linear-gradient(to right,  ${colors.join(', ')})`,
                    borderRadius: 4,
                    boxShadow: '0 0 3px 0 #eee',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    replace(colors);
                  }}
                  title={name}
                />
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
};
