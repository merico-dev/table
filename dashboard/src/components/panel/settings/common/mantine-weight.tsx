import { Group, Text, Slider } from "@mantine/core";
import _ from "lodash";
import React from "react";

const marks = [
  {
    label: 'initial',
    value: 0,
  },
  {
    label: '500',
    value: 25,
  },
  {
    label: '700',
    value: 50,
  },
  {
    label: 'semibold',
    value: 75,
  },
  {
    label: 'bold',
    value: 100,
  },
]

interface IMantineFontSizeSlider {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function MantineFontSizeSlider({ label, value, onChange }: IMantineFontSizeSlider) {
  const [mark, setMark] = React.useState(marks.find(m => m.label === value)?.value ?? marks[0].value);

  React.useEffect(() => {
    const match = marks.find(s => s.value === mark);
    if (match) {
      onChange(match.label);
    }
  }, [mark]);

  return (
    <Group direction="column" grow spacing="xs" mb="lg">
      <Text>{label}</Text>
      <Slider
        label={null}
        marks={marks}
        value={mark}
        onChange={setMark}
        step={25}
        placeholder="Pick a font size"
      />
    </Group>
  )
}