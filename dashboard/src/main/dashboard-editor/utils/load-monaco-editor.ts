import { loader } from '@monaco-editor/react';

// import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    // @ts-expect-error fixme
    const getWorkerModule = (moduleUrl, label) => {
      // @ts-expect-error fixme
      return new Worker(self.MonacoEnvironment.getWorker(moduleUrl), {
        name: label,
        type: 'module',
      });
    };

    switch (label) {
      case 'typescript':
      case 'javascript':
        return getWorkerModule('/monaco-editor/min/vs/language/typescript/ts.worker?worker', label);
      default:
        return getWorkerModule('/monaco-editor/min/vs/editor/editor.worker?worker', label);
    }
  },
};

export function initMonacoEditor() {
  const loaded = loader.__getMonacoInstance();
  if (!loaded) {
    console.log('loading monaco');
    loader.config({ paths: { vs: '/assets/monaco-editor/min/vs' } });
    loader.init().then((monaco) => console.log('here is the monaco instance:', monaco));
  }
}
