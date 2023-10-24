import { Button, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';

import { useCreation } from 'ahooks';
import { getSnapshot } from 'mobx-state-tree';
import { useEditPanelContext } from '~/contexts';
import { VariableConfigUIModel } from './model';

import { TemplateVariableField } from './variable-field';
import { VariableMetaInstance, createDraft } from '~/model';
import { VariablePreview } from './variable-preview';

// todo: support validation

export const VariableEditor = observer((props: { variable: VariableMetaInstance; uiModel: VariableConfigUIModel }) => {
  const draft = useCreation(() => createDraft(props.variable), [props.variable]);
  const { data } = useEditPanelContext();
  return (
    <Stack data-testid="variable-editor" align="stretch">
      {/* <VariablePreview variable={getSnapshot(draft.copy)} data={data} /> */}
      <Group position="apart">
        <Button
          size="xs"
          variant="subtle"
          color="red"
          leftIcon={<IconTrash size={16} />}
          onClick={() => props.uiModel.remove(props.variable)}
        >
          Delete this variable
        </Button>
        <Button
          variant="filled"
          size="xs"
          disabled={!draft.changed}
          color="green"
          onClick={draft.commit}
          leftIcon={<IconDeviceFloppy size={18} />}
        >
          Save Changes
        </Button>
      </Group>
      <TemplateVariableField value={getSnapshot(draft.copy)} onChange={draft.update} data={data} />
    </Stack>
  );
});
