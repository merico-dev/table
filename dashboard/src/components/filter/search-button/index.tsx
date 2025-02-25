import { Button, Menu } from '@mantine/core';
import { IconChevronDown, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useDashboardThemeContext } from '~/contexts';
import { RenderSearchButtonProps } from '~/index';

export const SearchButton = ({ disabled, onSubmit }: RenderSearchButtonProps) => {
  const { t } = useTranslation();
  const { renderSearchButton } = useDashboardThemeContext();
  if (renderSearchButton) {
    return renderSearchButton({ disabled, onSubmit });
  }
  return (
    <Button.Group>
      <Button color="blue" size="sm" onClick={() => onSubmit()} disabled={disabled}>
        {t('common.actions.search')}
      </Button>
      <Menu trigger="hover" disabled={disabled} position="bottom-end">
        <Menu.Target>
          <Button
            disabled={disabled}
            color="blue"
            px="xs"
            style={{ borderLeft: `1px solid ${disabled ? 'white' : 'var(--mantine-color-gray-4)'}` }}
          >
            <IconChevronDown size={16} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconRefresh size={14} />}
            disabled={disabled}
            onClick={() => onSubmit({ force: true })}
          >
            {t('common.actions.reload')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Button.Group>
  );
};
