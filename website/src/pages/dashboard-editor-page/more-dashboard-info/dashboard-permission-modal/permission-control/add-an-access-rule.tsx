import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { PermissionModelInstance } from '../model';

interface IAddAnAccessRule {
  model: PermissionModelInstance;
}

export const AddAnAccessRule = observer(({ model }: IAddAnAccessRule) => {
  const disabled = model.hasEmptyAccess || model.options.allOptionsAreChosen;
  console.log({
    allOptionsAreChosen: model.options.allOptionsAreChosen,
    hasEmptyAccess: model.hasEmptyAccess,
    options: model.options.list,
  });
  return (
    <Button
      size="xs"
      variant="light"
      leftIcon={<IconUserPlus size={14} />}
      onClick={() => model.addAnAccess(`TEMP_${new Date().getTime()}`)}
      disabled={disabled || model.options.loading}
    >
      Add an access rule
    </Button>
  );
});
