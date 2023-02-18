import { ActionIcon, Group, Header as MantineHeader, Text, Tooltip } from '@mantine/core';
import { IconCode, IconDeviceFloppy, IconDownload, IconFileDownload, IconRecycle } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useModelContext } from '~/contexts';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { downloadJSON } from '~/utils/download';

export const DashboardEditorHeader = observer(({ saveDashboardChanges }: { saveDashboardChanges: () => void }) => {
  const model = useModelContext();

  const getCurrentSchema = useCallback(() => {
    const queries = model.queries.json;
    const views = model.views.json;
    const sqlSnippets = model.sqlSnippets.json;
    const filters = model.filters.current;
    const mock_context = model.mock_context.current;
    return {
      filters,
      views,
      definition: {
        sqlSnippets,
        queries,
        mock_context,
      },
      version: model.version,
    };
  }, [model]);

  const revertChanges = () => {
    model.reset();
  };

  const downloadSchema = () => {
    const schema = JSON.stringify(getCurrentSchema(), null, 2);
    downloadJSON(model.name, schema);
  };

  const hasChanges = model.changed;

  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group>
          <Text size="xl">{model.name}</Text>
        </Group>
        <Group position="right">
          <Group spacing={0} sx={ActionIconGroupStyle}>
            <Tooltip label="Download Schema">
              <ActionIcon variant="default" size="md" onClick={downloadSchema}>
                <IconCode size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Download Data">
              <ActionIcon variant="default" size="md" onClick={model.queries.downloadAllData}>
                <IconDownload size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group spacing={0} sx={ActionIconGroupStyle}>
            <Tooltip label="Save Changes">
              <ActionIcon variant="default" size="md" onClick={saveDashboardChanges} disabled={!hasChanges}>
                <IconDeviceFloppy size={20} color="green" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Revert Changes">
              <ActionIcon variant="default" size="md" disabled={!hasChanges} onClick={revertChanges}>
                <IconRecycle size={20} color="red" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </MantineHeader>
  );
});
