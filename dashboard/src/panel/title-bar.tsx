import { Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { usePanelContext } from '../contexts/panel-context';
import './title-bar.css';

export const PanelTitleBar = observer(function _PanelTitleBar() {
  const { panel } = usePanelContext();
  const { title } = panel;

  if (!title) {
    return null;
  }
  return (
    <Group grow position="center" px={20} className="panel-title-wrapper" sx={{ flexGrow: 1 }}>
      <Text align="center" lineClamp={1} weight="bold">
        {title}
      </Text>
    </Group>
  );
});
