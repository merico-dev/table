import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { Group, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { MericoLinearGaugeSection } from '../../type';
import { RowEditor } from './row-editor';
import { AddARow } from './add-a-row';
import { SelectPalette } from './select-palette';

type Props = {
  value: MericoLinearGaugeSection[];
  onChange: (v: MericoLinearGaugeSection[]) => void;
  zIndex?: number;
  data: TPanelData;
};

export const SectionsEditor = forwardRef<HTMLDivElement, Props>(({ value, onChange, data }, ref) => {
  const { t } = useTranslation();
  const rows = useMemo(() => {
    return value.map((r) => ({
      id: uuidv4(),
      ...r,
    }));
  }, [value]);

  const append = (v: MericoLinearGaugeSection) => {
    onChange([...value, v]);
  };
  const remove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  const replace = (values: MericoLinearGaugeSection[]) => {
    onChange([...values]);
  };
  const getChangeHandler = (index: number) => (v: MericoLinearGaugeSection) => {
    const newValue = [...value];
    newValue[index] = v;
    onChange(newValue);
  };

  const onDragEnd = (event: any) => {
    const { source, target } = event.operation;
    const newRows = move(rows, source, target);
    onChange(newRows.map((v) => _.omit(v, 'id')));
  };

  const additional_options = useMemo(() => {
    return [
      {
        label: t('viz.merico_linear_gauge.sections.min_key.infinity'),
        value: 'positive_infinity',
      },
      {
        label: t('viz.merico_linear_gauge.sections.min_key.negative_infinity'),
        value: 'negative_infinity',
      },
    ];
  }, [t]);
  return (
    <Stack ref={ref} pt={4}>
      <Group justify="space-between">
        <Text size="sm" fw="500" mb={-4}>
          {t('viz.merico_linear_gauge.sections.label')}
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
            additional_options={additional_options}
          />
        ))}
      </DragDropProvider>
      <AddARow append={append} />
    </Stack>
  );
});
