import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { EViewComponentType } from '~/types';
import { SelectWithAddAndEdit } from './select-with-add-and-edit';
const data = [
  {
    label: 'Main',
    value: 'main',
    type: EViewComponentType.Division,
  },
  {
    label: 'Modal of ELOC',
    value: 'modal1',
    type: EViewComponentType.Modal,
  },
  {
    label: 'Modal of Commits',
    value: 'modal2',
    type: EViewComponentType.Modal,
  },
];

export const SwitchViews = observer(() => {
  return <SelectWithAddAndEdit triggerAdd={_.noop} triggerEdit={_.noop} options={data} />;
});
