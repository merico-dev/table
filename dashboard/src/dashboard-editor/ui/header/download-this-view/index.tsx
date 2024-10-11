import { Button, Tooltip } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconCode } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType } from '~/model';

const ButtonSx: EmotionSx = {
  height: '30px',
  borderRight: 'none',
  borderTop: 'none',
  borderLeft: '1px solid #e9ecef',
  borderBottom: '1px solid #e9ecef',
};

export const DownloadThisView = observer(() => {
  const { t } = useTranslation();
  const contentModel = useEditContentModelContext();
  const cant = contentModel.views.VIE?.type === EViewComponentType.Tabs;
  const download = () => contentModel.views.VIE?.downloadSchema();
  if (cant) {
    return (
      <Tooltip label={t('common.choose_a_tab_first')}>
        <Button
          variant="outline"
          color="gray"
          radius={0}
          size="xs"
          leftIcon={<IconCode size={16} />}
          sx={{
            ...ButtonSx,
            transform: 'none !important',
          }}
        >
          {t('view.download_schema')}
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
      onClick={download}
      leftIcon={<IconCode size={16} />}
      sx={{
        ...ButtonSx,
        // background: 'rgb(231, 245, 255)',
      }}
    >
      {t('view.download_schema')}
    </Button>
  );
});
