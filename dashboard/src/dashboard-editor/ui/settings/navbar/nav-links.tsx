import { Box, NavLink } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useEditDashboardContext } from '~/contexts';
import { NavOptionType } from '~/dashboard-editor/model/editor';
import { ActionButton } from './action-button';
import { useTranslation } from 'react-i18next';

interface ISettingsNavLink {
  option: NavOptionType;
}

const SettingsNavLink = observer(({ option }: ISettingsNavLink) => {
  const { t } = useTranslation();
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

  return (
    <NavLink
      key={option.label}
      active={active}
      defaultOpened={defaultOpened}
      opened={opened}
      onChange={setOpened}
      label={t(option.label)}
      onClick={() => onClick(option)}
      leftSection={option.Icon ? <option.Icon size={18} /> : null}
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
