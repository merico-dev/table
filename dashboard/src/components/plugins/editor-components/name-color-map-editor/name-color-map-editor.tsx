import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { Group, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { NameColorMapRow } from './types';
import { RowEditor } from './row-editor';
import { AddARow } from './add-a-row';
import { SelectPalette } from './select-palette';

type Props = {
  value: NameColorMapRow[];
  onChange: (v: NameColorMapRow[]) => void;
  zIndex?: number;
  names: string[];
};

export const NameColorMapEditor = forwardRef<HTMLDivElement, Props>(({ value, onChange, zIndex = 340, names }, ref) => {
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
        <SelectPalette value={value} onChange={onChange} />
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
