import { ColorSwatch, useMantineTheme } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useMemo } from 'react';
import { ColorPickerPopover, parsePropsColor, TriggerProps } from '~/components/widgets';

const getTrigger: (p: { color: string }) => any = ({ color }) =>
  forwardRef<HTMLButtonElement, TriggerProps>(({ onClick }, ref) => {
    return (
      <RichTextEditor.Control ref={ref} onClick={onClick}>
        <ColorSwatch color={color} size={14} />
      </RichTextEditor.Control>
    );
  });

export const ColorPickerControl = ({ editor }: { editor: Editor }) => {
  const theme = useMantineTheme();
  const _color = editor.getAttributes('textStyle').color || theme.black;
  const currentColor = useMemo(() => {
    return parsePropsColor(_color);
  }, [_color]);

  const handleChange = useCallback(
    (value: string) => {
      editor.chain().setColor(value).run();
    },
    [editor],
  );

  const clear = useCallback(() => {
    editor.chain().focus().unsetColor().run();
  }, [editor]);

  return (
    <ColorPickerPopover
      value={currentColor}
      onChange={handleChange}
      clear={clear}
      Trigger={getTrigger({ color: currentColor })}
    />
  );
};
