import { Select, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';

type DimensionSelectorProps = {
  queryModel: QueryModelInstance;
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
};
export const DimensionSelector = observer(({ queryModel, label, value, onChange }: DimensionSelectorProps) => {
  const DimensionSelectorStyles = useMemo(
    () => ({
      root: {},
      section: {
        '&[data-position="left"]': {
          width: label ? '70px' : '0px',
          justifyContent: 'flex-start',
        },
      },
      input: {
        paddingInlineStart: label ? '70px' : 'var(--input-padding-inline-start)',
        color: 'gray',
      },
    }),
    [label],
  );
  return (
    <Select
      size="xs"
      variant="unstyled"
      leftSection={
        label ? (
          <Text size="sm" c="black">
            {label}
          </Text>
        ) : null
      }
      styles={DimensionSelectorStyles}
      value={value}
      onChange={onChange}
      data={['React', 'Angular', 'Vue', 'Svelte']}
      maxDropdownHeight={600}
    />
  );
});
