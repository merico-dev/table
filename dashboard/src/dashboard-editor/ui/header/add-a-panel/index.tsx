import { Button, Tooltip } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType } from '~/model';

const ButtonSx: EmotionSx = {
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
      <Tooltip label={t('common.choose_a_tab_first')}>
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
          {t('panel.add')}
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
      {t('panel.add')}
    </Button>
  );
});
