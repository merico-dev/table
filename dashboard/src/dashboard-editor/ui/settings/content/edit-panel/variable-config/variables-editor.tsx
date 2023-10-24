import { Button, Divider, Group, Select, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { VariableConfigUIModel, useConfigUIModel } from './model';

import { IconPlus } from '@tabler/icons-react';
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

  return (
    <Stack>
      <Group position="left">
        <Select
          label="Variables"
          data={model.variableOptions}
          value={model.selected?.name}
          onChange={model.selectByName}
          maxDropdownHeight={600}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="light"
          size="xs"
          leftIcon={<IconPlus size={16} />}
          onClick={model.addNew}
          sx={{ flexGrow: 0, flexShrink: 0, alignSelf: 'flex-end', height: '38px' }}
        >
          Add Variable
        </Button>
      </Group>
      <Divider variant="dashed" />

      {model.selected ? (
        <VariableEditor uiModel={model} variable={model.selected} />
      ) : (
        <span>Select or create a new variable on right side</span>
      )}
    </Stack>
  );
});
