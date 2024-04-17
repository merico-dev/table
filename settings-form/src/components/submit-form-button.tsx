import { Button, MantineSize } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Props = {
  size: MantineSize;
  disabled?: boolean;
};
export function SubmitFormButton({ size, disabled }: Props) {
  const { t } = useTranslation();
  return (
    <Button type="submit" color="green" leftIcon={<IconDeviceFloppy size={16} />} size={size} disabled={disabled}>
      {t('settings.common.actions.submit')}
    </Button>
  );
}
