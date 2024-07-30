import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GradientColorName } from './gradient-color-mark';
import { parseGradientColorAttrs } from './utils';

export const GradientColorControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const attrs = editor.getAttributes(GradientColorName);
  const defaultValue = useMemo(() => {
    return parseGradientColorAttrs(attrs);
  }, [attrs]);
  console.log(defaultValue);
  return <>TODO</>;
};
