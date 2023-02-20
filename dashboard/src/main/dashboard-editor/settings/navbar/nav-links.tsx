import { Box, Group, NavLink, Text, UnstyledButton } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useModelContext } from '~/contexts';
import { NavOptionType } from '~/model/editor';

interface ISettingsNavLink {
  onClick: () => void;
  option: NavOptionType;
}

function SettingsNavLink({ option, onClick }: ISettingsNavLink) {
  return (
    <NavLink key={option.label} active={false} label={option.label} onClick={onClick}>
      {option.children?.map((o) => (
        <SettingsNavLink key={o.value} option={o} onClick={onClick} />
      ))}
    </NavLink>
  );
}

export const SettingsNavLinks = observer(() => {
  const model = useModelContext();
  const getClickHandler = useCallback((id: string) => console.log, [model]);
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {model.editor.navOptions.map((v) => (
        <SettingsNavLink key={v.value} option={v} onClick={() => console.log} />
      ))}
    </Box>
  );
});
