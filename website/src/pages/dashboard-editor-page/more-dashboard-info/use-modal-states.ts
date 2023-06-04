import { useDisclosure } from '@mantine/hooks';
import { TModalState, TModalStates } from './types';

function useModalState(): TModalState {
  const [opened, { open, close }] = useDisclosure(false);
  return {
    opened,
    open,
    close,
  };
}

export function useModalStates(): TModalStates {
  const changelog = useModalState();
  const version = useModalState();
  return {
    changelog,
    version,
  };
}
