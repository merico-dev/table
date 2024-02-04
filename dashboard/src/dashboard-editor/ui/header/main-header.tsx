import { Button, Group, Header as MantineHeader, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useEditDashboardContext } from '~/contexts';
import { ISaveChangesOrMore, SaveChangesOrMore } from './save-changes-or-more';
import { BreakpointSwitcher } from './breakpoint-switcher';

export type OnExitParams = { hasChanges: boolean; dashboardId: string };
export type OnExitCallback = (params: OnExitParams) => void;

export interface IDashbaordEditorHeaderMain extends ISaveChangesOrMore {
  headerSlot?: ReactNode;
  onExit: OnExitCallback;
}

export const MainHeader = observer(
  ({ saveDashboardChanges, onExit, headerSlot = null }: IDashbaordEditorHeaderMain) => {
    const model = useEditDashboardContext();

    const hasChanges = model.content.changed;
    const goBack = () => {
      onExit({ hasChanges, dashboardId: model.id });
    };

    return (
      <MantineHeader height={60} px="md" py={0} sx={{ zIndex: 299 }}>
        <Group position="apart" sx={{ height: 60, minWidth: '1000px', position: 'relative' }}>
          <Group>
            <Button
              size="xs"
              color={hasChanges ? 'red' : 'green'}
              leftIcon={<IconArrowLeft size={20} />}
              onClick={goBack}
            >
              <Group spacing={4}>
                End Editing
                <Text td="underline">{model.name}</Text>
              </Group>
            </Button>

            <SaveChangesOrMore saveDashboardChanges={saveDashboardChanges} />
            <BreakpointSwitcher />
          </Group>
          <Group position="right" sx={{ flexGrow: 1 }}>
            {headerSlot}
          </Group>
        </Group>
      </MantineHeader>
    );
  },
);
