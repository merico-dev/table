import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { PermissionModelInstance } from '../model';

interface IAddAnAccessRule {
  model: PermissionModelInstance;
}

export const AddAnAccessRule = observer(({ model }: IAddAnAccessRule) => {
  return (
    <Button size="xs" variant="light" leftIcon={<IconUserPlus size={14} />} onClick={model.addAnAccess}>
      Add an access rule
    </Button>
  );
});
