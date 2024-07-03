import { Alert, Box, Button, List, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, forwardRef } from 'react';
import { AnyObject } from '~/types';
import { InlineFunctionInput } from '../inline-function-input';

type Props = {
  title: string;
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  description?: ReactNode;
  triggerLabel?: string;
  triggerButtonProps?: AnyObject;
  renderTriggerButton?: ({ onClick }: { onClick: () => void }) => ReactNode;
  zIndex?: number;
};

export const ModalFunctionEditor = forwardRef(
  (
    {
      title,
      value,
      onChange,
      label,
      description = null,
      triggerLabel = 'Edit',
      triggerButtonProps = {},
      renderTriggerButton,
      defaultValue,
      zIndex = 320,
    }: Props,
    _ref: any,
  ) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal opened={opened} onClose={close} title={title} withinPortal zIndex={zIndex} size="900px">
          {description}
          <Box h={600}>
            <InlineFunctionInput value={value} onChange={onChange} defaultValue={defaultValue} label={label} />
          </Box>
        </Modal>

        {renderTriggerButton?.({ onClick: open })}
        {!renderTriggerButton && (
          <Button onClick={open} {...triggerButtonProps}>
            {triggerLabel}
          </Button>
        )}
      </>
    );
  },
);
