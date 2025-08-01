import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance, ViewMetaInstance } from '~/model';
import { PanelDropdownMenuItems } from './dropdown-menu-items';
import { PanelRenderBase } from './panel-render-base';

interface IPanel {
  view: ViewMetaInstance;
  panel: PanelRenderModelInstance;
}

function getPanelBorderStyle(panel: PanelRenderModelInstance) {
  if (panel.style.border.enabled) {
    return {};
  }
  return { border: '1px dashed transparent' };
}

export const PanelRender = observer(({ panel, view }: IPanel) => {
  const panelStyle = getPanelBorderStyle(panel);
  return (
    <PanelRenderBase panel={panel} panelStyle={panelStyle} dropdownContent={<PanelDropdownMenuItems view={view} />} />
  );
});
