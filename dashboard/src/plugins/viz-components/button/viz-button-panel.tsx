import { Checkbox, Divider, MantineSize, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { MantineColorSwatches } from '~/panel/settings/common/mantine-color-swatches';
import { MantineSizeSelector } from '~/panel/settings/common/mantine-size-selector';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outline', value: 'outline' },
  { label: 'Light', value: 'light' },
  { label: 'White', value: 'white' },
  { label: 'Default', value: 'default' },
  { label: 'Subtle', value: 'subtle' },
  { label: 'Gradient', value: 'gradient', disabled: true },
];

const horizontalAlignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const verticalAlignmentOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom', value: 'bottom' },
];

export function VizButtonPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const setConfByKey = (key: string, value: IButtonConf[keyof IButtonConf]) => {
    setConf({
      ...conf,
      [key]: value,
    });
  };

  return (
    <Stack>
      <TextInput
        label="Content Template"
        description="Filter values & context entries are supported"
        value={conf.content}
        onChange={(e) => setConfByKey('content', e.currentTarget.value)}
        required
      />
      <Divider mt="xs" mb={0} label="Styles" labelPosition="center" variant="dashed" />
      <SimpleGrid cols={2}>
        <Select
          label="Variant"
          data={variantOptions}
          value={conf.variant}
          onChange={(v: string) => setConfByKey('variant', v)}
        />
        <MantineColorSwatches label="Theme" value={conf.color} onChange={(v: string) => setConfByKey('color', v)} />
      </SimpleGrid>
      <SimpleGrid cols={2}>
        <MantineSizeSelector label="Size" value={conf.size} onChange={(v: MantineSize) => setConfByKey('size', v)} />
        <Checkbox
          label="Compact"
          checked={conf.compact}
          onChange={(event) => setConfByKey('compact', event.currentTarget.checked)}
          mt={26}
        />
      </SimpleGrid>
      <SimpleGrid cols={2}>
        <Select
          label="Horizontal Alignment"
          data={horizontalAlignmentOptions}
          value={conf.horizontal_align}
          onChange={(v: string) => setConfByKey('horizontal_align', v)}
        />
        <Select
          label="Vertical Alignment"
          data={verticalAlignmentOptions}
          value={conf.vertical_align}
          onChange={(v: string) => setConfByKey('vertical_align', v)}
        />
      </SimpleGrid>
    </Stack>
  );
}
