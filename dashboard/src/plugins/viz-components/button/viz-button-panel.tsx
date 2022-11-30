import { Checkbox, CheckIcon, MantineSize, Select, Stack } from '@mantine/core';
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
      <Select
        label="Variant"
        data={variantOptions}
        value={conf.variant}
        onChange={(v: string) => setConfByKey('variant', v)}
      />
      <MantineColorSwatches label="Theme" value={conf.color} onChange={(v: string) => setConfByKey('color', v)} />
      <MantineSizeSelector label="Size" value={conf.size} onChange={(v: MantineSize) => setConfByKey('size', v)} />
      <Checkbox
        label="Compact"
        checked={conf.compact}
        onChange={(event) => setConfByKey('compact', event.currentTarget.checked)}
      />
    </Stack>
  );
}
