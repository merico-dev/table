import { IDashboardOperationSchema, ITriggerSchema, VizComponent } from '../../types/plugin';

export const FAKE_TRIGGERS: ITriggerSchema[] = [
  {
    displayName: 'click me',
    id: 'some-plugin:trigger:click',
    payload: [],
    configRender: () => null,
    nameRender: () => null,
  },
  {
    displayName: 'drag me',
    id: 'some-plugin:trigger:drag',
    payload: [],
    configRender: () => null,
    nameRender: () => null,
  },
];

export const FAKE_OPERATIONS: IDashboardOperationSchema[] = [
  {
    id: 'builtin:operation:alert',
    displayName: 'alert',
    configRender: () => null,
    run: () => Promise.resolve(),
  },
];

export const testVizComponent: VizComponent = {
  configRender: () => null,
  createConfig() {
    return 1;
  },
  migrator: null as unknown as VizComponent['migrator'],
  viewRender: () => null,
  name: 'test',
  displayName: 'test',
  triggers: FAKE_TRIGGERS,
};
