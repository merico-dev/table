import { Code, Paper, Stack, Text } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { IPayloadVariableSchema } from '~/types/plugin';

export interface IVariableListProps {
  variables: IPayloadVariableSchema[];
  title: string;
}

export const VariableList = (props: IVariableListProps) => {
  const { t } = useTranslation();
  const { title = 'Variables', variables } = props;
  const clipboard = useClipboard();
  const handleClick = (valueToCopy: string) => {
    clipboard.copy(valueToCopy);
    showNotification({
      color: 'green',
      message: t('common.copied'),
    });
  };
  return (
    <Paper withBorder p="sm">
      <Text size="xs" color="dimmed" mb="sm">
        {title}
      </Text>
      <Stack style={{ maxHeight: '500px' }}>
        {variables.map((it) => {
          return (
            <Text key={it.name} size="sm">
              <Code color="teal">// {it.description}</Code>
              <br />
              <Code onClick={() => handleClick(it.name)} style={{ cursor: 'pointer' }}>
                {it.name} : {it.valueType}
              </Code>
            </Text>
          );
        })}
      </Stack>
    </Paper>
  );
};
