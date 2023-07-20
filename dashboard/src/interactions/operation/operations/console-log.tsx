import { TextInput } from '@mantine/core';
import { template } from 'lodash';
import { useStorageData } from '~/components/plugins';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

export interface IConsoleLogOperationConfig {
  template: string;
}

function useConfigTemplate(operation: IDashboardOperation) {
  const { value, set } = useStorageData<IConsoleLogOperationConfig>(operation.operationData, 'config');
  const setTemplate = (str: string) => void set({ template: str });
  return [value?.template || '', setTemplate] as const;
}

function ConsoleLogOperationSettings(props: IOperationConfigProps) {
  const [template, setTemplate] = useConfigTemplate(props.operation);
  return (
    <TextInput defaultValue={template} onBlur={(event) => setTemplate(event.currentTarget.value)} label="console.log" />
  );
}

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const config = await operation.operationData.getItem<IConsoleLogOperationConfig>('config');
  const compiled = template(config.template || '');
  console.log('run with payload', payload);
  console.log(compiled(payload));
}

export const ConsoleLog: IDashboardOperationSchema = {
  displayName: 'console.log (debug)',
  id: 'builtin:op:debug',
  configRender: ConsoleLogOperationSettings,
  run,
};
