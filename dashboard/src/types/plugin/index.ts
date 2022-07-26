import EventEmitter2 from 'eventemitter2';
import React from 'react';

/**
 * Basic information of a viz component instance
 */
interface VizInstance {
  id: string;
  name: string;
}

/**
 * Props to render the view of viz component
 */
interface VizViewProps {
  instance: VizInstance;
  context: VizViewContext;
}

interface PluginStorage {
  getItem<T>(key: string): Promise<T>;

  setItem<T>(key: string, item: T): Promise<T>;

  deleteItem(key: string): Promise<void>;
}

interface ColorPaletteItem {
  name: string;
  type: string;
  category: string;
}

interface SingleColor extends ColorPaletteItem {
  type: 'single';
  value: string;
}

interface ColorInterpolation extends ColorPaletteItem {
  type: 'interpolation';
  interpolation: (value: number) => string;
}

interface ColorPalette {
  getColor(colorInfo: ColorPaletteItem): (value: unknown) => string;
}

interface IMessageChannels {
  globalChannel: EventEmitter2;
  getChannel(name: string): EventEmitter2;
}

interface VizContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
  colorPalette: ColorPalette;
  locale: string;
  msgChannels: IMessageChannels;
}

interface VizConfigContext extends VizContext {
}

interface VizViewContext extends VizContext {
  viewport: { width: string; height: string; };
  data: unknown;
}

interface VizConfigProps {
  instance: VizInstance;
  context: VizConfigContext;
}

interface VizComponentMigrationContext {
  pluginData: PluginStorage;
  instanceData: PluginStorage;
}

interface VizComponent {
  name: string;
  viewRender: React.Component<VizViewProps>;
  configRender: React.Component<VizConfigProps>;
  migration: (ctx: VizComponentMigrationContext) => Promise<void>;
}

export interface PluginManifest {
  viz: VizComponent[];
  color: ColorPaletteItem[];
}

export interface DashboardPlugin {
  id: string;
  version: string;
  manifest: PluginManifest;
}

interface PluginManager {
  install(plugin: DashboardPlugin): void;

  factory: {
    viz: (name: string) => VizComponent;
  };
}
