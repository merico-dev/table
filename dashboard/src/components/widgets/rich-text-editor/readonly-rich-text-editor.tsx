import { EmotionSx } from '@mantine/emotion';
import { Link, RichTextEditor, RichTextEditorProps } from '@mantine/tiptap';
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
import { Extensions, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import _ from 'lodash';
import { forwardRef, useEffect, useMemo } from 'react';
import { useIsInRenderPanelContext } from '~/contexts';
import { TDashboardState, VariableAggValueMap } from '~/model';
import { CommonHTMLContentStyle } from '~/styles/common-html-content-style';
import { getEmptyDashboardState } from '~/utils';
import { ColorMappingMark, getColorMappingStyle } from './color-mapping-mark';
import { DynamicColorMark, getDynamicColorStyles } from './dynamic-color-mark';
import { FontSize } from './font-size-extension';

interface IReadonlyRichText {
  value: string;
  styles?: RichTextEditorProps['styles'];
  sx?: EmotionSx;
  dashboardState?: TDashboardState;
  variableAggValueMap?: VariableAggValueMap;
}

export const ReadonlyRichText = forwardRef<HTMLDivElement, IReadonlyRichText>(
  ({ value, styles = {}, sx = {}, dashboardState = getEmptyDashboardState(), variableAggValueMap = {} }, ref) => {
    const inPanelContext = useIsInRenderPanelContext();
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

    const editor = useEditor({
      extensions,
      content: value,
      editable: false,
    });

    useEffect(() => {
      editor?.commands.setContent(value);
    }, [value, editor]);

    const doc = useMemo(() => {
      const parser = new DOMParser();
      return parser.parseFromString(value, 'text/html');
    }, [value]);

    const dynamicColorStyles = useMemo(() => {
      return getDynamicColorStyles(doc, dashboardState, variableAggValueMap);
    }, [doc, dashboardState, variableAggValueMap]);

    const colorMappingStyles = useMemo(() => {
      return getColorMappingStyle(doc, variableAggValueMap);
    }, [doc, variableAggValueMap]);

    const finalStyles = useMemo(() => {
      return _.defaultsDeep(
        {},
        { content: { ...CommonHTMLContentStyle, ...dynamicColorStyles, ...colorMappingStyles } },
        styles,
      );
    }, [styles, dynamicColorStyles, colorMappingStyles]);

    return (
      <RichTextEditor editor={editor} styles={finalStyles} sx={sx}>
        <RichTextEditor.Content ref={ref} />
      </RichTextEditor>
    );
  },
);
