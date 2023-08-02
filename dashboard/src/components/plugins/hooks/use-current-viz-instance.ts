import { useCreation } from 'ahooks';
import { useContext } from 'react';
import { IPanelInfo, PluginContext } from '~/components/plugins';
import { useRenderPanelContext } from '~/contexts';

export const useCurrentVizInstance = () => {
  const { panel } = useRenderPanelContext();
  const { vizManager } = useContext(PluginContext);
  const panelInfo: IPanelInfo = panel.json;

  return useCreation(() => vizManager.getOrCreateInstance(panelInfo), [vizManager, panel.viz.type]);
};
