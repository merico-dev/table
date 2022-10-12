import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useModelContext } from '~/contexts';
import { EViewComponentType } from '~/types';
import { SelectWithAddAndEdit } from './select-with-add-and-edit';

export const SwitchViews = observer(() => {
  const model = useModelContext();

  const [opened, setOpened] = useState(false);
  const openEditViewModal = () => {
    setOpened(false);
  };

  return (
    <SelectWithAddAndEdit
      value={model.views.idOfVIE}
      onChange={model.views.setIDOfVIE}
      triggerAdd={model.views.addARandomNewView}
      triggerEdit={openEditViewModal}
      options={model.views.options}
    />
  );
});
