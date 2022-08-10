import { omit } from 'lodash';
import { IPanelInfoEditor, VizConfigContext, VizContext, VizViewContext } from '../../types/plugin';
import { JsonPluginStorage } from '../json-plugin-storage';
import { IPanelInfo, IVizManager, VizInstanceInfo } from './types';

function createCommonContext(instance: VizInstanceInfo, data: any): VizContext {
  return {
    /**
     * todo: locale not implemented
     */
    locale: 'zh',
    msgChannels: instance.messageChannels,
    instanceData: instance.instanceData,
    /**
     * todo: implement plugin scope storage, that is shared
     * between instances
     */
    pluginData: new JsonPluginStorage({}),
    /**
     * todo: color palette not implemented
     */
    colorPalette: {
      getColor() {
        return () => '';
      },
    },
    data,
  };
}

export type IViewPanelInfo = IPanelInfo & { layout: { w: number; h: number } };
export type IViewComponentProps<TDebug = {}> = { panel: IViewPanelInfo; data: any; vizManager: IVizManager } & TDebug;
export const VizViewComponent = <T,>(props: IViewComponentProps<T>) => {
  const { panel, vizManager, data } = props;
  const comp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizViewContext = {
    ...createCommonContext(instance, data),
    viewport: { width: panel.layout.w, height: panel.layout.h },
  };
  const Comp = comp.viewRender;
  return <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data'])} />;
};
type IConfigComponentProps<TDebug = {}> = {
  panel: IPanelInfo;
  panelInfoEditor: IPanelInfoEditor;
  vizManager: IVizManager;
  data: any;
} & TDebug;
export const VizConfigComponent = <T,>(props: IConfigComponentProps<T>) => {
  const { vizManager, panel, panelInfoEditor, data } = props;
  const vizComp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizConfigContext = {
    ...createCommonContext(instance, data),
    panelInfoEditor: panelInfoEditor,
  };
  const Comp = vizComp.configRender;
  return (
    <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data', 'panelInfoEditor'])} />
  );
};
