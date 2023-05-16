import { useDisclosure } from '@mantine/hooks';
import { TModalState } from './types';

export function useModalState(): TModalState {
  const [opened, { open, close }] = useDisclosure(false);
  return {
    opened,
    open,
    close,
  };
}
