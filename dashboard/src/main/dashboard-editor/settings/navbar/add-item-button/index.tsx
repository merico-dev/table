import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { NavActionType } from '~/model/editor';
import { AddAFilter } from './add-a-filter';
import { AddAQuery } from './add-a-query';
import { AddASQLSnippet } from './add-a-sql-snippet';
import { AddAView } from './add-a-view';

interface IAddItemButton {
  action_type: NavActionType['_action_type'];
}

export const AddItemButton = observer(({ action_type }: IAddItemButton) => {
  const model = useModelContext();

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
  return null;
});
