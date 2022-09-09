import { Paper, Stack, Text, Tooltip } from '@mantine/core';
import { IPayloadVariableSchema } from '~/types/plugin';

interface IVariableListProps {
  variables: IPayloadVariableSchema[];
}

export const VariableList = (props: IVariableListProps) => {
  const { variables } = props;
  return (
    <Paper withBorder p="sm">
      <Text size="xs" color="dimmed" mb="sm">
        Variables
      </Text>
      <Stack style={{ maxHeight: '300px' }}>
        {variables.map((it) => (
          <Tooltip position="top-start" label={it.description} key={it.name}>
            <Text size="sm">{it.name}</Text>
          </Tooltip>
        ))}
      </Stack>
    </Paper>
  );
};
