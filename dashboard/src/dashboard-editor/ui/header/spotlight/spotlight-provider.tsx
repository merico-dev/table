import { SpotlightProvider as MantineSpotlightProvider } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useEditDashboardContext } from '~/contexts';
import { SpotlightActionComponent } from './spotlight-action-component';

export const SpotlightProvider = observer(({ children }: { children: ReactNode }) => {
  const model = useEditDashboardContext();
  return (
    <MantineSpotlightProvider
      actions={model.editor.spotlightActions}
      actionComponent={SpotlightActionComponent}
      shortcut={['mod + P', 'mod + K']}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="Search..."
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </MantineSpotlightProvider>
  );
});
