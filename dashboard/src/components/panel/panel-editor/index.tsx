import { observer } from 'mobx-react-lite';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { ViewMetaInstance } from '~/model';
import { PanelDropdownMenu } from '../panel-render/dropdown-menu';
import { PanelRenderBase } from '../panel-render/panel-render-base';

interface IPanel {
  view: ViewMetaInstance;
  panel: PanelModelInstance;
}

const hoverBorder = {
  border: '1px dashed transparent',
  transition: 'border-color 300ms ease',
  '&:hover': {
    borderColor: '#e9ecef',
  },
};

function getPanelBorderStyle(panel: PanelModelInstance) {
  if (panel.style.border.enabled) {
    return {};
  }

  return hoverBorder;
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const panelStyle = getPanelBorderStyle(panel);
  return <PanelRenderBase panel={panel} panelStyle={panelStyle} dropdownContent={<PanelDropdownMenu view={view} />} />;
});
