import { Group, NumberInput, Select, Text } from "@mantine/core";
import _ from "lodash";

export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
}

export const defaultNumbroFormat: TNumbroFormat = { mantissa: 0, output: 'number' };

interface INumbroFormatSelector {
  label: string;
  value: TNumbroFormat;
  onChange: (v: TNumbroFormat) => void;
}

export function NumbroFormatSelector({ label, value, onChange }: INumbroFormatSelector) {
  const changeOutput = (output: TNumbroFormat['output']) => {
    onChange({ output, mantissa: value.mantissa })
  }
  const changeMantissa = (mantissa: TNumbroFormat['mantissa']) => {
    onChange({ output: value.output, mantissa })
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
      </Group>
    </Group>
  )
}