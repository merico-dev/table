import { Group, Select, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { TMetricPostfix } from '../../type';
import { useTranslation } from 'react-i18next';

type Props = {
  value: TMetricPostfix;
  onChange: (v: TMetricPostfix) => void;
};

export const PostfixField = observer(
  forwardRef(({ value: postfix, onChange }: Props, _ref: any) => {
    const { t, i18n } = useTranslation();
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

    const postfixTypeOptions: { label: string; value: TMetricPostfix['type'] }[] = useMemo(
      () => [
        {
          label: t('viz.merico_stats.metric.postfix_type.text'),
          value: 'text',
        },
        {
          label: t('viz.merico_stats.metric.postfix_type.filter'),
          value: 'filter-option-label',
        },
      ],
      [i18n.language],
    );

    return (
      <Group grow noWrap>
        <Select
          label={t('viz.merico_stats.metric.postfix_type.label')}
          data={postfixTypeOptions}
          value={postfix.type}
          onChange={changeType}
        />
        {postfix.type === 'text' && (
          <TextInput
            label={t('viz.merico_stats.metric.postfix_content')}
            value={postfix.value}
            onChange={(e) => {
              changeValue(e.currentTarget.value);
            }}
          />
        )}
        {postfix.type === 'filter-option-label' && (
          <Select
            label={t('viz.merico_stats.metric.postfix_filter')}
            value={postfix.value}
            onChange={changeValue}
            data={filterSelects}
          />
        )}
      </Group>
    );
  }),
);
