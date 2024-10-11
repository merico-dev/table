import { ComboboxItem, Select, SelectProps, Stack, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../api-caller';
import { IStyles } from './styles';

type RoleOptionItem = ComboboxItem & {
  label: string;
  value: string;
  description: string;
};

const RoleOptionItem: SelectProps['renderOption'] = ({ option, ...others }) => {
  const { label, value, description } = option as RoleOptionItem;
  return (
    <Stack gap={2} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" c="dimmed" className="role-description">
        {description}
      </Text>
    </Stack>
  );
};

interface IRoleSelector {
  value: string;
  onChange: (v: string) => void;
  styles: IStyles;
}
export const RoleSelector = forwardRef(({ styles, value, onChange }: IRoleSelector, ref: $TSFixMe) => {
  const { t } = useTranslation();
  const { data: roleOptions = [], loading: roleLoading } = useRequest(
    async () => {
      const data = await APICaller.role.list();
      return data.map((d) => ({
        label: d.id,
        value: d.id,
        description: d.description,
        disabled: d.id === 'SUPERADMIN',
      }));
    },
    {
      refreshDeps: [],
    },
  );
  return (
    <Select
      ref={ref}
      mb={styles.spacing}
      size={styles.size}
      required
      label={t('role.label')}
      renderOption={RoleOptionItem}
      data={roleOptions}
      disabled={roleLoading}
      styles={() => ({
        item: {
          '&[data-selected]': {
            '&, &:hover': {
              '.role-description': {
                color: 'rgba(255,255,255,.8)',
              },
            },
          },
        },
      })}
      value={value}
      onChange={(v: string | null) => v !== null && onChange(v)}
      comboboxProps={{
        withinPortal: true,
      }}
      maxDropdownHeight={500}
    />
  );
});
