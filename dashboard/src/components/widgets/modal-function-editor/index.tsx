import { Box, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { forwardRef } from 'react';
import { InlineFunctionInput } from '../inline-function-input';
import { AnyObject } from '~/types';

interface Props {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  triggerLabel?: string;
  triggerButtonProps?: AnyObject;
}

export const ModalFunctionEditor = forwardRef(
  ({ value, onChange, label, triggerLabel = 'Edit', triggerButtonProps = {}, defaultValue }: Props, _ref: any) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal opened={opened} onClose={close} title="Authentication" withinPortal zIndex={320} size="900px">
          <Box h={600}>
            <InlineFunctionInput value={value} onChange={onChange} defaultValue={defaultValue} label={label} />
          </Box>
        </Modal>

        <Button onClick={open} {...triggerButtonProps}>
          {triggerLabel}
        </Button>
      </>
    );
  },
);
