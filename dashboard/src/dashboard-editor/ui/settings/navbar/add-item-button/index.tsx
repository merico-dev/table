import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';
import { NavActionType } from '~/dashboard-editor/model/editor';
import { AddAFilter } from './add-a-filter';
import { AddAPanel } from './add-a-panel';
import { AddAQuery } from './add-a-query';
import { AddASQLSnippet } from './add-a-sql-snippet';
import { AddAView } from './add-a-view';

interface IAddItemButton {
  action_type: NavActionType['_action_type'];
  parentID?: string;
}

export const AddItemButton = observer(({ action_type, parentID }: IAddItemButton) => {
  const model = useContentModelContext();

  if (action_type === '_Add_A_Filter_') {
    return <AddAFilter />;
  }

  if (action_type === '_Add_A_SQL_SNIPPET_') {
    return <AddASQLSnippet />;
  }

  if (action_type === '_Add_A_QUERY_') {
    return <AddAQuery />;
  }

  if (action_type === '_Add_A_VIEW_') {
    return <AddAView />;
  }

  if (action_type === '_Add_A_PANEL_') {
    return <AddAPanel parentID={parentID} />;
  }
  return null;
});
