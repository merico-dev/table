import { ActionIcon, Flex, Group, Select, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { Settings } from 'tabler-icons-react';
import { EViewComponentType } from '~/types';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
  type: EViewComponentType | 'TRIGGER_TO_ADD';
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, type, ...others }: ItemProps, ref) => {
  if (type !== 'TRIGGER_TO_ADD') {
    return (
      <div ref={ref} {...others}>
        <Group noWrap position="apart">
          <Text size="sm" data-role="label">
            {label}
          </Text>
          <Text size="xs" color="dimmed" data-role="description">
            {type}
          </Text>
        </Group>
      </div>
    );
  }
  return (
    <div ref={ref} {...others}>
      <Group noWrap grow>
        <Text size="sm" align="center" color="#228be6">
          {label}
        </Text>
      </Group>
    </div>
  );
});

interface ISelectWithAddAndEdit {
  value: string;
  onChange: (v: string) => void;
  triggerAdd: () => void;
  triggerEdit: () => void;
  options: ItemProps[];
}

const ValueOfTriggerToAdd = 'TRIGGER_TO_ADD';

export const SelectWithAddAndEdit = observer(
  ({ value, onChange, triggerAdd, triggerEdit, options }: ISelectWithAddAndEdit) => {
    const optionsWithAction = useMemo(() => {
      return [...options, { label: 'Add a View', value: ValueOfTriggerToAdd, type: 'TRIGGER_TO_ADD' }];
    }, [options, triggerAdd]);

    const handleChange = (v: string) => {
      if (v !== ValueOfTriggerToAdd) {
        onChange(v);
      } else {
        triggerAdd();
      }
    };
    return (
      <Flex gap={0} sx={{ minWidth: '400px' }}>
        <Select
          value={value}
          onChange={handleChange}
          placeholder="Pick a View"
          itemComponent={SelectItem}
          data={optionsWithAction}
          nothingFound="Empty"
          sx={{
            flexGrow: 1,
            '.mantine-Select-item[data-selected] .mantine-Text-root[data-role=description]': {
              color: 'rgba(255,255,255,.7)',
            },
          }}
          styles={{
            input: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        />
        <ActionIcon
          onClick={triggerEdit}
          variant="default"
          size={36}
          sx={{
            borderLeft: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            // height: '36px',
            // width: '36px',
            '&:active': {
              transform: 'none',
              svg: {
                transform: 'translateY(1px)',
              },
            },
          }}
        >
          <Settings size={20} />
        </ActionIcon>
      </Flex>
    );
  },
);
