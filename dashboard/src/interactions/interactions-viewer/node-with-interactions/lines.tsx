import { ThemeIcon, Text, Group } from '@mantine/core';
import { IconCircleDashed, IconCircleDot, IconCircleOff } from '@tabler/icons';
import { ReactNode } from 'react';
import './index.css';

import { TInteraction, TInteractionLine } from './types';

export const IconMap: Record<string, ReactNode> = {
  'builtin:op:open-link': (
    <ThemeIcon color="blue" size={20} radius="xl">
      <IconCircleDashed size={14} />
    </ThemeIcon>
  ),
  'builtin:op:set_filter_values': (
    <ThemeIcon color="orange" size={20} radius="xl">
      <IconCircleDot size={14} />
    </ThemeIcon>
  ),
  'builtin:op:clear_filter_values': (
    <ThemeIcon color="orange" size={20} radius="xl">
      <IconCircleOff size={14} />
    </ThemeIcon>
  ),
};

export function getInteractionLines(interactions: TInteraction[]) {
  const ret: TInteractionLine[] = [];
  interactions.forEach((i) => {
    switch (i.schemaRef) {
      case 'builtin:op:open-link':
        ret.push({
          key: i.urlTemplate,
          icon: IconMap[i.schemaRef],
          text: (
            <Group spacing={4}>
              <Text>Open: </Text>
              <Text color="dimmed">{i.shortURLTemplate}</Text>
            </Group>
          ),
        });
        return;
      case 'builtin:op:set_filter_values':
        i.filters.forEach(({ key, label }) => {
          ret.push({
            key: i.schemaRef + key,
            icon: IconMap[i.schemaRef],
            text: (
              <Group spacing={4}>
                <Text>Set Filter: {label}</Text>
              </Group>
            ),
          });
        });
        return;
      case 'builtin:op:clear_filter_values':
        i.filters.forEach(({ key, label }) => {
          ret.push({
            key: i.schemaRef + key,
            icon: IconMap[i.schemaRef],
            text: (
              <Group spacing={4}>
                <Text>Clear Filter: {label}</Text>
              </Group>
            ),
          });
        });
        return;
    }
  });
  return ret;
}
