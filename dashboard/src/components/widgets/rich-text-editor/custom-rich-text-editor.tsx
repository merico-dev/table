import { Button, Group, Stack, Text } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { Link, RichTextEditor, RichTextEditorProps, useRichTextEditorContext } from '@mantine/tiptap';
import { IconBorderAll, IconDeviceFloppy } from '@tabler/icons-react';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorEvents, Extensions, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import _ from 'lodash';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsInEditPanelContext } from '~/contexts';
import { CommonHTMLContentStyle } from '~/styles/common-html-content-style';
import { ColorMappingControl, ColorMappingMark } from './color-mapping-mark';
import { ColorPickerControl } from './color-picker-control';
import { DynamicColorControl, DynamicColorMark } from './dynamic-color-mark';
import { ChooseFontSize, FontSize } from './font-size-extension';

const RTEContentStyle: EmotionSx = {
  'dynamic-color': {
    position: 'relative',
  },
  'dynamic-color:after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '100%',
    height: '1px',
    border: 'double 1px purple',
  },
  'color-mapping': {
    position: 'relative',
  },
  'color-mapping:after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '100%',
    height: '4px',
    opacity: 0.8,
    background:
      'linear-gradient(90deg, rgb(255, 225, 225) 0%, rgb(253, 188, 188) 40%, rgb(243, 148, 148) 60%, rgb(250, 66, 66) 80%, rgb(226, 18, 18) 100%)',
  },
};

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
  autoSubmit?: boolean;
  onSubmit?: () => void;
}

export const CustomRichTextEditor = forwardRef(
  ({ value, onChange, styles = {}, label, autoSubmit, onSubmit }: ICustomRichTextEditor, ref: any) => {
    const { t } = useTranslation();
    const inPanelContext = useIsInEditPanelContext();
    const extensions: Extensions = useMemo(() => {
      const ret = [
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
        FontSize,
        DynamicColorMark,
      ];
      if (inPanelContext) {
        ret.push(ColorMappingMark);
      }
      return ret;
    }, [inPanelContext]);

    const [content, setContent] = useState(value);

    const submit = () => {
      onChange(content);
      onSubmit?.();
    };

    const autoSubmitIfAllowed = () => {
      if (autoSubmit) {
        submit();
      }
    };

    const onUpdate = ({ editor }: EditorEvents['update']) => {
      const newContent = editor.getHTML();
      setContent(newContent);
    };

    const editor = useEditor({
      extensions,
      content: value,
      onUpdate,
      onCreate: ({ editor }) => {
        editor.view.dom.setAttribute('spellcheck', 'false');
        editor.view.dom.setAttribute('autocomplete', 'off');
        editor.view.dom.setAttribute('autocapitalize', 'off');
      },
      onFocus: () => {},
      onBlur: autoSubmitIfAllowed,
      onDestroy: autoSubmitIfAllowed,
    });

    useEffect(() => {
      setContent(value);
      editor?.commands.setContent(value);
    }, [value]);

    const changed = value !== content;

    const finalStyles = useMemo(() => {
      return _.defaultsDeep({}, { content: { ...CommonHTMLContentStyle, ...RTEContentStyle } }, styles);
    }, [styles]);

    if (!editor) {
      return null;
    }

    return (
      <Stack gap={4} sx={{ flexGrow: 1, position: 'relative' }}>
        <Group align="center">
          <Text size={'14px'} fw={500}>
            {label}
          </Text>
          {!autoSubmit && (
            <Button
              variant="filled"
              color="blue"
              size="compact-xs"
              disabled={!changed}
              onClick={submit}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {t('common.actions.save_changes')}
            </Button>
          )}
        </Group>
        <RichTextEditor editor={editor} styles={finalStyles}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <ColorPickerControl editor={editor} />
            {inPanelContext && <ColorMappingControl editor={editor} />}
            <RichTextEditor.ControlsGroup>
              <DynamicColorControl editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              {/* https://github.com/merico-dev/table/issues/1088 */}
              {/* <RichTextEditor.Strikethrough /> */}
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

            <ChooseFontSize editor={editor} />
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Stack>
    );
  },
);
