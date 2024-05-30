import { Divider, Menu } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext, useEditPanelContext } from '~/contexts';

export const QueryMenuItems = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const { panel } = useEditPanelContext();
  const queries = panel.realQueryOptions;
  const openQuery = (id: string) => {
    model.editor.open(['_QUERIES_', id]);
  };
  if (queries.length === 0) {
    return null;
  }
  return (
    <>
      <Divider label={t(queries.length > 1 ? 'query.labels' : 'query.label')} labelPosition="center" />
      {queries.map((q) => {
        return (
          <Menu.Item key={q.value} onClick={() => openQuery(q.value)} icon={<IconDatabase size={14} />}>
            {q.label}
          </Menu.Item>
        );
      })}
    </>
  );
});
