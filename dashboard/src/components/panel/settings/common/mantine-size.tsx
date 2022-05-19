import { Group, Slider, Text } from "@mantine/core";
import _ from "lodash";
import React from "react";

const marks = [
  {
    "value": 0,
    "label": "xs"
  },
  {
    "value": 25,
    "label": "sm"
  },
  {
    "value": 50,
    "label": "md"
  },
  {
    "value": 75,
    "label": "lg"
  },
  {
    "value": 100,
    "label": "xl"
  }
];

interface IMantineSizeSlider {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function MantineSizeSlider({ label, value, onChange }: IMantineSizeSlider) {
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