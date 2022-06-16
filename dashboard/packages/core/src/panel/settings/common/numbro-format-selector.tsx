import { Group, NumberInput, Select, Switch } from "@mantine/core";
import _ from "lodash";

export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  trimMantissa?: boolean;
}

export const defaultNumbroFormat: TNumbroFormat = { mantissa: 0, output: 'number' };

interface INumbroFormatSelector {
  value: TNumbroFormat;
  onChange: (v: TNumbroFormat) => void;
}

export function NumbroFormatSelector({ value, onChange }: INumbroFormatSelector) {
  const changeOutput = (output: TNumbroFormat['output']) => {
    onChange({ ...value, output })
  }
  const changeMantissa = (mantissa: TNumbroFormat['mantissa']) => {
    onChange({ ...value, mantissa })
  }
  const changeTrimMantissa = (event: any) => {
    onChange({ ...value, trimMantissa: event.currentTarget.checked })
  }
  return (
    <Group direction="column" grow noWrap>
      <Group direction="row" grow>
        <Select
          label="Format"
          data={[
            { label: '1234', value: 'number' },
            { label: '99%', value: 'percent' },
          ]}
          value={value.output}
          onChange={changeOutput}
        />
        <NumberInput
          label="Mantissa"
          defaultValue={0}
          min={0}
          step={1}
          max={4}
          value={value.mantissa}
          onChange={changeMantissa}
        />
        <Switch
          label="Trim mantissa"
          checked={value.trimMantissa}
          onChange={changeTrimMantissa}
        />
      </Group>
    </Group>
  )
}
