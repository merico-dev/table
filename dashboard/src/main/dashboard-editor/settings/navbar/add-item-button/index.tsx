import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { NavActionType, NavOptionType } from '~/model/editor';
import { AddAFilter } from './add-a-filter';

interface IAddItemButton {
  action_type: NavActionType['_action_type'];
}

export const AddItemButton = observer(({ action_type }: IAddItemButton) => {
  const model = useModelContext();

  if (action_type === '_Add_A_Filter_') {
    return <AddAFilter />;
  }
  return null;
});
