import { ActionIcon, Affix, Box, Menu } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconCamera, IconCode, IconDownload, IconShare3 } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useRenderContentModelContext, useRenderDashboardContext } from '~/contexts';
import { ViewRenderModelInstance } from '~/model';
import { downloadJSON } from '~/utils/download';
import { useDownloadDivScreenshot } from '../utils';

export const DivActions = observer(({ downloadScreenshot }: { downloadScreenshot: () => void }) => {
  const { t } = useTranslation();
  const [flag, { setTrue, setFalse }] = useBoolean(false);
  const model = useRenderDashboardContext();
  const content = useRenderContentModelContext();

  const downloadSchema = () => {
    const schema = JSON.stringify(content.contentJSON, null, 2);
    const filename = `${model.name}__${content.name}`;
    downloadJSON(filename, schema);
  };

  return (
    <Menu shadow="md" width={200} trigger="hover" openDelay={200} closeDelay={400} withinPortal position="bottom-end">
      <Menu.Target>
        <Affix position={{ bottom: '20px', right: '10px' }} zIndex={1}>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            onMouseEnter={setTrue}
            onMouseLeave={setFalse}
            sx={{
              opacity: flag ? 1 : 0.6,
              transform: `translateX(${flag ? 0 : '2px'})`,
              transition: 'all ease 300ms',
              borderRadius: '50%',
            }}
          >
            <IconShare3 size="1rem" />
          </ActionIcon>
        </Affix>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconCamera size={14} />} onClick={downloadScreenshot}>
          {t('common.actions.download_screenshot')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconDownload size={14} />} onClick={content.queries.downloadAllData}>
          {t('common.actions.download_data')}
        </Menu.Item>
        <Menu.Item leftSection={<IconCode size={14} />} onClick={downloadSchema}>
          {t('common.actions.download_schema')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
});

export const RenderViewDivision = observer(
  ({ children, view, sx = {} }: { children: ReactNode; view: ViewRenderModelInstance; sx?: EmotionSx }) => {
    const { ref, downloadScreenshot } = useDownloadDivScreenshot(view);
    return (
      <>
        <Box ref={ref} pt={10} pb={10} sx={sx}>
          {children}
        </Box>
        <DivActions downloadScreenshot={downloadScreenshot} />
      </>
    );
  },
);
