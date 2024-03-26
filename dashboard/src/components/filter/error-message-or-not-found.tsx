import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface IProps {
  errorMessage?: string;
}

export const ErrorMessageOrNotFound = ({ errorMessage }: IProps) => {
  const { t } = useTranslation();
  if (errorMessage) {
    return (
      <Text color="red" size={12}>
        {errorMessage}
      </Text>
    );
  }
  return (
    <Text color="dimmed" size={12}>
      {t('filter.widget.common.selector_option_empty')}
    </Text>
  );
};
