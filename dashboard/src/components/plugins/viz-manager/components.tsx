import { omit } from 'lodash';
import { VizConfigContext, VizContext, VizInstance, VizViewContext } from '~/types/plugin';
import { ITemplateVariable } from '~/utils';
import { JsonPluginStorage } from '../json-plugin-storage';
import { IPanelInfo, IVizManager } from './types';

function createCommonContext(
  instance: VizInstance,
  data: TPanelData,
  vizManager: IVizManager,
  variables: ITemplateVariable[],
): VizContext {
  return {
    vizManager,
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
    variables,
  };
}

export type IViewPanelInfo = IPanelInfo;
export type WidthAndHeight = { w: number; h: number };
export type IViewComponentProps<TDebug = Record<string, unknown>> = {
  panel: IPanelInfo;
  measure: WidthAndHeight;
  data: TPanelData;
  vizManager: IVizManager;
  variables: ITemplateVariable[];
} & TDebug;
export const VizViewComponent = <T,>(props: IViewComponentProps<T>) => {
  const { panel, measure, vizManager, data, variables } = props;
  const comp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizViewContext = {
    ...createCommonContext(instance, data, vizManager, variables),
    viewport: { width: measure.w, height: measure.h },
  };
  const Comp = comp.viewRender;
  return <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data'])} />;
};
export type IConfigComponentProps<TDebug = Record<string, unknown>> = {
  panel: IPanelInfo;
  vizManager: IVizManager;
  variables: ITemplateVariable[];
  data: TPanelData;
} & TDebug;
export const VizConfigComponent = <T,>(props: IConfigComponentProps<T>) => {
  const { vizManager, panel, data, variables } = props;
  const vizComp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizConfigContext = {
    ...createCommonContext(instance, data, vizManager, variables),
  };
  const Comp = vizComp.configRender;
  return <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data'])} />;
};
