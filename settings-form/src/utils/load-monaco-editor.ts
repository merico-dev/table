import { loader } from '@monaco-editor/react';

import * as monaco from 'monaco-editor';

export function initMonacoEditor() {
  const loaded = loader.__getMonacoInstance();
  if (!loaded) {
    console.log('loading monaco');
    loader.config({ monaco, paths: { vs: '/assets/monaco-editor/min/vs' } });
    loader.init().then((monaco) => console.log('here is the monaco instance:', monaco));
  }
}
