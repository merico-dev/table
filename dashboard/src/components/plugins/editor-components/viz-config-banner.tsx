import { ActionIcon, Group, Text } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import React, { memo } from 'react';
import { Control, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  canSubmit: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

export function VizConfigBanner({ canSubmit, buttonRef }: Props) {
  const { t } = useTranslation();
  return (
    <Group justify="flex-start" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
      <Text size="sm">{t('viz.viz_config_banner')}</Text>
      <ActionIcon ref={buttonRef} type="submit" mr={5} variant="filled" color="blue" disabled={!canSubmit}>
        <IconDeviceFloppy size={20} />
      </ActionIcon>
    </Group>
  );
}

type FormVizConfigBannerProps = {
  control: Control<$TSFixMe>;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

export const FormVizConfigBanner = memo(({ control, buttonRef }: FormVizConfigBannerProps) => {
  const { isDirty, isValid } = useFormState({ control });
  return <VizConfigBanner canSubmit={isDirty && isValid} buttonRef={buttonRef} />;
});
