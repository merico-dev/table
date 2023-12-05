import { observer } from 'mobx-react-lite';
import { FilterMetaInstance } from '~/model';
import { ModalFunctionEditor } from '../widgets/modal-function-editor';
import { IconMathFunction } from '@tabler/icons-react';
import { Alert, List } from '@mantine/core';

// TODO: introduce filter & state
const DefaultValueFuncTemplate = ['function getDefaultValue(filter, utils, state) {', '    return "";', '}'].join('\n');

type Props = {
  filter: FilterMetaInstance;
};

export const CustomDefaultValueEditor = observer(({ filter }: Props) => {
  return (
    <ModalFunctionEditor
      label=""
      title="Custom Default Value"
      triggerLabel="Default by function"
      value={filter.default_value_func}
      onChange={filter.setDefaultValueFunc}
      defaultValue={DefaultValueFuncTemplate}
      triggerButtonProps={{
        size: 'xs',
        color: 'grape',
        sx: { flexGrow: 0, alignSelf: 'flex-start' },
        leftIcon: <IconMathFunction size={16} />,
      }}
      description={
        <Alert title="Tips" color="gray" mb={16}>
          <List size={13} type="ordered">
            <List.Item>Function has the highest priority of getting filter's default value</List.Item>
            <List.Item>Leave this editor empty to disable this feature</List.Item>
          </List>
        </Alert>
      }
    />
  );
});
