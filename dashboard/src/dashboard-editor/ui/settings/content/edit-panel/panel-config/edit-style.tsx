import { Checkbox, Divider, Group, NumberInput, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRenderContentModelContext } from '~/contexts';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditStyle = observer(() => {
  const { panel } = useEditPanelContext();
  const layout = useRenderContentModelContext().layouts.findItemByPanelID(panel.id);
  const { style } = panel;

  return (
    <>
      <Divider mb={-10} label="Style" labelPosition="center" variant="dashed" />
      <Stack spacing={20}>
        <Group grow align="top">
          <NumberInput
            label="Width"
            min={1}
            max={36}
            step={1}
            precision={0}
            rightSection={<Text size={12}>of 36 columns</Text>}
            styles={{ rightSection: { width: '110px' } }}
            value={layout.w}
            onChange={(v) => {
              v && layout.setWidth(v);
            }}
          />
          <NumberInput
            label="Height"
            rightSection={<Text size={12}>px</Text>}
            styles={{ rightSection: { width: '40px' } }}
            value={layout.h}
            onChange={(v) => {
              v && layout.setHeight(v);
            }}
          />
        </Group>
        <Checkbox
          ml={6}
          label="Border"
          checked={style.border.enabled}
          onChange={(event) => style.border.setEnabled(event.currentTarget.checked)}
        />
      </Stack>
    </>
  );
});
