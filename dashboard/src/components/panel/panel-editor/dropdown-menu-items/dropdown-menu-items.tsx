import { observer } from 'mobx-react-lite';

import { useRenderPanelContext } from '~/contexts/panel-context';
import { ViewMetaInstance } from '~/model';
import { useItems } from './use-items';

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { getEchartsOptions, panel } = useRenderPanelContext();
  const echartsOptions = getEchartsOptions();
  const items = useItems(view);
  return items.map((item) => item.render({ echartsOptions, inEditMode: true, panelID: panel.id, viewID: view.id }));
});
