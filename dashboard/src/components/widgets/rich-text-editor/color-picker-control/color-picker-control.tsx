import { ColorSwatch, useMantineTheme } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useCallback, useMemo } from 'react';
import { ColorPickerPopover, parsePropsColor } from '~/components/widgets';

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
      Trigger={({ onClick }) => (
        <RichTextEditor.Control onClick={onClick}>
          <ColorSwatch color={currentColor} size={14} />
        </RichTextEditor.Control>
      )}
    />
  );
};
