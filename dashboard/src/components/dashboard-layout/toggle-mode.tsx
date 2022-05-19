import React from "react";
import { SegmentedControl, Text } from "@mantine/core";
import { Paint, PlayerPlay } from "tabler-icons-react";
import { DashboardMode } from "../../types/dashboard"

function renderLabel(icon: React.ReactNode, postfix: string) {
  return <Text sx={{ svg: { verticalAlign: 'text-bottom' }}}>{icon} {postfix}</Text>
}

interface IModeToggler {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
}
export function ModeToggler({ mode, setMode }: IModeToggler) {
  return (
    <SegmentedControl
      value={mode}
      // @ts-expect-error Type 'Dispatch<SetStateAction<DashboardMode>>' is not assignable to type '(value: string) => void'
      onChange={setMode}
      data={[
        { label: renderLabel(<PlayerPlay size={20} />, 'Use'), value: DashboardMode.Use },
        { label: renderLabel(<Paint size={20} />, 'Edit'), value: DashboardMode.Edit },
      ]}
    />
  )
}