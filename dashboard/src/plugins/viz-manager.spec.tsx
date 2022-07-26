import { waitFor } from '@testing-library/react';
import {
  IDashboardPlugin,
  VizComponent,
  VizConfigProps,
  VizViewProps
} from '../types/plugin';
import { useStorageData } from './hooks/use-storage-data';
import { PluginManager } from './plugin-manager';
import { render, screen } from '../test/test-utils';

import { IVizManager, VizManager } from './viz-manager';

const MockViz: VizComponent = {
  name: 'mock',
  viewRender: ({ context: { instanceData } }: VizViewProps) => {
    const { value: name } = useStorageData<string>(instanceData, 'name');
    return <span>Hello, {name}</span>;
  },
  configRender: ({}: VizConfigProps) => {
    return <span>World</span>;
  },
  migration: async () => {
  }
};
const mockPanel = {
  id: '001',
  viz: { type: 'mock', conf: { name: 'alice' } },
  layout: { x: 0, y: 0, w: 100, h: 100 },
  title: 'hello',
  queryID: 'queryId',
  description: 'desc'
};

describe('VizManager', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    const pluginManager = new PluginManager();
    vizManager = new VizManager(pluginManager);
    pluginManager.install({
      id: 'mock-plugin',
      version: '1',
      manifest: { viz: [MockViz], color: [] }
    } as IDashboardPlugin);
  });
  test('create view', async () => {
    const view = vizManager.createVizView(mockPanel);
    render(<>{view}</>);
    await waitFor(() => {
      expect(screen.getByText('Hello, alice')).toBeInTheDocument();
    });
  });
  test('create config', async () => {
    const configPanel = vizManager.createVizConfig(mockPanel);
    render(<>{configPanel}</>);
    await waitFor(() => {
      expect(screen.getByText('World')).toBeInTheDocument();
    });
  });
});
