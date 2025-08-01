import { observer } from 'mobx-react-lite';

import { useRenderPanelContext } from '~/contexts/panel-context';
import { ViewMetaInstance } from '~/model';
import { useItems } from './use-items';

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { echartsOptions, panel } = useRenderPanelContext();
  const items = useItems(view);
  return items.map((item) => item.render({ echartsOptions, inEditMode: false, panelID: panel.id, viewID: view.id }));
});
