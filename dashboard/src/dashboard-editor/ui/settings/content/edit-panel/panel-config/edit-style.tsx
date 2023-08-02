import { Switch } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditStyle = observer(() => {
  const { panel } = useEditPanelContext();
  const { style } = panel;

  return (
    <>
      <Switch
        label="Border"
        checked={style.border.enabled}
        onChange={(event) => style.border.setEnabled(event.currentTarget.checked)}
      />
    </>
  );
});
