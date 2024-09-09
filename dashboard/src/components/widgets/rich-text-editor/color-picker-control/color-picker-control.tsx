import { useMantineTheme } from '@mantine/core';
import { Editor } from '@tiptap/react';
import chroma from 'chroma-js';
import { useCallback, useMemo } from 'react';
import { ColorPickerPopover } from '~/components/widgets';

export const ColorPickerControl = ({ editor }: { editor: Editor }) => {
  const theme = useMantineTheme();
  const _color = editor.getAttributes('textStyle').color || theme.black;
  const currentColor = useMemo(() => {
    try {
      return chroma(_color).hex();
    } catch (error) {
      return _color;
    }
  }, [_color]);

  const handleChange = useCallback(
    (value: string) => {
      (editor.chain() as any).focus().setColor(value).run();
    },
    [editor],
  );

  const clear = useCallback(() => {
    (editor.chain() as any).focus().unsetColor().run();
  }, [editor]);

  return <ColorPickerPopover value={currentColor} onChange={handleChange} clear={clear} />;
};
