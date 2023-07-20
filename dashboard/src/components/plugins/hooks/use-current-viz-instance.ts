import { useCreation } from 'ahooks';
import { useContext } from 'react';
import { usePanelContext } from '~/contexts';
import { IPanelInfo, PluginContext } from '~/components/plugins';

export const useCurrentVizInstance = () => {
  const { panel } = usePanelContext();
  const { vizManager } = useContext(PluginContext);
  const panelInfo: IPanelInfo = panel.json;

  return useCreation(() => vizManager.getOrCreateInstance(panelInfo), [vizManager, panel.viz.type]);
};
