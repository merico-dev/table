import { ActionIcon, Group, Select, Text } from '@mantine/core';
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
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {type}
          </Text>
        </Group>
      </div>
    );
  }
  return (
    <div ref={ref} {...others}>
      <Group noWrap grow>
        <Text size="sm" align="center">
          {label}
        </Text>
      </Group>
    </div>
  );
});

interface ISelectWithAddAndEdit {
  triggerAdd: () => void;
  triggerEdit: () => void;
  options: ItemProps[];
}

export const SelectWithAddAndEdit = observer(({ triggerAdd, triggerEdit, options }: ISelectWithAddAndEdit) => {
  const optionsWithAction = useMemo(() => {
    return [...options, { label: 'Add a View', value: 'add_a_view', type: 'TRIGGER_TO_ADD' }];
  }, [options, triggerAdd]);
  return (
    <Group position="left" spacing={0} sx={{ minWidth: '260px' }}>
      <Select
        placeholder="Pick a View"
        itemComponent={SelectItem}
        data={optionsWithAction}
        nothingFound="Empty"
        sx={{ flexGrow: 1 }}
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
    </Group>
  );
});
