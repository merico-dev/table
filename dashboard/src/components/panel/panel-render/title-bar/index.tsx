import { Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRenderPanelContext } from '~/contexts';
import './index.css';

export const PanelTitleBar = observer(function _PanelTitleBar() {
  const { panel } = useRenderPanelContext();
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
