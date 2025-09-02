import { Box, Group, HoverCard, NativeSelect, NativeSelectProps, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { useEditPanelContext } from '~/contexts';

type Props = Omit<NativeSelectProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  queryID?: string;
  unsetKey?: string;
};

export const DataKeySelector = observer(
  forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const {
      value,
      onChange,
      queryID,
      clearable = false,
      unsetKey = 'data.data_field.selector.options.unset',
      ...restProps
    } = props;
    const { panel } = useEditPanelContext();
    const options = React.useMemo(() => {
      return panel.dataFieldOptionGroups(value, clearable, unsetKey, queryID);
    }, [value, clearable, queryID]);

    if (options.length === 0) {
      const v = panel.explainDataKey(value);
      return (
        <HoverCard shadow="md" position="bottom-start" withinPortal zIndex={320}>
          <HoverCard.Target>
            <Box>
              <TextInput
                label={restProps.label}
                required={restProps.required}
                defaultValue={v.columnKey}
                readOnly
                disabled
              />
            </Box>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Group justify="flex-start" gap={0}>
              <Text size="xs" c={v.queryName ? 'black' : 'red'} ff="monospace">
                {v.queryName ?? v.queryID}
              </Text>
              <Text size="xs" c="black" ff="monospace">
                .
              </Text>
              <Text size="xs" c="red" ff="monospace">
                {v.columnKey}
              </Text>
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    }

    return (
      <NativeSelect
        ref={ref}
        {...restProps}
        data={options}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    );
  }),
);
