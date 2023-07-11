import { Link, RichTextEditor, RichTextEditorProps } from '@mantine/tiptap';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { CommonHTMLContentStyle } from '~/styles/common-html-content-style';
import { FontSize } from './font-size-extension';

interface IReadonlyRichText {
  value: string;
  styles?: RichTextEditorProps['styles'];
}

export const ReadonlyRichText = ({ value, styles = {} }: IReadonlyRichText) => {
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
      FontSize,
    ],
    content: value,
    editable: false,
  });

  useEffect(() => {
    editor?.commands.setContent(value);
  }, [value, editor]);

  const finalStyles = useMemo(() => {
    return _.defaultsDeep({}, { content: CommonHTMLContentStyle }, styles);
  }, [styles]);

  return (
    <RichTextEditor editor={editor} styles={finalStyles}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
