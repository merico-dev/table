import { Button, Divider, Group, Overlay, Select, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { VariableConfigUIModel, useConfigUIModel } from './model';

import { IconPlus } from '@tabler/icons-react';
import { VariableEditor } from './variable-editor';
import { useTranslation } from 'react-i18next';

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

const AddAVariableGuide = observer(({ model }: { model: VariableConfigUIModel }) => {
  const { t } = useTranslation();
  return (
    <Overlay color="#fff" opacity={1} sx={{ position: 'absolute' }}>
      <Button
        variant="light"
        size="xs"
        leftIcon={<IconPlus size={16} />}
        onClick={model.addNew}
        sx={{ flexGrow: 0, flexShrink: 0, alignSelf: 'flex-end', height: '38px' }}
      >
        {t('panel.variable.add')}
      </Button>
    </Overlay>
  );
});

export const VariablesEditor = observer(() => {
  const { t } = useTranslation();
  const model = useConfigUIModel();
  if (model.variableOptions.length === 0) {
    return <AddAVariableGuide model={model} />;
  }
  return (
    <Stack pb={20}>
      <Group position="left">
        <Select
          label={t('panel.variable.labels')}
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
          {t('panel.variable.add')}
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
