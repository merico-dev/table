import { Button, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { MinimalMonacoEditor } from '~/components/widgets/minimal-monaco-editor';
import { QueryRenderModelInstance } from '~/model';
import { QueryDependency } from './query-dependency';
import { useTranslation } from 'react-i18next';

interface IEditSQL {
  queryModel: QueryRenderModelInstance;
}

const defaultValue = 'SELECT 1';

export const EditSQL = observer(({ queryModel }: IEditSQL) => {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState<string>(queryModel.sql);

  const handleOk = () => {
    queryModel.setSQL(localValue);
  };

  const handleCancel = () => {
    setLocalValue(queryModel.sql);
  };

  const resetFuncContent = () => {
    setLocalValue(defaultValue);
  };

  useEffect(() => {
    setLocalValue(queryModel.sql);
  }, [queryModel.sql]);

  const hasChanges = localValue !== queryModel.sql;

  return (
    <Stack spacing={4} sx={{ height: '100%' }}>
      <Group mb={6} position="apart" sx={{ flexShrink: 0, flexGrow: 0 }}>
        <Group position="left">
          <QueryDependency queryModel={queryModel} />
        </Group>
        <Group position="right">
          <Button onClick={resetFuncContent} size="xs" variant="default" leftIcon={<IconPlayerSkipBack size={16} />}>
            {t('common.actions.reset_to_default')}
          </Button>
          <Button
            onClick={handleCancel}
            color="red"
            size="xs"
            disabled={!hasChanges}
            leftIcon={<IconRecycle size={16} />}
          >
            {t('common.actions.revert_changes')}
          </Button>
          <Button
            color="green"
            size="xs"
            onClick={handleOk}
            disabled={!hasChanges}
            leftIcon={<IconDeviceFloppy size={16} />}
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
