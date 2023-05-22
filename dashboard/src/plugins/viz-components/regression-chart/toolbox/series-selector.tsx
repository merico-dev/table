import { Button, Checkbox, Divider, Group, Flex, HoverCard, Text } from '@mantine/core';
import { IconPoint, IconSelector } from '@tabler/icons';
import { EChartsInstance } from 'echarts-for-react';
import { useState } from 'react';
import { AnyObject } from '~/types';

export interface ISeriesSelector {
  echartsInstance: EChartsInstance;
}

export const SeriesSelector = ({ echartsInstance }: ISeriesSelector) => {
  const [seriesNames, setSeriesNames] = useState<string[]>([]);
  const series: AnyObject[] =
    echartsInstance
      ?.getModel()
      ?.getSeries()
      .filter((s: AnyObject) => !s.option.custom) ?? [];

  const selectAll = () => {
    setSeriesNames(series.map((s) => s.name));
  };
  const allSelected = seriesNames.length === 0 || seriesNames.length === series.length;
  if (series.length <= 1) {
    return null;
  }
  const getColor = (name: string) => echartsInstance?.getModel()?.getColorFromPalette(name);

  return (
    <Group spacing={1}>
      <HoverCard withinPortal zIndex={320} shadow="md" position="bottom-end" initiallyOpened>
        <HoverCard.Target>
          <Group>
            <Text size={12}>{allSelected ? 'All' : seriesNames.length} series</Text>
            <IconSelector size={12} />
          </Group>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Button
            variant="subtle"
            color={allSelected ? 'gray' : 'blue'}
            size="xs"
            compact
            onClick={selectAll}
            sx={{ width: '100%' }}
          >
            Select All
          </Button>
          <Divider mt={10} variant="dashed" />
          <Checkbox.Group
            value={seriesNames}
            onChange={setSeriesNames}
            orientation="vertical"
            size="sm"
            spacing={8}
            styles={{
              root: {
                '.mantine-Checkbox-body': {
                  display: 'flex',
                  alignItems: 'center',
                },
                '.mantine-Checkbox-labelWrapper': {
                  flexGrow: 1,
                },
                '.mantine-Checkbox-label': {
                  cursor: 'pointer',
                  userSelect: 'none',
                },
              },
            }}
          >
            {series.map((s) => (
              <Checkbox
                key={s.name}
                value={s.name}
                label={
                  <Flex gap={10} justify="space-between" align="center">
                    <Text sx={{ flexGrow: 1 }}>{s.name}</Text>
                    <IconPoint size={24} color={s.color ?? getColor(s.name)} fill={s.color ?? getColor(s.name)} />
                  </Flex>
                }
              />
            ))}
          </Checkbox.Group>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};
