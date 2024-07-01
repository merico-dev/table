import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Center, Tabs, Tooltip } from '@mantine/core';
import { IconGripHorizontal, IconPlus } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { ReactNode } from 'react';
import { ArrayPath, FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import { ControlledField } from './types';

type DraggableTabProps = {
  index: number;
  value: string;
  children: ReactNode;
};

const DraggableTab = ({ value, index, children }: DraggableTabProps) => {
  const [hovering, { setTrue, setFalse }] = useBoolean(false);
  const { ref, handleRef } = useSortable({
    id: value,
    index,
  });

  return (
    <Tabs.Tab
      ref={ref}
      value={value}
      icon={<IconGripHorizontal size={14} color={hovering ? 'rgb(34, 139, 230)' : 'transparent'} />}
      onMouseEnter={setTrue}
      onMouseLeave={setFalse}
    >
      {children}
    </Tabs.Tab>
  );
};

type Props<T extends FieldValues, FieldItem> = {
  fieldArray: UseFieldArrayReturn<T, ArrayPath<T>, 'id'>;
  addButtonText: string;
  add: () => void;
  renderTabName: (field: FieldItem, index: number) => ReactNode;
  controlledFields: ControlledField<T>[];
};

export const TabList = <T extends FieldValues, FieldItem>({
  fieldArray,
  add,
  addButtonText,
  renderTabName,
  controlledFields,
}: Props<T, FieldItem>) => {
  const onDragEnd = (event: any) => {
    const { source, target } = event.operation;
    const fromIndex = controlledFields.findIndex((f) => f.id === source.id);
    const toIndex = target.index;
    fieldArray.move(fromIndex, toIndex);
  };

  return (
    <Tabs.List>
      <DragDropProvider onDragEnd={onDragEnd}>
        {controlledFields.map((field, index) => (
          <DraggableTab key={field.id} value={field.id} index={index}>
            {renderTabName(field, index)}
          </DraggableTab>
        ))}
      </DragDropProvider>

      <Tabs.Tab onClick={add} value="add">
        <Tooltip label={addButtonText}>
          <Center>
            <IconPlus size={18} color="#228be6" />
          </Center>
        </Tooltip>
      </Tabs.Tab>
    </Tabs.List>
  );
};
