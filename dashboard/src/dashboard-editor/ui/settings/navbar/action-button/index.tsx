import { observer } from 'mobx-react-lite';
import { NavActionType } from '~/dashboard-editor/model/editor';
import { AddAFilter } from './add-a-filter';
import { AddAPanel } from './add-a-panel';
import { AddAQuery } from './add-a-query';
import { AddASQLSnippet } from './add-a-sql-snippet';
import { AddAView } from './add-a-view';
import { QueriesSettingsButton } from './queries-settings-button';

interface Props {
  action_type: NavActionType['_action_type'];
  parentID?: string;
}

export const ActionButton = observer(({ action_type, parentID }: Props) => {
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
  if (action_type === '_QUERIES_SETTINGS_') {
    return <QueriesSettingsButton />;
  }
  return null;
});
