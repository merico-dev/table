import { ActionIcon, Box, Menu, NavLink } from '@mantine/core';
import { IconCopy, IconDotsVertical } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { NavOptionType } from '~/dashboard-editor/model/editor';
import { ActionButton } from './action-button';
import classes from './nav-links.module.css';

interface ISettingsNavLink {
  option: NavOptionType;
}

const SettingsNavLink = observer(({ option }: ISettingsNavLink) => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();

  const editor = useEditDashboardContext().editor;
  const isActive = editor.isOptionActive;
  const active = isActive(editor.path, option);
  const isOpened = editor.isOptionOpened;
  const onClick = editor.navigate;
  const defaultOpened = isOpened(option);
  const [opened, setOpened] = useState(defaultOpened);
  useEffect(() => {
    setOpened(defaultOpened);
  }, [defaultOpened]);

  const isQuery = option._type === 'query';
  return (
    <NavLink
      pos="relative"
      key={option.label}
      active={active}
      defaultOpened={defaultOpened}
      opened={opened}
      onChange={setOpened}
      label={t(option.label)}
      onClick={() => onClick(option)}
      leftSection={option.Icon ? <option.Icon size={18} /> : null}
      rightSection={
        isQuery ? (
          <Menu trigger="hover" position="right" withArrow shadow="xl">
            <Menu.Target>
              <ActionIcon variant="subtle" className={classes.menu_target}>
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconCopy size={16} />}
                onClick={() => content.queries.duplicateByID(option.value)}
              >
                {t('common.actions.duplicate')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : null
      }
      className={isQuery ? classes.query : ''}
    >
      {option.children?.map((o) =>
        o._type === 'ACTION' ? (
          <ActionButton key={`_ADD_${o.value}_`} action_type={o._action_type} parentID={o.parentID} />
        ) : (
          <SettingsNavLink key={o.value} option={o} />
        ),
      )}
    </NavLink>
  );
});

export const SettingsNavLinks = observer(() => {
  const model = useEditDashboardContext();

  return (
    <Box sx={{ position: 'relative' }}>
      {model.editor.navOptions.map((v) => (
        <SettingsNavLink key={v.value} option={v} />
      ))}
    </Box>
  );
});
