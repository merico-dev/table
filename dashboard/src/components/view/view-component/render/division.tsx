import { ActionIcon, Box, Menu, Sx } from '@mantine/core';
import { IconCamera, IconCode, IconDownload, IconShare3 } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useRenderContentModelContext, useRenderDashboardContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { downloadJSON } from '~/utils/download';
import { useDownloadDivScreenshot } from '../utils';

export const DivActions = observer(({ downloadScreenShot }: { downloadScreenShot: () => void }) => {
  const model = useRenderDashboardContext();
  const content = useRenderContentModelContext();

  const downloadSchema = () => {
    const schema = JSON.stringify(content.json, null, 2);
    const filename = `${model.name}__${content.name}`;
    downloadJSON(filename, schema);
  };

  return (
    <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400} withinPortal position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="light" color="grape" sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <IconShare3 size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconCamera size={14} />} onClick={downloadScreenShot}>
          Screenshot
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<IconDownload size={14} />} onClick={content.queries.downloadAllData}>
          Download Data
        </Menu.Item>
        <Menu.Item icon={<IconCode size={14} />} onClick={downloadSchema}>
          Download Schema
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
});

export const RenderViewDivision = observer(
  ({ children, view, sx = {} }: { children: ReactNode; view: ViewMetaInstance; sx?: Sx }) => {
    const { ref, downloadScreenshot } = useDownloadDivScreenshot(view);
    return (
      <>
        <Box ref={ref} sx={sx}>
          {children}
        </Box>
        <DivActions downloadScreenShot={downloadScreenshot} />
      </>
    );
  },
);
