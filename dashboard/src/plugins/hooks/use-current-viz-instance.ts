import { useCreation } from 'ahooks';
import { useContext } from 'react';
import { PanelContext } from '~/contexts';
import { IPanelInfo, PluginContext } from '~/plugins';

export const useCurrentVizInstance = () => {
  const { viz, title, id, queryID, description } = useContext(PanelContext);
  const { vizManager } = useContext(PluginContext);
  const panelInfo: IPanelInfo = {
    title,
    description,
    id,
    queryID,
    viz,
  };

  return useCreation(() => vizManager.getOrCreateInstance(panelInfo), [vizManager, viz.type]);
};
