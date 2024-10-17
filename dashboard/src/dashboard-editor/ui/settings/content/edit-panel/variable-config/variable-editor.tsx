import { Button, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';

import { useCreation } from 'ahooks';
import { getSnapshot } from 'mobx-state-tree';
import { VariableConfigUIModel } from './model';

import { VariableMetaInstance, createDraft } from '~/model';
import { TemplateVariableField } from './variable-field';
import { useTranslation } from 'react-i18next';

export const VariableEditor = observer((props: { variable: VariableMetaInstance; uiModel: VariableConfigUIModel }) => {
  const { t } = useTranslation();
  const draft = useCreation(() => createDraft(props.variable), [props.variable]);
  const remove = () => props.uiModel.remove(props.variable);
  return (
    <Stack data-testid="variable-editor" align="stretch">
      <Group justify="space-between">
        <Button
          variant="subtle"
          size="xs"
          disabled={!draft.changed}
          color="red"
          onClick={draft.reset}
          leftSection={<IconRecycle size={18} />}
        >
          {t('common.actions.revert_changes')}
        </Button>
        <Button
          variant="filled"
          size="xs"
          disabled={!draft.changed}
          color="green"
          onClick={draft.commit}
          leftSection={<IconDeviceFloppy size={18} />}
        >
          {t('common.actions.save_changes')}
        </Button>
      </Group>

      <TemplateVariableField value={getSnapshot(draft.copy)} onChange={draft.update} remove={remove} />
    </Stack>
  );
});
