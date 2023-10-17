import { Button, Sx, Tooltip } from '@mantine/core';
import { IconCode, IconPlaylistAdd } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { EViewComponentType } from '~/model';

const ButtonSx: Sx = {
  height: '30px',
  borderRight: 'none',
  borderTop: 'none',
  borderLeft: '1px solid #e9ecef',
  borderBottom: '1px solid #e9ecef',
};

export const DownloadThisView = observer(() => {
  const contentModel = useEditContentModelContext();
  const cant = contentModel.views.VIE?.type === EViewComponentType.Tabs;
  const download = () => contentModel.views.VIE?.downloadSchema();
  if (cant) {
    return (
      <Tooltip label="Please choose a tab first">
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
          Download this View
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
      Download this View
    </Button>
  );
});
