import { Checkbox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ChangeEventHandler } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';

type CheckerProps = {
  queryModel: QueryModelInstance;
  variable: string;
};

const Checker = observer(({ queryModel, variable }: CheckerProps) => {
  const checked = queryModel.keyInRunBy(variable);
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (e) => {
    queryModel.changeRunByRecord(variable, e.currentTarget.checked);
  };
  return <Checkbox size="xs" checked={checked} onChange={handleCheck} color="red" />;
});

type Props = {
  queryModel: QueryModelInstance;
  variable: string | null;
};
export const RunByCheckbox = ({ queryModel, variable }: Props) => {
  if (!variable) {
    return null;
  }
  return <Checker queryModel={queryModel} variable={variable} />;
};
