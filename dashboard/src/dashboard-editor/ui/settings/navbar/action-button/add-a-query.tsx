import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { DataSourceType, QueryRenderModelInstance } from '~/model';

export const AddAQuery = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const add = () => {
    const id = new Date().getTime().toString();
    const v = {
      id,
      name: id,
      type: DataSourceType.Postgresql,
      key: '',
      sql: '',
    } as QueryRenderModelInstance;
    model.content.queries.append(v);
    model.editor.setPath(['_QUERIES_', id]);
  };

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={add}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      {t('query.add')}
    </Button>
  );
});
