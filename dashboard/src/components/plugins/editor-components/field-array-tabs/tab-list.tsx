import { Center, Tabs, Tooltip } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { ArrayPath, FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import { ControlledField } from './types';

type Props<T extends FieldValues, FieldItem> = {
  fieldArray: UseFieldArrayReturn<T, ArrayPath<T>, 'id'>;
  addButtonText: string;
  getItem: () => any;
  renderTabName: (field: FieldItem, index: number) => ReactNode;
  controlledFields: ControlledField<T>[];
};

export const TabList = <T extends FieldValues, FieldItem>({
  fieldArray,
  getItem,
  addButtonText,
  renderTabName,
  controlledFields,
}: Props<T, FieldItem>) => {
  const add = () => {
    fieldArray.append(getItem());
  };
  return (
    <Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Tab key={field.id} value={index.toString()}>
          {renderTabName(field, index)}
        </Tabs.Tab>
      ))}
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
