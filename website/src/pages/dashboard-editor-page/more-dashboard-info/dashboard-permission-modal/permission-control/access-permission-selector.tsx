import { Select } from '@mantine/core';
import { AccessPermissionOptions, AccessPermissionType } from '../../../../../api-caller/dashboard-permission.types';

interface IAccessPermissionSelector {
  value: AccessPermissionType;
  onChange: (value: AccessPermissionType) => void;
}
export const AccessPermissionSelector = ({ value, onChange }: IAccessPermissionSelector) => {
  return (
    <Select
      size="xs"
      value={value}
      onChange={(v: string | null) => v !== null && onChange(v as AccessPermissionType)}
      data={AccessPermissionOptions}
      comboboxProps={{
        withinPortal: true,
        zIndex: 320,
      }}
    />
  );
};
