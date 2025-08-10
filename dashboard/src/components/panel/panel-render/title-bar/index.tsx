import { Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRenderPanelContext } from '~/contexts';

export const PanelTitleBar = observer(function _PanelTitleBar() {
  const { panel } = useRenderPanelContext();
  const { name, title } = panel;

  if (!title.show) {
    return null;
  }
  return (
    <Group data-testid="panel-title-bar" grow justify="center" className="panel-title-wrapper" sx={{ flexGrow: 1 }}>
      <Text size="sm" ta="center" lineClamp={1} className="panel-title-text">
        {name}
      </Text>
    </Group>
  );
});
