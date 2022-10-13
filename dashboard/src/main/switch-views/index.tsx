import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useModelContext } from '~/contexts';
import { EditViewModal } from './edit-view-modal';
import { SelectWithAddAndEdit } from './select-with-add-and-edit';

export const SwitchViews = observer(() => {
  const model = useModelContext();

  const [opened, setOpened] = useState(false);
  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  return (
    <>
      <SelectWithAddAndEdit
        value={model.views.idOfVIE}
        onChange={model.views.setIDOfVIE}
        triggerAdd={model.views.addARandomNewView}
        triggerEdit={open}
        options={model.views.options}
      />
      <EditViewModal opened={opened} close={close} />
    </>
  );
});
