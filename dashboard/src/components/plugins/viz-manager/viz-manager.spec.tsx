import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { render, screen } from '~/test/test-utils';
import { IDashboardPlugin, VizComponent, VizConfigProps, VizViewProps } from '~/types/plugin';
import { useStorageData } from '../hooks';
import { PluginManager } from '../plugin-manager';
import { VizManager } from './impl';

import { VizConfigComponent, VizViewComponent } from './components';
import { IVizManager } from './types';

const MockViz = (name = 'mock') =>
  ({
    name,
    viewRender: (props: VizViewProps & { helper?: MockVizHelper }) => {
      const {
        context: { instanceData },
        helper,
      } = props;
      helper?.onViewRender(props);
      const { value: name } = useStorageData<string>(instanceData, 'name');
      return <span>Hello, {name}</span>;
    },
    configRender: (props: VizConfigProps & { helper?: MockVizHelper }) => {
      const { helper } = props;
      helper?.onConfigRender(props);
      return <span>World</span>;
    },
    migration: {},
  } as unknown as VizComponent);
const mockPanel = {
  id: '001',
  viz: { type: 'mock', conf: { name: 'alice' } },
  layout: { x: 0, y: 0, w: 100, h: 100 },
  title: 'hello',
  queryID: 'queryId',
  description: 'desc',
};

class MockVizHelper {
  viewProps: VizViewProps | undefined;
  configProps: VizConfigProps | undefined;
  data?: unknown;

  onViewRender(props: VizViewProps) {
    this.viewProps = props;
    this.data = props.context.data;
  }

  onConfigRender(props: VizConfigProps) {
    this.configProps = props;
  }
}

const MEASURE = {
  w: 800,
  h: 600,
};
type IMockVizDebugProps = { helper: MockVizHelper };

describe('VizManager', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    const pluginManager = new PluginManager();
    vizManager = new VizManager(pluginManager);
    pluginManager.install({
      id: 'mock-plugin',
      version: '1',
      manifest: {
        viz: [MockViz(), MockViz('viz2')],
        color: [],
      },
    } as IDashboardPlugin);
  });
  test('create view', async () => {
    render(<VizViewComponent panel={mockPanel} measure={MEASURE} data={[]} vizManager={vizManager} />);
    await waitFor(() => {
      expect(screen.getByText('Hello, alice')).toBeInTheDocument();
    });
  });
  test('create config', async () => {
    render(<VizConfigComponent panel={mockPanel} measure={MEASURE} vizManager={vizManager} data={[]} />);
    await waitFor(() => {
      expect(screen.getByText('World')).toBeInTheDocument();
    });
  });

  test('share message channels between view and config panel', async () => {
    const vizInstance = new MockVizHelper();
    render(
      <VizViewComponent<IMockVizDebugProps>
        helper={vizInstance}
        panel={mockPanel}
        measure={MEASURE}
        data={[]}
        vizManager={vizManager}
      />,
    );
    render(
      <VizConfigComponent<IMockVizDebugProps>
        helper={vizInstance}
        panel={mockPanel}
        measure={MEASURE}
        vizManager={vizManager}
        data={[]}
      />,
    );
    await waitFor(() => {
      const { configProps, viewProps } = vizInstance;
      expect(viewProps?.context.msgChannels).toBeTruthy();
      expect(configProps?.context.msgChannels).toBe(viewProps?.context.msgChannels);
    });
  });

  test('create new message channels for each instance', async () => {
    const viz1 = new MockVizHelper();
    const viz2 = new MockVizHelper();
    render(<VizViewComponent helper={viz1} panel={mockPanel} measure={MEASURE} data={[]} vizManager={vizManager} />);
    render(
      <VizViewComponent
        helper={viz2}
        panel={{
          ...mockPanel,
          id: 'another',
          viz: { ...mockPanel.viz, type: 'viz2' },
        }}
        measure={MEASURE}
        data={[]}
        vizManager={vizManager}
      />,
    );
    await waitFor(() => {
      expect(viz1.viewProps?.context.msgChannels).not.toBe(viz2.viewProps?.context.msgChannels);
    });
  });

  test('provide data through context', async () => {
    const viz1 = new MockVizHelper();
    render(
      <VizViewComponent helper={viz1} panel={mockPanel} measure={MEASURE} data={[1, 2, 3]} vizManager={vizManager} />,
    );
    // wait until it rendered
    await waitFor(() => {
      expect(screen.getByText('Hello, alice')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(viz1.data).toStrictEqual([1, 2, 3]);
    });
  });
});
