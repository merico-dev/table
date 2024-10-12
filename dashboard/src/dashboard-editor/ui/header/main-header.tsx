import { Button, Group, AppShell, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { ISaveChangesOrMore, SaveChangesOrMore } from './save-changes-or-more';

export type OnExitParams = { hasChanges: boolean; dashboardId: string };
export type OnExitCallback = (params: OnExitParams) => void;

export interface IDashbaordEditorHeaderMain extends ISaveChangesOrMore {
  headerSlot?: ReactNode;
  onExit: OnExitCallback;
}

export const MainHeader = observer(
  ({ saveDashboardChanges, onExit, headerSlot = null }: IDashbaordEditorHeaderMain) => {
    const { t } = useTranslation();
    const model = useEditDashboardContext();

    const hasChanges = model.content.changed;
    const goBack = () => {
      onExit({ hasChanges, dashboardId: model.id });
    };

    return (
      <AppShell.Header h={60} px="md" py={0} sx={{ zIndex: 299 }}>
        <Group justify="space-between" sx={{ height: 60, minWidth: '1000px', position: 'relative' }}>
          <Group>
            <Button
              size="xs"
              color={hasChanges ? 'red' : 'green'}
              leftSection={<IconArrowLeft size={20} />}
              onClick={goBack}
            >
              <Group gap={4}>
                <Trans i18nKey="common.actions.end_editing" values={{ name: model.name }}>
                  End Editing <Text td="underline">{model.name}</Text>
                </Trans>
              </Group>
            </Button>

            <SaveChangesOrMore saveDashboardChanges={saveDashboardChanges} />
          </Group>
          <Group justify="flex-end" sx={{ flexGrow: 1 }}>
            {headerSlot}
          </Group>
        </Group>
      </AppShell.Header>
    );
  },
);
