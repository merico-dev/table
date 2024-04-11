import { Box, Group, HoverCard, Select, Sx, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { useEditPanelContext } from '~/contexts';

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  sx?: Sx;
  description?: string;
}

export const DataFieldSelector = observer(
  forwardRef(
    (
      { label, required, description, value, onChange, clearable = false, sx, ...restProps }: IDataFieldSelector,
      ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
      const { panel } = useEditPanelContext();
      const options = React.useMemo(() => {
        return panel.dataFieldOptions(value, clearable);
      }, [value, clearable]);

      if (options.length === 0) {
        const v = panel.explainDataKey(value);
        return (
          <HoverCard shadow="md" position="bottom-start" withinPortal zIndex={320}>
            <HoverCard.Target>
              <Box>
                <TextInput label={label} required={required} defaultValue={v.columnKey} readOnly disabled />
              </Box>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group position="left" spacing={0}>
                <Text size="xs" color={v.queryName ? 'black' : 'red'} sx={{ fontFamily: 'monospace' }}>
                  {v.queryName ?? v.queryID}
                </Text>
                <Text size="xs" color="black" sx={{ fontFamily: 'monospace' }}>
                  .
                </Text>
                <Text size="xs" color="red" sx={{ fontFamily: 'monospace' }}>
                  {v.columnKey}
                </Text>
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
        );
      }

      return (
        <Select
          ref={ref}
          label={label}
          description={description}
          data={options}
          value={value}
          onChange={onChange}
          required={required}
          sx={sx}
          maxDropdownHeight={500}
          {...restProps}
        />
      );
    },
  ),
);
