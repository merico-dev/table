import { IPanelAddon, IPanelAddonRenderProps, IPluginManager } from '~/types/plugin';
import React from 'react';

export class PanelAddonManager {
  constructor(private pluginManager: IPluginManager) {}

  createPanelAddonNode(props: IPanelAddonRenderProps) {
    const addons = this.pluginManager.installedPlugins
      .flatMap((it) => it.manifest.panelAddon)
      .filter((it) => !!it) as IPanelAddon[];
    const nodes = addons.map((addon) => {
      return React.createElement(addon.addonRender, { ...props, key: addon.name });
    });
    return <>{nodes}</>;
  }
}
