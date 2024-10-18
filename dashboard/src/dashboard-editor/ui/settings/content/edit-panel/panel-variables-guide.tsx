import { CodeHighlight } from '@mantine/code-highlight';
import { Stack, Tabs } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconAlertCircle, IconVariable } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';

type Props = {
  sx?: EmotionSx;
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
          <Tabs.Tab value="guide" leftSection={<IconAlertCircle size={14} />}>
            {t('panel.variable.guide.tabs.guide')}
          </Tabs.Tab>
          <Tabs.Tab value="vars" leftSection={<IconVariable size={14} />}>
            {t('panel.variable.guide.tabs.vars')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guide" pt="xs">
          <CodeHighlight
            language="sql"
            sx={{ width: '100%' }}
            withCopyButton={false}
            code={t('panel.variable.guide.text')}
          />
        </Tabs.Panel>

        <Tabs.Panel value="vars" pt="xs">
          <CodeHighlight language="json" sx={{ width: '100%' }} withCopyButton={false} code={variablesString} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
