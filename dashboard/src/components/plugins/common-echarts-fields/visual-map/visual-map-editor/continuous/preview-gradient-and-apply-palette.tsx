import { Box, Group, Menu, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getVisualMapPalettes } from '../../utils';
const palettes = getVisualMapPalettes();

type Props = {
  colors: string[];
  applyPalette: (colors: string[]) => void;
};
export const PreviewGradientAndApplyPalette = ({ colors, applyPalette }: Props) => {
  const { t } = useTranslation();
  const backgroundImage = `linear-gradient(to right,  ${colors.join(', ')})`;
  return (
    <Menu shadow="md" width={300}>
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
                  applyPalette(colors);
                }}
                title={name}
              />
            </Menu.Item>
          </Tooltip>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
