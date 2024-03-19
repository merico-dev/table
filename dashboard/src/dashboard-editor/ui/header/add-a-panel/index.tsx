import { Button, Sx, Tooltip } from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType } from '~/model';

const ButtonSx: Sx = {
  height: '30px',
  borderLeft: 'none',
  borderTop: 'none',
  borderRight: '1px solid #e9ecef',
  borderBottom: '1px solid #e9ecef',
};

export const AddAPanel = observer(() => {
  const { t } = useTranslation();
  const contentModel = useEditContentModelContext();
  const cant = contentModel.views.VIE?.type === EViewComponentType.Tabs;
  const add = () => contentModel.addANewPanel(contentModel.views.idOfVIE);
  if (cant) {
    return (
      <Tooltip label="Please choose a tab first">
        <Button
          variant="outline"
          color="gray"
          radius={0}
          size="xs"
          leftIcon={<IconPlaylistAdd size={20} />}
          sx={{
            ...ButtonSx,
            transform: 'none !important',
          }}
        >
          {t('Add a Panel')}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outline"
      color="blue"
      radius={0}
      size="xs"
      onClick={add}
      leftIcon={<IconPlaylistAdd size={20} />}
      sx={{
        ...ButtonSx,
        background: 'rgb(231, 245, 255)',
      }}
    >
      {t('Add a Panel')}
    </Button>
  );
});
