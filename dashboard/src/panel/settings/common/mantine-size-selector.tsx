import { MantineSize, MANTINE_SIZES, Select } from '@mantine/core';

interface IMantineSizeSelector {
  label: string;
  value: MantineSize;
  onChange: (v: MantineSize) => void;
}

const options = MANTINE_SIZES.map((size) => ({
  label: size.toUpperCase(),
  value: size,
}));

export const MantineSizeSelector = ({ label, value, onChange }: IMantineSizeSelector) => {
  return <Select data={options} label={label} value={value} onChange={onChange} />;
};
