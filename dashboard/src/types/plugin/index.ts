import EventEmitter2 from 'eventemitter2';
import React from 'react';

/**
 * Basic information of a viz component instance
 */
export interface VizInstance {
  id: string;
  name: string;
  type: string;
}

/**
 * Props to render the view of viz component
 */
export interface VizViewProps {
  instance: VizInstance;
  context: VizViewContext;
}

export interface PluginStorage {
  getItem<T>(key: string | null): Promise<T>;

  setItem<T>(key: string | null, item: T): Promise<T>;

  deleteItem(key: string): Promise<void>;

  watchItem<T>(key: string | null, callback: (value: T, previous?: T) => void): () => void;
}

export interface ColorPaletteItem {
  name: string;
  type: string;
  category: string;
}

export interface SingleColor extends ColorPaletteItem {
  type: 'single';
  value: string;
}

export interface ColorInterpolation extends ColorPaletteItem {
  type: 'interpolation';
  interpolation: (value: number) => string;
}

export interface ColorPalette {
  getColor(colorInfo: ColorPaletteItem): (value: unknown) => string;
}

export interface IMessageChannels {
  globalChannel: EventEmitter2;

  getChannel(name: string): EventEmitter2;

  close(name: string): void;
}

export interface VizContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
  colorPalette: ColorPalette;
  locale: string;
  msgChannels: IMessageChannels;
  data: unknown;
}

type Setter<T> = (val: string) => void;

export interface IPanelInfoEditor {
  setTitle: Setter<string>;
  setDescription: Setter<string>;
  setQueryID: Setter<string>;
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

export interface VizComponentMigrationContext {
  instanceData: PluginStorage;
}

export interface VizComponent {
  name: string;
  displayName?: string;
  viewRender: React.ComponentType<VizViewProps>;
  configRender: React.ComponentType<VizConfigProps>;
  migrator: IVizComponentMigrator;
}

export interface IVizComponentMigrator {
  needMigration(ctx: VizComponentMigrationContext): Promise<boolean>;

  migrate(ctx: VizComponentMigrationContext): Promise<void>;
}

export interface IPluginManifest {
  viz: VizComponent[];
  color: ColorPaletteItem[];
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
