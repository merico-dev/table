import { Group, Select, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { TMetricPostfix } from '../../type';

const postfixTypeOptions: { label: string; value: TMetricPostfix['type'] }[] = [
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Filter Option Label',
    value: 'filter-option-label',
  },
];

type Props = {
  value: TMetricPostfix;
  onChange: (v: TMetricPostfix) => void;
};

export const PostfixField = observer(
  forwardRef(({ value: postfix, onChange }: Props, _ref: any) => {
    const contentModel = useEditContentModelContext();
    const filterSelects = contentModel.filters.selects;

    const changeType = (t: TMetricPostfix['type']) => {
      onChange({
        type: t,
        value: postfix.value,
      });
    };

    const changeValue = (v: TMetricPostfix['value']) => {
      onChange({
        type: postfix.type,
        value: v,
      });
    };

    return (
      <Group grow noWrap>
        <Select label="Postfix Type" data={postfixTypeOptions} value={postfix.type} onChange={changeType} />
        {postfix.type === 'text' && (
          <TextInput
            label="Postfix Content"
            value={postfix.value}
            onChange={(e) => {
              changeValue(e.currentTarget.value);
            }}
          />
        )}
        {postfix.type === 'filter-option-label' && (
          <Select label="Filter" value={postfix.value} onChange={changeValue} data={filterSelects} />
        )}
      </Group>
    );
  }),
);
