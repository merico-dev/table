import {
  Badge,
  Box,
  CloseButton,
  ColorInput,
  Group,
  Menu,
  Stack,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { getVisualMapPalettes } from '../utils';

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
      <Stack mt={-6}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton>
              <Text
                style={{
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#212529',
                  wordBreak: 'break-word',
                  cursor: 'default',
                }}
              >
                {t('chart.color.color_gradient')}
              </Text>
              <Group
                style={{
                  padding: '0.4375rem 0.625rem',
                  border: '0.0625rem solid #ced4da',
                  borderRadius: '0.25rem',
                  columnGap: 10,
                }}
              >
                <Box
                  style={{
                    height: '20px',
                    flexGrow: 1,
                    backgroundImage,
                    borderRadius: 4,
                  }}
                />
                <IconSelector size={14} color="rgb(134, 142, 150)" />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t('chart.visual_map.built_in_palettes')}</Menu.Label>
            <Menu.Divider />

            {Object.entries(palettes).map(([name, colors]) => (
              <Tooltip key={name} label={t('chart.visual_map.use_palette_x', { x: name })}>
                <Menu.Item>
                  <Box
                    style={{
                      height: '20px',
                      width: '100%',
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
                </Menu.Item>
              </Tooltip>
            ))}
          </Menu.Dropdown>
        </Menu>
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
    </Stack>
  );
};
