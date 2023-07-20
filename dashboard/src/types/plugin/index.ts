import { EventEmitter2 } from 'eventemitter2';
import React from 'react';
import { IVizManager } from '~/components/plugins';
import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { TRIGGERS_KEY } from '~/interactions';

/**
 * Basic information of a viz component instance
 */
export interface VizInstance {
  id: string;
  name: string;
  type: string;
  messageChannels: IMessageChannels;
  instanceData: PluginStorage;
}

/**
 * Props to render the view of viz component
 */
export interface VizViewProps {
  instance: VizInstance;
  context: VizViewContext;
}

export interface IWatchOptions {
  fireImmediately?: boolean;
}

export interface PluginStorage {
  getItem<T>(key: string | null): Promise<T>;

  setItem<T>(key: string | null, item: T): Promise<T>;

  deleteItem(key: string): Promise<void>;

  watchItem<T>(key: string | null, callback: (value: T, previous?: T) => void, options?: IWatchOptions): () => void;
}

export interface IColorPaletteItem {
  name: string;
  type: string;
  category: string;
}

export interface ISingleColor extends IColorPaletteItem {
  type: 'single';
  value: string;
}

export interface IColorInterpolation extends IColorPaletteItem {
  type: 'interpolation';
  displayName: string;
  /**
   * Map a value (0-100) to a color
   * @param value
   */
  getColor: (value: number) => string;
}

export interface ColorPalette {
  getColor(colorInfo: IColorPaletteItem): (value: unknown) => string;
}

export interface IMessageChannels {
  globalChannel: EventEmitter2;

  getChannel(name: string): EventEmitter2;
}

export interface VizContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
  colorPalette: ColorPalette;
  variables: ITemplateVariable[];
  locale: string;
  msgChannels: IMessageChannels;
  data: TPanelData;
  vizManager: IVizManager;
}

type Setter<T> = (val: T) => void;

export interface IPanelInfoEditor {
  setTitle: Setter<string>;
  setDescription: Setter<string>;
  addQueryID: Setter<string>;
  removeQueryID: Setter<string>;
}

export interface VizConfigContext extends VizContext {
  panelInfoEditor: IPanelInfoEditor;
}

export interface VizViewContext extends VizContext {
  viewport: { width: number; height: number };
}

export interface VizConfigProps {
  instance: VizInstance;
  context: VizConfigContext;
}

export interface IConfigMigrationContext {
  configData: PluginStorage;
}

export interface IConfigMigrationExecContext extends IConfigMigrationContext {
  panelModel: PanelModelInstance;
}

export interface VizComponent {
  name: string;
  displayName?: string;
  displayGroup?: string;
  viewRender: React.ComponentType<VizViewProps>;
  configRender: React.ComponentType<VizConfigProps>;
  migrator: IPanelScopeConfigMigrator;
  createConfig: () => {
    version: number;
    config: AnyObject;
  };
  triggers?: ITriggerSchema[];
}

export interface IPanelScopeConfigMigrator {
  needMigration(ctx: IConfigMigrationContext): Promise<boolean>;

  migrate(ctx: IConfigMigrationExecContext): Promise<void>;
}

export interface IConfigMigrator extends IPanelScopeConfigMigrator {
  migrate(ctx: IConfigMigrationContext): Promise<void>;
}

export interface IPluginManifest {
  viz: VizComponent[];
  color: IColorPaletteItem[];
}

export interface IDashboardPlugin {
  id: string;
  version: string;
  manifest: IPluginManifest;
}

export interface IPluginManager {
  install(plugin: IDashboardPlugin): void;

  installedPlugins: IDashboardPlugin[];

  factory: {
    viz: (name: string) => VizComponent;
  };
}

export interface IPayloadVariableSchema {
  name: string;
  description: string;
  valueType: 'string' | 'number' | 'object';
}

export interface IInteractionConfigProps {
  instance: VizInstance;
}

export interface ITriggerConfigProps extends IInteractionConfigProps {
  trigger: ITrigger;
  sampleData: TPanelData;
}

export interface IOperationConfigProps extends IInteractionConfigProps {
  operation: IDashboardOperation;
  variables: IPayloadVariableSchema[];
}

export interface ITriggerSchema {
  id: string;
  displayName: string;
  payload: IPayloadVariableSchema[];
  configRender: React.ComponentType<ITriggerConfigProps>;
  nameRender: React.ComponentType<Omit<ITriggerConfigProps, 'sampleData'>>;
  createDefaultConfig?: () => AnyObject;
  migrator?: IConfigMigrator;
}

export interface ITrigger {
  id: string;
  schemaRef: string;
  triggerData: PluginStorage;
}

/**
 * A readonly snapshot of a trigger
 */
export interface ITriggerSnapshot<TConfig> {
  id: string;
  schemaRef: string;
  config: TConfig;
}

export interface IVizTriggerManager {
  getTriggerSchemaList(): ITriggerSchema[];

  getTriggerList(): Promise<ITrigger[]>;

  removeTrigger(triggerId: string): Promise<void>;

  createOrGetTrigger(id: string, schema: ITriggerSchema): Promise<ITrigger>;

  retrieveTrigger(id: string): Promise<ITrigger | undefined>;

  watchTriggerSnapshotList(callback: (triggerList: ITriggerSnapshot<AnyObject>[]) => void): () => void;
  needMigration(): Promise<boolean>;
  runMigration(): Promise<void>;
}

export interface IDashboardOperationSchema {
  id: string;
  displayName: string;
  configRender: React.ComponentType<IOperationConfigProps>;
  run: (payload: Record<string, unknown>, operation: IDashboardOperation) => Promise<void>;
  // todo: remove optional modifier
  migrator?: IConfigMigrator;
  createDefaultConfig?: () => AnyObject;
}

export interface IDashboardOperation {
  id: string;
  schemaRef: string;
  operationData: PluginStorage;
}

export interface IVizOperationManager {
  getOperationSchemaList(): IDashboardOperationSchema[];

  getOperationList(): Promise<IDashboardOperation[]>;

  removeOperation(operationId: string): Promise<void>;

  createOrGetOperation(id: string, schema: IDashboardOperationSchema): Promise<IDashboardOperation>;

  runOperation(operationId: string, payload: Record<string, unknown>): Promise<void>;

  retrieveTrigger(operationId: string): Promise<IDashboardOperation | undefined>;

  runMigration(): Promise<void>;
  needMigration(): Promise<boolean>;
}

export interface IVizInteraction {
  id: string;
  triggerRef: string;
  operationRef: string;
}

export interface IVizInteractionManager {
  triggerManager: IVizTriggerManager;
  operationManager: IVizOperationManager;

  getInteractionList(): Promise<IVizInteraction[]>;

  addInteraction(trigger: ITrigger, operation: IDashboardOperation): Promise<void>;

  removeInteraction(interactionId: string): Promise<void>;

  runInteraction(triggerId: string, payload: Record<string, unknown>): Promise<void>;
}

export interface IValueStep {
  from: number;
  to: number;
}

export interface IColorInterpolationConfig {
  steps: IValueStep[];
  interpolation: string;
}
