import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Badge, Center, CloseButton, ColorInput, Flex, Group, Stack, TextInput } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { Ref, forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { NameColorMapRow } from '../type';
import _ from 'lodash';
import { useDisclosure } from '@mantine/hooks';

type RowFieldItem = {
  id: string;
} & NameColorMapRow;

type NameColorMapRowProps = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
};
const RowEditor = ({ row, index, handleChange, handleRemove }: NameColorMapRowProps) => {
  const [touched, { setTrue: setTouched }] = useBoolean(false);
  const [hovering, { setTrue, setFalse }] = useBoolean(false);
  const { ref, handleRef } = useSortable({
    id: row.id,
    index,
  });

  const changeName = (name: string) => {
    handleChange({
      ...row,
      name,
    });
  };

  const changeColor = (color: string) => {
    handleChange({
      ...row,
      color,
    });
  };

  return (
    <Flex
      ref={ref}
      gap="sm"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="nowrap"
      onMouseEnter={setTrue}
      onMouseLeave={setFalse}
    >
      <Center style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }}>
        {hovering ? (
          <ActionIcon size="xs" ref={handleRef} variant="subtle">
            <IconGripVertical />
          </ActionIcon>
        ) : (
          <Badge size="sm" variant="light">
            {index + 1}
          </Badge>
        )}
      </Center>
      <Group grow wrap="nowrap" style={{ flex: 1 }}>
        <TextInput
          size="xs"
          value={row.name}
          onChange={(e) => changeName(e.currentTarget.value)}
          onClick={setTouched}
          error={touched && !row.name}
        />
        <ColorInput
          styles={{
            root: {
              flexGrow: 1,
            },
          }}
          popoverProps={{
            withinPortal: true,
            zIndex: 340,
          }}
          size="xs"
          value={row.color}
          onChange={changeColor}
          onClick={setTouched}
          error={touched && !row.color}
        />
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={handleRemove} size="sm" />
      </div>
    </Flex>
  );
};

type Props = {
  value: NameColorMapRow[];
  onChange: (v: NameColorMapRow[]) => void;
  zIndex?: number;
};

export const PieColorMapEditor = forwardRef(({ value, onChange, zIndex = 340 }: Props, ref: Ref<HTMLDivElement>) => {
  const { t } = useTranslation();
  const rows = useMemo(() => {
    return value.map((r) => ({
      id: uuidv4(),
      ...r,
    }));
  }, [value]);

  const append = (v: NameColorMapRow) => {
    onChange([...value, v]);
  };
  const remove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  const replace = (values: NameColorMapRow[]) => {
    onChange([...values]);
  };
  const getChangeHandler = (index: number) => (v: NameColorMapRow) => {
    const newValue = [...value];
    newValue[index] = v;
    onChange(newValue);
  };

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('');
  const addNewColor = () => {
    if (newColor) {
      append({ name: '', color: newColor });
      setNewColor('');
    }
  };
  const addNewName = () => {
    if (newName) {
      append({ name: newName, color: '' });
      setNewName('');
    }
  };
  const onDragEnd = (event: any) => {
    const { source, target } = event.operation;
    const newRows = move(rows, source, target);
    onChange(newRows.map((v) => _.omit(v, 'id')));
  };

  return (
    <Stack ref={ref}>
      <DragDropProvider onDragEnd={onDragEnd}>
        {rows.map((r, index) => (
          <RowEditor
            key={r.id}
            row={r}
            handleChange={getChangeHandler(index)}
            handleRemove={() => remove(index)}
            index={index}
          />
        ))}
      </DragDropProvider>
      <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
        <div style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }} />
        <Group grow wrap="nowrap" style={{ flex: 1 }}>
          <TextInput
            size="xs"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            onBlur={addNewName}
            placeholder={t('viz.pie_chart.color.map.add_by_name')}
          />
          <ColorInput
            popoverProps={{
              withinPortal: true,
              zIndex,
            }}
            placeholder={t('chart.color.click_to_add_a_color')}
            value={newColor}
            onChange={setNewColor}
            onBlur={addNewColor}
            size="xs"
          />
        </Group>
        <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }} />
      </Flex>
    </Stack>
  );
});
