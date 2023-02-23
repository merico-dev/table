import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';

interface IAddAPanel {
  parentID?: string;
}

export const AddAPanel = observer(({ parentID }: IAddAPanel) => {
  const model = useModelContext();
  if (!parentID) {
    return null;
  }
  const view = model.views.findByID(parentID);
  if (!view) {
    return null;
  }
  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={view.panels.addANewPanel}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      Add a Panel
    </Button>
  );
});
