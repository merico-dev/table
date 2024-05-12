import { Box, Text, CloseButton, ColorInput, Divider, Group, Badge, Stack, Tooltip, Table } from '@mantine/core';
import { ArrayPath, Controller, Path, UseFormReturn, useFieldArray } from 'react-hook-form';
import { VisualMapPartialForm } from './types';
import { getVisualMapPalettes } from '../utils';
import { VisualMapInRangeColor } from '../types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
  name: 'visualMap.inRange.color';
};
const palettes = getVisualMapPalettes();

export const GrandientEditor = ({ form, name }: Props) => {
  const { t } = useTranslation();
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: name as ArrayPath<VisualMapPartialForm>,
  });
  const watchFieldArray = form.watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      value: watchFieldArray[index],
    };
  });

  const [newColor, setNewColor] = useState('');
  const addNewColor = () => {
    if (newColor) {
      append(newColor);
      setNewColor('');
    }
  };
  const backgroundImage = `linear-gradient(to right,  ${watchFieldArray.join(', ')})`;
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
            {controlledFields.map((f, index) => (
              <tr key={f.id}>
                <td style={{ width: '60px' }}>
                  <Badge>{index}</Badge>
                </td>
                <td>
                  <Controller
                    name={`${name}.${index}`}
                    control={form.control}
                    render={({ field }) => (
                      <ColorInput
                        styles={{
                          root: {
                            flexGrow: 1,
                          },
                        }}
                        withinPortal
                        dropdownZIndex={340}
                        {...field}
                      />
                    )}
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
                />
              </td>
              <td style={{ width: '60px' }} />
            </tr>
          </tbody>
        </Table>
        <Stack>
          <Divider variant="dashed" label={t('chart.visual_map.built_in_palettes')} labelPosition="left" />
          <Group px={70}>
            {Object.entries(palettes).map(([name, colors]) => (
              <Tooltip key={name} label={t('chart.visual_map.use_palette_x', { x: name })}>
                <Box
                  style={{
                    height: '20px',
                    width: '60px',
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
