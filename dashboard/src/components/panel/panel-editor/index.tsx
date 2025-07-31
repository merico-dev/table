import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance, ViewMetaInstance } from '~/model';
import { PanelDropdownMenu } from './dropdown-menu';
import { PanelRenderBase } from '../panel-render/panel-render-base';

interface IPanel {
  view: ViewMetaInstance;
  panel: PanelRenderModelInstance;
}

const hoverBorder = {
  border: '1px dashed transparent',
  transition: 'border-color 300ms ease',
  '&:hover': {
    borderColor: '#e9ecef',
  },
};

function getPanelBorderStyle(panel: PanelRenderModelInstance) {
  if (panel.style.border.enabled) {
    return {};
  }

  return hoverBorder;
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const panelStyle = getPanelBorderStyle(panel);
  return <PanelRenderBase panel={panel} panelStyle={panelStyle} dropdownContent={<PanelDropdownMenu view={view} />} />;
});
