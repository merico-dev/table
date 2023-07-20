import { ActionIcon, HoverCard, Table } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { IconEye } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';

function HoverToSeeContent({ content }: { content: string }) {
  return (
    <HoverCard width="60vw" shadow="md">
      <HoverCard.Target>
        <ActionIcon size={16} color="blue">
          <IconEye />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Prism language="sql" noCopy withLineNumbers>
          {content}
        </Prism>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export const GlobalSQLSnippetsTable = observer(() => {
  const model = useModelContext();
  const list = [...model.globalSQLSnippets.list];
  if (list.length === 0) {
    return null;
  }
  return (
    <Table horizontalSpacing="xs" verticalSpacing="xs" fontSize="sm" highlightOnHover>
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
