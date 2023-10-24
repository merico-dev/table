import { Box, Button, Group, Paper, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import {
  VariableConfigUIModel,
  useConfigUIModel,
} from '~/dashboard-editor/ui/settings/content/edit-panel/variable-config/model';
import { useStyles } from '~/dashboard-editor/ui/settings/content/edit-panel/variable-config/styles';
import { VariableEditor } from './variable-editor';

interface IVariableListProps {
  uiModel: VariableConfigUIModel;
}

export const VariableList = observer((props: IVariableListProps) => {
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
});

export const VariablesEditor = observer(() => {
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
});
