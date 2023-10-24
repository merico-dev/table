import { ActionIcon, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';

import { useCreation } from 'ahooks';
import { getSnapshot } from 'mobx-state-tree';
import { useEditPanelContext } from '~/contexts';
import { VariableConfigUIModel } from '~/dashboard-editor/ui/settings/content/edit-panel/variable-config/model';
import { useStyles } from '~/dashboard-editor/ui/settings/content/edit-panel/variable-config/styles';
import { TemplateVariableField } from '~/dashboard-editor/ui/settings/content/edit-panel/variable-config/variable-field';
import { VariableMetaInstance, createDraft } from '~/model';
import { VariablePreview } from './variable-preview';

// todo: support validation

export const VariableEditor = observer((props: { variable: VariableMetaInstance; uiModel: VariableConfigUIModel }) => {
  const draft = useCreation(() => createDraft(props.variable), [props.variable]);
  const { classes } = useStyles();
  const { data } = useEditPanelContext();
  return (
    <Group style={{ height: '100%' }} align="start">
      <Stack data-testid="variable-editor" align="stretch" className={classes.config}>
        <Group position="right">
          <ActionIcon variant="filled" disabled={!draft.changed} color="primary" onClick={draft.commit}>
            <IconDeviceFloppy size={18} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => props.uiModel.remove(props.variable)}>
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
        <TemplateVariableField value={getSnapshot(draft.copy)} onChange={draft.update} data={data} />
      </Stack>
      <VariablePreview variable={getSnapshot(draft.copy)} data={data} />
    </Group>
  );
});
