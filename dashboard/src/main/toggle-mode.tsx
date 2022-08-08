import React from 'react';
import { SegmentedControl, Text } from '@mantine/core';
import { Paint, PlayerPlay, Resize } from 'tabler-icons-react';
import { DashboardMode } from '../types/dashboard';

function renderLabel(icon: React.ReactNode, postfix: string) {
  return (
    <Text size="xs" sx={{ svg: { verticalAlign: 'bottom' } }}>
      {icon} {postfix}
    </Text>
  );
}

interface IModeToggler {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
}
export function ModeToggler({ mode, setMode }: IModeToggler) {
  return (
    <SegmentedControl
      size="xs"
      value={mode}
      // @ts-expect-error Type 'Dispatch<SetStateAction<DashboardMode>>' is not assignable to type '(value: string) => void'
      onChange={setMode}
      data={[
        { label: renderLabel(<PlayerPlay size={20} />, 'Use'), value: DashboardMode.Use },
        { label: renderLabel(<Resize size={20} />, 'Edit Layout'), value: DashboardMode.Layout },
        { label: renderLabel(<Paint size={20} />, 'Edit Content'), value: DashboardMode.Edit },
      ]}
    />
  );
}
