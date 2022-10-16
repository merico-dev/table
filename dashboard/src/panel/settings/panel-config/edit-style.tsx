import { Divider, Switch } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { usePanelContext } from '../../../contexts/panel-context';

export const EditStyle = observer(() => {
  const { panel } = usePanelContext();
  const { style } = panel;

  return (
    <>
      <Divider label="Panel Style" labelPosition="center" />
      <Switch
        label="Border"
        checked={style.border.enabled}
        onChange={(event) => style.border.setEnabled(event.currentTarget.checked)}
      />
    </>
  );
});
