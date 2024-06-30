import { Button, Divider, Stack, Tabs } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { ArrayPath, Control, FieldValues, Path, UseFormWatch, useFieldArray } from 'react-hook-form';
import { TabList } from './tab-list';
import { ControlledField, FieldArrayTabsChildren } from './types';

const TabsStyles = {
  tab: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  panel: {
    padding: '0px',
  },
};

export type FieldArrayButtonStateFunc<FieldItem> = ({
  field,
  index,
  fields,
}: {
  field: FieldItem;
  index: number;
  fields: FieldItem[];
}) => boolean;

type Props<T extends FieldValues, FieldItem> = {
  control: Control<T, $TSFixMe>;
  watch: UseFormWatch<T>;
  name: Path<T>;
  getItem: () => any;
  children: FieldArrayTabsChildren<FieldItem>;
  addButtonText: string;
  deleteButtonText: string;
  renderTabName: (field: FieldItem, index: number) => ReactNode;
  deleteDisalbed?: FieldArrayButtonStateFunc<FieldItem>;
};

export const FieldArrayTabs = <T extends FieldValues, FieldItem>({
  control,
  watch,
  name,
  getItem,
  children,
  addButtonText,
  deleteButtonText,
  renderTabName,
  deleteDisalbed,
}: Props<T, FieldItem>) => {
  const fieldArray = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });
  const { fields, append, remove } = fieldArray;

  const watchFieldArray = watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    } as ControlledField<T>;
  });

  const defaultTab = _.last(controlledFields)?.id ?? null;
  const [tab, setTab] = useState<string | null>(defaultTab);
  const handleTabChange = (tab: string | null) => {
    if (tab === 'add') {
      return;
    }
    setTab(tab);
  };
  useEffect(() => {
    setTab((t) => {
      if (defaultTab === t) {
        return t;
      }
      return defaultTab;
    });
  }, [defaultTab]);

  const add = () => {
    const item = getItem();
    fieldArray.append(item);
    setTab(item.id);
  };

  return (
    <Tabs value={tab} onTabChange={handleTabChange} styles={TabsStyles}>
      <TabList<T, FieldItem>
        fieldArray={fieldArray}
        add={add}
        addButtonText={addButtonText}
        renderTabName={renderTabName}
        controlledFields={controlledFields}
      />
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={field.id}>
          <Stack>
            {children({ field, index })}
            <Divider mb={-10} mt={10} variant="dashed" />
            <Button
              leftIcon={<IconTrash size={16} />}
              color="red"
              variant="light"
              onClick={() => remove(index)}
              sx={{ top: 15, right: 5 }}
              disabled={deleteDisalbed?.({ field, index, fields: controlledFields })}
            >
              {deleteButtonText}
            </Button>
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
