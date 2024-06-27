import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Badge, Center, CloseButton, ColorInput, Flex, Stack } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { Ref, forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { PreviewGradientAndApplyPalette } from './preview-gradient-and-apply-palette';

type ColorFieldItem = {
  id: string;
  value: string;
};

type ColorRowProps = {
  color: ColorFieldItem;
  handleChange: (v: string) => void;
  handleRemove: () => void;
  index: number;
};
const ColorRow = ({ color, index, handleChange, handleRemove }: ColorRowProps) => {
  const [hovering, { setTrue, setFalse }] = useBoolean(false);
  const { ref, handleRef } = useSortable({
    id: color.id,
    index,
  });

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
          <ActionIcon size="xs" ref={handleRef}>
            <IconGripVertical />
          </ActionIcon>
        ) : (
          <Badge size="sm">{index + 1}</Badge>
        )}
      </Center>
      <div style={{ flex: 1 }}>
        <ColorInput
          styles={{
            root: {
              flexGrow: 1,
            },
          }}
          withinPortal
          dropdownZIndex={340}
          size="xs"
          value={color.value}
          onChange={handleChange}
        />
      </div>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={handleRemove} />
      </div>
    </Flex>
  );
};

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export const GradientEditor = forwardRef(({ value, onChange }: Props, ref: Ref<HTMLDivElement>) => {
  const { t } = useTranslation();
  const colors = useMemo(() => {
    return value.map((value) => ({
      id: uuidv4(),
      value,
    }));
  }, [value]);

  const append = (v: string) => {
    onChange([...value, v]);
  };
  const remove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  const replace = (colors: string[]) => {
    onChange([...colors]);
  };
  const getChangeHandler = (index: number) => (v: string) => {
    const newValue = [...value];
    newValue[index] = v;
    onChange(newValue);
  };

  const [newColor, setNewColor] = useState('');
  const addNewColor = () => {
    if (newColor) {
      append(newColor);
      setNewColor('');
    }
  };
  const onDragEnd = (event: any) => {
    const { source, target } = event.operation;
    const newColors = move(colors, source, target);
    onChange(newColors.map((c) => c.value));
  };

  return (
    <Stack ref={ref}>
      <PreviewGradientAndApplyPalette colors={value} applyPalette={replace} />
      <DragDropProvider onDragEnd={onDragEnd}>
        {colors.map((c, index) => (
          <ColorRow
            key={c.id}
            color={c}
            handleChange={getChangeHandler(index)}
            handleRemove={() => remove(index)}
            index={index}
          />
        ))}
      </DragDropProvider>
      <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
        <div style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }} />
        <div style={{ flex: 1 }}>
          <ColorInput
            withinPortal
            dropdownZIndex={340}
            placeholder={t('chart.color.click_to_add_a_color')}
            value={newColor}
            onChange={setNewColor}
            onBlur={addNewColor}
            size="xs"
          />
        </div>
        <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }} />
      </Flex>
    </Stack>
  );
});
