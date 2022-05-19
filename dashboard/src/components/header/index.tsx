import { Group, Header as MantineHeader, Text } from '@mantine/core'
import { MericoLogo } from './merico-logo';

export function Header() {
  return (
    <MantineHeader height={60} p="md">
      <Group>
        <MericoLogo width={40} />
        <Text size="xl" >Dashboard</Text>
      </Group>
    </MantineHeader>
  )
}