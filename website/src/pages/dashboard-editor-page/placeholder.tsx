import { Button, Center, Text } from '@mantine/core';

export function LoadingPlaceholder({
  dashboardLoading,
  contentLoading,
}: {
  dashboardLoading: boolean;
  contentLoading: boolean;
}) {
  return (
    <Center style={{ height: '60vh' }}>
      {!dashboardLoading && 'Loading dashboard...'}
      {!contentLoading && 'Loading content...'}
    </Center>
  );
}

export function NeedToInitializeContent() {
  return (
    <Center style={{ height: '60vh' }}>
      <Text>This dashboard is not initialized and is empty</Text>
      <Button variant="light" size="lg" style={{ marginTop: 20 }}>
        Initialize
      </Button>
    </Center>
  );
}
