import { Checkbox, Divider, Group, NumberInput, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderContentModelContext } from '~/contexts';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditStyle = observer(() => {
  const { t } = useTranslation();
  const { panel } = useEditPanelContext();
  const layout = useRenderContentModelContext().layouts.findItemByPanelID(panel.id);
  const { style } = panel;

  return (
    <>
      <Divider mb={-10} label={t('panel.style.label')} labelPosition="center" variant="dashed" />
      <Stack spacing={20}>
        <Group grow align="top">
          <NumberInput
            label={t('panel.style.width')}
            min={1}
            max={36}
            step={1}
            precision={0}
            rightSection={<Text size={12}>{t('panel.style.width_postfix')}</Text>}
            styles={{
              rightSection: { width: 'auto', maxWidth: '100px', paddingRight: '14px', justifyContent: 'flex-end' },
            }}
            value={layout.w}
            onChange={(v) => {
              v && layout.setWidth(v);
            }}
          />
          <NumberInput
            label={t('panel.style.height')}
            rightSection={<Text size={12}>{t('panel.style.height_postfix')}</Text>}
            styles={{ rightSection: { width: '40px' } }}
            value={layout.h}
            onChange={(v) => {
              v && layout.setHeight(v);
            }}
          />
        </Group>
        <Checkbox
          ml={6}
          label={t('panel.style.border')}
          checked={style.border.enabled}
          onChange={(event) => style.border.setEnabled(event.currentTarget.checked)}
        />
      </Stack>
    </>
  );
});
