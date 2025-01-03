import { Button, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { MinimalMonacoEditor } from '~/components/widgets/minimal-monaco-editor';
import { QueryRenderModelInstance } from '~/model';
import { QueryDependency } from './query-dependency';
import { useTranslation } from 'react-i18next';
import { DBQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/db-query';

interface IEditSQL {
  queryModel: QueryRenderModelInstance;
}

const defaultValue = 'SELECT 1';

export const EditSQL = observer(({ queryModel }: IEditSQL) => {
  const { t } = useTranslation();
  const config = queryModel.config as DBQueryMetaInstance;
  const [localValue, setLocalValue] = useState<string>(config.sql);

  const handleOk = () => {
    config.setSQL(localValue);
  };

  const handleCancel = () => {
    setLocalValue(config.sql);
  };

  const resetFuncContent = () => {
    setLocalValue(defaultValue);
  };

  useEffect(() => {
    setLocalValue(config.sql);
  }, [config.sql]);

  const hasChanges = localValue !== config.sql;

  return (
    <Stack gap={4} sx={{ height: '100%' }}>
      <Group mb={6} justify="space-between" sx={{ flexShrink: 0, flexGrow: 0 }}>
        <Group justify="flex-start">
          <QueryDependency queryModel={queryModel} />
        </Group>
        <Group justify="flex-end">
          <Button onClick={resetFuncContent} size="xs" variant="default" leftSection={<IconPlayerSkipBack size={16} />}>
            {t('common.actions.reset_to_default')}
          </Button>
          <Button
            onClick={handleCancel}
            color="red"
            size="xs"
            disabled={!hasChanges}
            leftSection={<IconRecycle size={16} />}
          >
            {t('common.actions.revert_changes')}
          </Button>
          <Button
            color="green"
            size="xs"
            onClick={handleOk}
            disabled={!hasChanges}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            {t('common.actions.save_changes')}
          </Button>
        </Group>
      </Group>
      <MinimalMonacoEditor
        height="100%"
        value={localValue}
        onChange={setLocalValue}
        theme="sql-dark"
        defaultLanguage="sql"
      />
    </Stack>
  );
});
