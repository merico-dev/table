import { Text } from '@mantine/core';

interface IProps {
  errorMessage?: string;
}

export const ErrorMessageOrNotFound = ({ errorMessage }: IProps) => {
  if (errorMessage) {
    return (
      <Text color="red" size={12}>
        {errorMessage}
      </Text>
    );
  }
  return (
    <Text color="dimmed" size={12}>
      Not found
    </Text>
  );
};
