import { Box, Button, Combobox, Menu } from '@mantine/core';
import numbro from 'numbro';
import { FieldValues, UseFieldArrayReplace } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NameColorMapRow } from './types';
import { ColorMapPalettes } from './palette';

function getBackgroundImage(colors: string[]) {
  const len = colors.length;
  if (len === 0) {
    return '';
  }
  const format: numbro.Format = { output: 'percent', mantissa: 4, trimMantissa: true };
  const step = 1 / len;
  const stops: string[] = [];
  colors.forEach((c, i) => {
    stops.push(`${c} ${numbro(i * step).format(format)}`);
    stops.push(`${c} ${numbro((i + 1) * step).format(format)}`);
  });
  const ret = `linear-gradient(90deg, ${stops.join(',')})`;
  return ret;
}

type Props = {
  fields: (NameColorMapRow & { id: string })[];
  replace: UseFieldArrayReplace<FieldValues, string>;
};

export const SelectPalette = ({ fields, replace }: Props) => {
  const { t } = useTranslation();

  const applyPalette = (colors: string[]) => {
    const newValue = fields.map((f, i) => ({
      name: f.name,
      color: colors[i] ?? f.color,
    }));
    for (let j = newValue.length; j < colors.length; j++) {
      newValue.push({
        name: '',
        color: colors[j],
      });
    }
    replace(newValue);
  };

  return (
    <Menu
      withArrow
      shadow="md"
      width={400}
      styles={{
        item: {
          overflowX: 'hidden',
        },
      }}
    >
      <Menu.Target>
        <Button size="compact-xs" variant="subtle" rightSection={<Combobox.Chevron size="xs" />}>
          {t('viz.pie_chart.color.map.use_a_palette')}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('viz.pie_chart.color.map.click_to_apply_palette')}</Menu.Label>
        <Menu.Divider />
        {ColorMapPalettes.map((p) => (
          <Menu.Item key={p.name} onClick={() => applyPalette(p.colors)}>
            <Box h={28} style={{ backgroundImage: getBackgroundImage(p.colors) }} />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
