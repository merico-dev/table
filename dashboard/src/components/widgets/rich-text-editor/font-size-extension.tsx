/**
 * Based on https://gist.github.com/gregveres/64ec1d8a733feb735b7dd4c46331abae
 */

import { NativeSelect } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconTextSize } from '@tabler/icons-react';
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';

export type FontSizeOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'].map((s) => `${s}px`);
const FontSizeOptions = [{ label: 'auto', value: '' }].concat(
  FONT_SIZES.map((s) => ({
    label: s,
    value: s,
  })),
);

const NativeSelectStyles = {
  input: {
    height: '26px',
    minHeight: '26px',
    lineHeight: '26px',
    borderColor: '#ced4da !important',
  },
};

export const ChooseFontSize = ({ editor }: { editor: Editor }) => {
  const currentFontSize = editor.getAttributes('textStyle').fontSize;
  return (
    <RichTextEditor.ControlsGroup>
      <NativeSelect
        size="xs"
        icon={<IconTextSize stroke={1.5} size={16} />}
        data={FontSizeOptions}
        styles={NativeSelectStyles}
        value={currentFontSize ? currentFontSize : ''}
        onChange={(e) => {
          const v = e.currentTarget.value;
          if (!v) {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(v).run();
          }
        }}
      />
    </RichTextEditor.ControlsGroup>
  );
};
