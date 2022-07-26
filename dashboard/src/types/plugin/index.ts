import EventEmitter2 from 'eventemitter2';
import React from 'react';

/**
 * Basic information of a viz component instance
 */
export interface VizInstance {
  id: string;
  name: string;
}

/**
 * Props to render the view of viz component
 */
export interface VizViewProps {
  instance: VizInstance;
  context: VizViewContext;
}

export interface PluginStorage {
  getItem<T>(key: string): Promise<T>;

  setItem<T>(key: string, item: T): Promise<T>;

  deleteItem(key: string): Promise<void>;
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
}

export interface VizContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
  colorPalette: ColorPalette;
  locale: string;
  msgChannels: IMessageChannels;
}

export interface VizConfigContext extends VizContext {
}

export interface VizViewContext extends VizContext {
  viewport: { width: string; height: string; };
  data: unknown;
}

export interface VizConfigProps {
  instance: VizInstance;
  context: VizConfigContext;
}

export interface VizComponentMigrationContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
}

export interface VizComponent {
  name: string;
  viewRender: React.ComponentType<VizViewProps>;
  configRender: React.ComponentType<VizConfigProps>;
  migration: (ctx: VizComponentMigrationContext) => Promise<void>;
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

  factory: {
    viz: (name: string) => VizComponent;
  };
}
