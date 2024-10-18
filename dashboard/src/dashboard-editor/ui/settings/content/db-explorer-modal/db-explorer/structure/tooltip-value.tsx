import { ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export const TooltipValue = ({ value }: { value: string }) => {
  if (value === null || value === '') {
    return null;
  }
  return (
    <Tooltip label={value} disabled={!value} multiline zIndex={340}>
      <ActionIcon variant="subtle">
        <IconInfoCircle size={14} />
      </ActionIcon>
    </Tooltip>
  );
};
