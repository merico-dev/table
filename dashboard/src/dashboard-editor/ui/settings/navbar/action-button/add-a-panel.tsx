import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType } from '~/model';

interface IAddAPanel {
  parentID?: string;
}

export const AddAPanel = observer(({ parentID }: IAddAPanel) => {
  const { t } = useTranslation();
  const model = useEditContentModelContext();
  if (!parentID) {
    return null;
  }
  const view = model.views.findByID(parentID);
  if (!view || view.type === EViewComponentType.Tabs) {
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
      onClick={() => model.addANewPanel(view.id)}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      {t('panel.add')}
    </Button>
  );
});
