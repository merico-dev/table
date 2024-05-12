import { Box, Button, CloseButton, ColorInput, Divider, Group, Badge, Stack, Tooltip } from '@mantine/core';
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

  const [newColor, setNewColor] = useState('');
  const addNewColor = () => {
    if (newColor) {
      append(newColor);
      setNewColor('');
    }
  };
  const backgroundImage = `linear-gradient(to right,  ${fields.join(', ')})`;
  return (
    <Stack>
      <Divider label={t('chart.color.label')} labelPosition="center" variant="dashed" />
      <Stack mt={-6}>
        <Box
          style={{
            height: '20px',
            width: '100%',
            backgroundImage,
            borderRadius: 4,
          }}
        />
        <Stack>
          {fields.map((f, index) => (
            <Group key={f.id}>
              <Badge>{index}</Badge>
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
              <CloseButton onClick={() => remove(index)} />
            </Group>
          ))}
          <ColorInput
            withinPortal
            dropdownZIndex={340}
            placeholder={t('chart.color.click_to_add_a_color')}
            value={newColor}
            onChange={setNewColor}
            onBlur={addNewColor}
          />
          <Group>
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
