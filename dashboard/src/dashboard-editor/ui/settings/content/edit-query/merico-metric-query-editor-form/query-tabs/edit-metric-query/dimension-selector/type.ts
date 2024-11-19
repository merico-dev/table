export type DimensionOption = {
  label: string;
  value: string;
  description: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  group_name?: string;
  group_value?: string;
};
