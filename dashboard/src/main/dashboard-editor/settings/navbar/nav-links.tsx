import { Box, NavLink } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { NavOptionType } from '~/model/editor';
import { AddItemButton } from './add-item-button';

interface ISettingsNavLink {
  onClick: (option: NavOptionType, parentID?: string) => void;
  option: NavOptionType;
}

function SettingsNavLink({ option, onClick }: ISettingsNavLink) {
  return (
    <NavLink
      key={option.label}
      active={false}
      label={option.label}
      onClick={() => onClick(option)}
      icon={option.Icon ? <option.Icon size={18} /> : null}
    >
      {option.children?.map((o) =>
        o._type === 'ACTION' ? (
          <AddItemButton key={`_ADD_${o.value}_`} action_type={o._action_type} />
        ) : (
          <SettingsNavLink key={o.value} option={o} onClick={onClick} />
        ),
      )}
    </NavLink>
  );
}

export const SettingsNavLinks = observer(() => {
  const model = useModelContext();
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {model.editor.navOptions.map((v) => (
        <SettingsNavLink key={v.value} option={v} onClick={model.editor.navigate} />
      ))}
    </Box>
  );
});
