import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { Link, RichTextEditor, RichTextEditorProps, useRichTextEditorContext } from '@mantine/tiptap';
import { IconBorderAll, IconDeviceFloppy } from '@tabler/icons';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import _ from 'lodash';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { CommonHTMLContentStyle } from '~/styles/common-html-content-style';

function InsertTableControl() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })}
      aria-label="Insert table"
      title="Insert table"
    >
      <IconBorderAll stroke={1.5} size={16} />
    </RichTextEditor.Control>
  );
}

interface ICustomRichTextEditor {
  value: string;
  onChange: (v: string) => void;
  styles?: RichTextEditorProps['styles'];
  label: string;
  onSubmit?: () => void;
}

export const CustomRichTextEditor = forwardRef(
  ({ value, onChange, styles = {}, label, onSubmit }: ICustomRichTextEditor, ref: any) => {
    const [content, setContent] = useState(value);
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        Table.configure({
          resizable: false, // https://github.com/ueberdosis/tiptap/issues/2041
          HTMLAttributes: {
            class: 'rich-text-table-render',
          },
        }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Placeholder.configure({ placeholder: 'This is placeholder' }),
        TextStyle,
        Color,
      ],
      content,
      onUpdate: ({ editor }) => {
        setContent(editor.getHTML());
      },
    });

    useEffect(() => {
      setContent(value);
      editor?.commands.setContent(value);
    }, [value]);

    const submit = () => {
      onChange(content);
      onSubmit?.();
    };
    const changed = value !== content;

    const finalStyles = useMemo(() => {
      return _.defaultsDeep({}, { content: CommonHTMLContentStyle }, styles);
    }, [styles]);

    return (
      <Stack spacing={4} sx={{ flexGrow: 1, position: 'relative' }}>
        <Group align="center">
          <Text size={14} fw={500}>
            {label}
          </Text>
          <ActionIcon color="blue" disabled={!changed} onClick={submit}>
            <IconDeviceFloppy size={18} />
          </ActionIcon>
        </Group>
        <RichTextEditor editor={editor} styles={finalStyles}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.ColorPicker
                colors={[
                  '#25262b',
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14',
                ]}
              />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <InsertTableControl />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Stack>
    );
  },
);
