import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { Group, Stack, Text } from '@mantine/core';
import { ComponentProps, forwardRef, memo } from 'react';
import { Control, FieldValues, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NameColorMapRow } from './types';
import { RowEditor } from './row-editor';
import { AddARow } from './add-a-row';
import { SelectPalette } from './select-palette';

type FieldWithId = NameColorMapRow & { id: string };

type Props = {
  control: Control<$TSFixMe>;
  name: string;
  names: string[];
};

export const NameColorMapEditor = memo(
  forwardRef<HTMLDivElement, Props>(({ control, name, names }, ref) => {
    const { t } = useTranslation();
    const { fields, append, remove, update, replace } = useFieldArray({
      control,
      name,
    });

    const typedFields = fields as FieldWithId[];

    const handleAppend = (v: NameColorMapRow) => {
      append(v);
    };

    const onDragEnd: ComponentProps<typeof DragDropProvider>['onDragEnd'] = (event) => {
      const { source, target } = event.operation;
      if (!source || !target) return;
      const newFields = move(typedFields, source, target);
      replace(newFields.map((f) => ({ name: f.name, color: f.color })));
    };

    return (
      <Stack ref={ref} pt={4}>
        <Group justify="space-between">
          <Text size="sm" fw="500" mb={-4}>
            {t('viz.pie_chart.color.map.label')}
          </Text>
          <SelectPalette fields={typedFields} replace={replace} />
        </Group>
        <DragDropProvider onDragEnd={onDragEnd}>
          {typedFields.map((field, index) => (
            <RowEditor key={field.id} field={field} update={update} remove={remove} index={index} names={names} />
          ))}
        </DragDropProvider>
        <AddARow append={handleAppend} />
      </Stack>
    );
  }),
);
