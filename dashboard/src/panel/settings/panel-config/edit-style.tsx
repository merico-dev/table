import { Divider, Switch } from '@mantine/core';
import { usePanelContext } from '../../../contexts/panel-context';

export function EditStyle() {
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
}
