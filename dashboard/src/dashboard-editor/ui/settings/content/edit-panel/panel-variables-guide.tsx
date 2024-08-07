import { Stack, Sx, Tabs } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { IconAlertCircle, IconVariable } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';

type Props = {
  sx?: Sx;
};

export const PanelVariablesGuide = observer(({ sx = {} }: Props) => {
  const { t } = useTranslation();
  const content = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();
  const state = content.dashboardState;

  const variablesString = (() => {
    const ret: Record<string, any> = {
      ...state,
      ...panel.variableStrings,
    };

    return JSON.stringify(ret, null, 2);
  })();

  return (
    <Stack
      sx={{
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Tabs defaultValue="vars" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="guide" icon={<IconAlertCircle size={14} />}>
            {t('panel.variable.guide.tabs.guide')}
          </Tabs.Tab>
          <Tabs.Tab value="vars" icon={<IconVariable size={14} />}>
            {t('panel.variable.guide.tabs.vars')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guide" pt="xs">
          <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
            {t('panel.variable.guide.text')}
          </Prism>
        </Tabs.Panel>

        <Tabs.Panel value="vars" pt="xs">
          <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
            {variablesString}
          </Prism>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
