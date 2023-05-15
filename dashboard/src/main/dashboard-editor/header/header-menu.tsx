import { ActionIcon, Menu } from '@mantine/core';
import { IconCode, IconDownload, IconMenu2 } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';
import { downloadJSON } from '~/utils/download';

export const HeaderMenu = observer(() => {
  const model = useContentModelContext();

  const downloadSchema = () => {
    const schema = JSON.stringify(model.json, null, 2);
    downloadJSON(model.name, schema);
  };

  return (
    <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400}>
      <Menu.Target>
        <ActionIcon variant="light" color="blue">
          <IconMenu2 size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconDownload size={14} />} onClick={model.queries.downloadAllData}>
          Download Data
        </Menu.Item>
        <Menu.Item icon={<IconCode size={14} />} onClick={downloadSchema}>
          Download Schema
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
});
