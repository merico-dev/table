import { ActionIcon, HoverCard, Table } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { IconEye } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

function HoverToSeeContent({ content }: { content: string }) {
  return (
    <HoverCard width="60vw" shadow="md">
      <HoverCard.Target>
        <ActionIcon size={16} color="blue" variant="subtle">
          <IconEye />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <CodeHighlight language="sql" withCopyButton={false} code={content} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export const GlobalSQLSnippetsTable = observer(() => {
  const model = useEditDashboardContext();
  const list = [...model.globalSQLSnippets.list];
  if (list.length === 0) {
    return null;
  }
  return (
    <Table horizontalSpacing="xs" verticalSpacing="xs" fz="sm" highlightOnHover>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {list.map((snippet) => {
          const { id, content } = snippet;
          return (
            <tr key={id}>
              <td>{id}</td>
              <td width={200}>
                <HoverToSeeContent content={content} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
});
