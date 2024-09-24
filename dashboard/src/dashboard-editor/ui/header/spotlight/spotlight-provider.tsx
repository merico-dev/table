import { observer } from 'mobx-react-lite';
import { SpotlightAction, SpotlightProvider as MantineSpotlightProvider } from '@mantine/spotlight';
import { ReactNode } from 'react';
import { IconDashboard, IconFileText, IconHome, IconSearch } from '@tabler/icons-react';

const actions: SpotlightAction[] = [
  {
    title: 'Home',
    description: 'Get to home page',
    onTrigger: () => console.log('Home'),
    icon: <IconHome size="1.2rem" />,
  },
  {
    title: 'Dashboard',
    description: 'Get full information about current system status',
    onTrigger: () => console.log('Dashboard'),
    icon: <IconDashboard size="1.2rem" />,
  },
  {
    title: 'Documentation',
    description: 'Visit documentation to lean more about all features',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size="1.2rem" />,
  },
];
export const SpotlightProvider = observer(({ children }: { children: ReactNode }) => {
  return (
    <MantineSpotlightProvider
      actions={actions}
      shortcut={['mod + P', 'mod + K']}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="Search..."
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </MantineSpotlightProvider>
  );
});
