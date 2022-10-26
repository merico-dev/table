import { Select, Stack, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { forwardRef } from 'react';
import { APICaller } from '../api-caller';
import { IStyles } from './styles';

interface IRoleOptionItem {
  label: string;
  value: string;
  description: string;
}

const RoleOptionItem = forwardRef<HTMLDivElement, IRoleOptionItem>(
  ({ label, value, description, ...others }: IRoleOptionItem, ref) => (
    <Stack spacing={2} ref={ref} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed" className="role-description">
        {description}
      </Text>
    </Stack>
  ),
);

interface IRoleSelector {
  value: number;
  onChange: (v: number) => void;
  styles: IStyles;
}
export const RoleSelector = forwardRef(({ styles, value, onChange }: IRoleSelector, ref: $TSFixMe) => {
  const { data: roleOptions = [], loading: roleLoading } = useRequest(
    async () => {
      const data = await APICaller.role.list();
      return data.map((d) => ({
        label: d.name,
        value: d.id,
        description: d.description,
        disabled: d.id === 50, // SUPERADMIN
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
      label="Role"
      itemComponent={RoleOptionItem}
      // @ts-expect-error value type
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
      // @ts-expect-error value type
      value={value}
      // @ts-expect-error value type
      onChange={onChange}
    />
  );
});
