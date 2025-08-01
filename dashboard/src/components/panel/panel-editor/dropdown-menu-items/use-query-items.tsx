import { Divider, Menu } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext, useEditPanelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { OpenTabData } from './open-tab-data';

export const useQueryItems = (view: ViewMetaInstance) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const { panel } = useEditPanelContext();
  const queries = panel.realQueryOptions;
  const openQuery = (id: string) => {
    model.editor.open(['_QUERIES_', id]);
  };

  return useMemo(() => {
    if (queries.length === 0) {
      return [];
    }
    return [
      {
        order: 500,
        render: () => <Divider label={t(queries.length > 1 ? 'query.labels' : 'query.label')} labelPosition="center" />,
      },
      {
        order: 501,
        render: () => <OpenTabData panelID={panel.id} viewID={view.id} />,
      },
      ...queries.map((q, i) => ({
        order: 502 + i,
        render: () => (
          <Menu.Item key={q.value} onClick={() => openQuery(q.value)} leftSection={<IconDatabase size={14} />}>
            {q.label}
          </Menu.Item>
        ),
      })),
    ];
  }, [queries]);
};
