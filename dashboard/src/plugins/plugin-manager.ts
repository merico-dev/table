import { IDashboardPlugin, IPluginManager, VizComponent } from '~/types/plugin';

export class PluginManager implements IPluginManager {
  /**
   * Id to plugin map
   * @private
   */
  private plugins: Map<string, IDashboardPlugin> = new Map();
  /**
   * Name to component map
   */
  private vizComponents: Map<string, VizComponent> = new Map<string, VizComponent>();

  factory = {
    viz: (name: string) => {
      const vizComponent = this.vizComponents.get(name);
      if (vizComponent) {
        return vizComponent;
      }
      throw new Error(`Viz Component (${name}) not found`);
    },
  };

  install(plugin: IDashboardPlugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin (${plugin.id}) has been installed before`);
    }
    this.plugins.set(plugin.id, plugin);
    for (const vizComp of plugin.manifest.viz) {
      if (this.vizComponents.has(vizComp.name)) {
        throw new Error(`Viz Component (${vizComp.name}) has been installed before`);
      }
      this.vizComponents.set(vizComp.name, vizComp);
    }
  }

  get installedPlugins(): IDashboardPlugin[] {
    return Array.from(this.plugins.values());
  }
}

// todo: text viz component plugin
