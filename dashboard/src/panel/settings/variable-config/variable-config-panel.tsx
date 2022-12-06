import { ActionIcon, Box, Button, Group, Paper, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons';

import { getSnapshot, Instance } from 'mobx-state-tree';
import { createDraft, VariableModel } from '~/model/variables';
import { useCreation } from 'ahooks';
import { useConfigUIModel, VariableConfigUIModel } from '~/panel/settings/variable-config/model';
import { TemplateVariableField } from '~/panel/settings/variable-config/variable-field';
import { useStyles } from '~/panel/settings/variable-config/styles';
import { usePanelContext } from '~/contexts';
import { ITemplateVariable, variable2Jsx } from '~/utils/template';
import { AnyObject } from '~/types';

export interface IVariableListProps {
  uiModel: VariableConfigUIModel;
}

const _VariableList = (props: IVariableListProps) => {
  const { uiModel } = props;
  return (
    <Stack className="var-list">
      {uiModel.variables.map((v) => (
        <Button
          key={v.name}
          variant={uiModel.selected === v ? 'filled' : 'subtle'}
          color="gray"
          onClick={() => uiModel.select(v)}
        >
          {v.name}
        </Button>
      ))}
    </Stack>
  );
};

export const VariableList = observer(_VariableList);

const _VariablePreview = ({ variable, data }: { variable: ITemplateVariable; data: AnyObject[] }) => (
  <Group style={{ minHeight: 0, height: 'calc(100% - 68px)' }}>
    <Paper withBorder p="md">
      {variable2Jsx(variable, data)}
    </Paper>
  </Group>
);
const VariablePreview = observer(_VariablePreview);

// todo: support validation

const _VariableEditor = (props: { variable: Instance<typeof VariableModel>; uiModel: VariableConfigUIModel }) => {
  const draft = useCreation(() => createDraft(props.variable), [props.variable]);
  const { classes } = useStyles();
  const { data } = usePanelContext();
  return (
    <Group style={{ height: '100%' }} align="start">
      <Stack data-testid="variable-editor" align="stretch" className={classes.config}>
        <Group position="right">
          <ActionIcon variant="filled" disabled={!draft.changed} color="primary" onClick={draft.commit}>
            <IconDeviceFloppy />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => props.uiModel.remove(props.variable)}>
            <IconTrash />
          </ActionIcon>
        </Group>
        <TemplateVariableField value={getSnapshot(draft.copy)} onChange={draft.update} data={data} />
      </Stack>
      <VariablePreview variable={getSnapshot(draft.copy)} data={data} />
    </Group>
  );
};
const VariableEditor = observer(_VariableEditor);

const _VariableConfig = () => {
  const model = useConfigUIModel();

  const { classes } = useStyles();
  return (
    <Group className={classes.root} noWrap align="start">
      <Paper withBorder p="md" className="var-list-container">
        <Stack justify="space-between">
          <Box className="var-list-actions">
            <Button variant="light" size="sm" onClick={model.addNew} fullWidth>
              Add Variable
            </Button>
          </Box>
          <VariableList uiModel={model} />
        </Stack>
      </Paper>
      {model.selected ? (
        <>
          <VariableEditor uiModel={model} variable={model.selected} />
        </>
      ) : (
        <span>Select or create a new variable on right side</span>
      )}
    </Group>
  );
};

export const VariableConfig = observer(_VariableConfig);
