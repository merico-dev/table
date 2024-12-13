import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Center,
  CloseButton,
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import _ from 'lodash';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { NameColorMapRow } from '../type';

type RowFieldItem = {
  id: string;
} & NameColorMapRow;

type NameColorMapRowProps = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
  names: string[];
};
const RowEditor = ({ row, index, handleChange, handleRemove, names }: NameColorMapRowProps) => {
  const { t } = useTranslation();
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
        <Autocomplete
          size="xs"
          value={row.name}
          placeholder={t('viz.pie_chart.color.map.name')}
          onChange={changeName}
          onClick={setTouched}
          error={touched && !row.name}
          data={names}
          maxDropdownHeight={500}
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

type AddARowProps = {
  append: (v: NameColorMapRow) => void;
};
const AddARow = ({ append }: AddARowProps) => {
  const { t } = useTranslation();

  const add = () => {
    append({ name: '', color: '' });
  };
  return (
    <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
      <div style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }} />
      <Group wrap="nowrap" style={{ flex: 1 }}>
        <Button size="xs" variant="subtle" onClick={add} leftSection={<IconPlus size={14} />}>
          {t('viz.pie_chart.color.map.add_a_row')}
        </Button>
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }} />
    </Flex>
  );
};

type Props = {
  value: NameColorMapRow[];
  onChange: (v: NameColorMapRow[]) => void;
  zIndex?: number;
  names: string[];
};

export const PieColorMapEditor = forwardRef<HTMLDivElement, Props>(({ value, onChange, zIndex = 340, names }, ref) => {
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

  const onDragEnd = (event: any) => {
    const { source, target } = event.operation;
    const newRows = move(rows, source, target);
    onChange(newRows.map((v) => _.omit(v, 'id')));
  };

  return (
    <Stack ref={ref} pt={4}>
      <Group justify="space-between">
        <Text size="sm" fw="500" mb={-4}>
          {t('viz.pie_chart.color.map.label')}
        </Text>
        {/* <SelectPalette value={value} onChange={onChange}/> */}
      </Group>
      <DragDropProvider onDragEnd={onDragEnd}>
        {rows.map((r, index) => (
          <RowEditor
            key={r.id}
            row={r}
            handleChange={getChangeHandler(index)}
            handleRemove={() => remove(index)}
            index={index}
            names={names}
          />
        ))}
      </DragDropProvider>
      <AddARow append={append} />
    </Stack>
  );
});
