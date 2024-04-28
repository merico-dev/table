import { Button, Divider, Stack, Tabs } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { ArrayPath, Control, FieldValues, Path, UseFormWatch, useFieldArray } from 'react-hook-form';

const TabsStyles = {
  tab: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  panel: {
    padding: '0px',
  },
};

type FieldArrayTabsChildren<FieldItem> = ({ field, index }: { field: FieldItem; index: number }) => ReactNode;

type Props<T extends FieldValues, FieldItem> = {
  control: Control<T, $TSFixMe>;
  watch: UseFormWatch<T>;
  name: Path<T>;
  getItem: () => any;
  children: FieldArrayTabsChildren<FieldItem>;
  deleteButtonText: string;
  renderTabName: (field: FieldItem, index: number) => ReactNode;
};
export const FieldArrayTabs = <T extends FieldValues, FieldItem>({
  control,
  watch,
  name,
  getItem,
  children,
  deleteButtonText,
  renderTabName,
}: Props<T, FieldItem>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  const watchFieldArray = watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });
  const add = () => {
    append(getItem());
  };
  return (
    <Tabs defaultValue="0" styles={TabsStyles}>
      <Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={field.id} value={index.toString()}>
            {renderTabName(field, index)}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={add} value="add">
          <IconPlus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={index.toString()}>
          <Stack>
            {children({ field, index })}
            <Divider mb={-10} mt={10} variant="dashed" />
            <Button
              leftIcon={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => remove(index)}
              sx={{ top: 15, right: 5 }}
            >
              {deleteButtonText}
            </Button>
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
