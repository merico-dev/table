import { useDashboardContext } from '~/contexts';
import { PanelRenderBase } from './panel-render-base';
import { PanelVizFeatures } from './panel-viz-features';

export interface IClientPanelRenderProps {
  panelId: string;
}

/**
 * Public API to render a panel on the dashboard user side.
 * This component should be rendered by the ReadOnlyDashboard/DashboardEditor component, you can use it with the panel addon.
 * @param props
 * @constructor
 */
export function ClientPanelRender(props: IClientPanelRenderProps) {
  const dashboardModel = useDashboardContext();
  const panel = dashboardModel.content.panels.findByID(props.panelId);
  if (!panel) {
    return null;
  }
  return (
    <PanelVizFeatures withAddon={false} withPanelTitle={false} withInteraction={false}>
      <PanelRenderBase panel={panel} panelStyle={{}} />
    </PanelVizFeatures>
  );
}
