import { Editor } from '@mantine/rte';
import { useEffect, useRef } from 'react';

/**
 * Sync external changes to the editor
 * see also https://github.com/mantinedev/mantine/issues/1625#issuecomment-1154506482
 * @param content
 */
export function useSyncEditorContent(content?: string) {
  const editorRef = useRef<Editor>(null);
  useEffect(() => {
    if (content) {
      editorRef.current?.editor?.clipboard?.dangerouslyPasteHTML(content);
    }
  }, [content]);
  return editorRef;
}
