import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Autocomplete, Badge, Center, CloseButton, Flex, Group } from '@mantine/core';
import { ColorPickerPopoverForViz } from '~/components/widgets/color-picker-popover/color-picker-popover-for-viz';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { NameColorMapRow } from './types';

type NameColorMapRowProps = {
  field: NameColorMapRow & { id: string };
  update: (index: number, data: NameColorMapRow) => void;
  remove: (index: number) => void;
  index: number;
  names: string[];
};

export const RowEditor = memo(({ field, index, update, remove, names }: NameColorMapRowProps) => {
  const { t } = useTranslation();
  const [touched, { setTrue: setTouched }] = useBoolean(false);
  const [hovering, { setTrue, setFalse }] = useBoolean(false);
  const { ref, handleRef } = useSortable({
    id: field.id,
    index,
  });

  const changeName = (name: string) => {
    update(index, {
      name,
      color: field.color,
    });
  };

  const changeColor = (color: string) => {
    update(index, {
      name: field.name,
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
          value={field.name}
          placeholder={t('viz.pie_chart.color.map.name')}
          onChange={changeName}
          onClick={setTouched}
          error={touched && !field.name}
          data={names}
          maxDropdownHeight={500}
        />
        <ColorPickerPopoverForViz
          value={field.color}
          onChange={changeColor}
          label={t('viz.pie_chart.color.map.color')}
        />
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={() => remove(index)} size="sm" />
      </div>
    </Flex>
  );
});
