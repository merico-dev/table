import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { PermissionModelInstance } from '../model';

interface IAddAPermissionRule {
  model: PermissionModelInstance;
}

export const AddAPermissionRule = observer(({ model }: IAddAPermissionRule) => {
  return (
    <Button size="xs" variant="light" leftIcon={<IconUserPlus size={14} />}>
      Add a permission rule
    </Button>
  );
});
