import { ActionIcon, Menu } from '@mantine/core';
import { IconCode, IconDownload, IconMenu2 } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useContentModelContext, useModelContext } from '~/contexts';
import { downloadJSON } from '~/utils/download';

interface IProps {
  headerMenuItems?: ReactNode;
}
export const HeaderMenu = observer(({ headerMenuItems = null }: IProps) => {
  const model = useModelContext();
  const content = useContentModelContext();

  const downloadSchema = () => {
    const schema = JSON.stringify(content.json, null, 2);
    const filename = `${model.name}__${content.name}`;
    downloadJSON(filename, schema);
  };

  return (
    <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400} withinPortal zIndex={310}>
      <Menu.Target>
        <ActionIcon variant="light" color="blue">
          <IconMenu2 size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconDownload size={14} />} onClick={content.queries.downloadAllData}>
          Download Data
        </Menu.Item>
        <Menu.Item icon={<IconCode size={14} />} onClick={downloadSchema}>
          Download Schema
        </Menu.Item>
        {headerMenuItems}
      </Menu.Dropdown>
    </Menu>
  );
});
